// ============================================================
//  mirrorRoom.js — Shared logic for all mirror rooms
//
//  Each room that uses this system needs to define a
//  MIRROR_ROOM_CONFIG object before this script loads, e.g:
//
//  <script>
//  const MIRROR_ROOM_CONFIG = {
//      roomFile:        "room9.html",
//      scrollHalfSrc:   "../Assets/ITEMS/scroll_blue_Half_First.png",
//      scrollHalfItem:  "scroll_blue_Half_First",
//      scrollOtherItem: "scroll_blue_Half_Second",
//      storageKeyMine:  "requiem_scroll_first_picked",
//      storageKeyOther: "requiem_scroll_second_picked",
//      scrollPosition:  { x: 520, y: 280 },
//      hitboxes: [
//          { id: "teleporter-room1", x: 40, y: 85, width: 20, height: 15,
//            trigger: { type: "manual_teleport", room: "room1.html", spawn: { x: 99, y: 55 } } },
//          { id: "mirror-zone", x: 70, y: 30, width: 35, height: 70,
//            trigger: { type: "mirror", action: "show" } }
//      ]
//  };
//  </script>
// ============================================================


// ---- Sprite paths -------------------------------------------

const MIRROR_SPRITES = {
    front:      ["../Assets/Karakter/Front/Base/Front-Walking-1.png",
                 "../Assets/Karakter/Front/Base/Front-Walking-2.png"],

    back:       ["../Assets/Karakter/Back/Base/Back-Base-Walking-1.png",
                 "../Assets/Karakter/Back/Base/Back-Base-Walking-2.png",
                 "../Assets/Karakter/Back/Base/Back-Base-Walking-3.png",
                 "../Assets/Karakter/Back/Base/Back-Base-Walking-4.png"],

    side:       ["../Assets/Karakter/Side/Right/Right-Base-Walk-1.png",
                 "../Assets/Karakter/Side/Right/Right-Base-Walk-2.png",
                 "../Assets/Karakter/Side/Right/Right-Base-Walk-3.png",
                 "../Assets/Karakter/Side/Right/Right-Base-Walk-4.png"],

    idle_front: ["../Assets/Karakter/Front/Base/Front-Base.png",
                 "../Assets/Karakter/Front/Base/Front-Breathe.png"],

    idle_back:  ["../Assets/Karakter/Back/Base/Back-Base.png",
                 "../Assets/Karakter/Back/Base/Back-Base-Breathe.png"],

    idle_side:  ["../Assets/Karakter/Side/Right/Right-Breathe.png",
                 "../Assets/Karakter/Side/Right/Right-Base.png"]
};

// ---- Scroll constants ---------------------------------------

const SCROLL_FULL         = "scroll_blue";
const SCROLL_PICKUP_RADIUS = 120;

// ---- Movement constants -------------------------------------

const MOVEMENT_CODES = ["KeyA", "KeyD", "KeyW", "KeyS", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
const MOVE_SPEED     = 5;
const MAX_FORWARD    = -60;
const MAX_BACKWARD   = 200;
const WALK_ANIM_MS   = 160;
const IDLE_ANIM_MS   = 600;

// ---- State --------------------------------------------------

const mirrorKeys = {};

let inMirrorMode         = false;
let isInMirrorZone       = false;
let activeTeleportHitbox = null;

let fakeMainPlayer = null;
let mirrorClone    = null;
let mirrorFacing   = "back";
let mirrorZoneY    = null;
let cloneBaseY     = null;

let mirrorAnimFrame    = 0;
let idleAnimFrame      = 0;
let lastMirrorAnimTime = 0;
let lastIdleAnimTime   = 0;

let zWasPressed    = false;
let isNearScroll   = false;
let scrollItemEl   = null;
let scrollPickedUp = false;

// ---- Input --------------------------------------------------

window.addEventListener("keydown", (e) => {
    mirrorKeys[e.code] = true;

    // Z — enter/leave mirror or teleport
    if ((e.code === "KeyZ" || e.key === "z" || e.key === "Z") && !zWasPressed) {
        zWasPressed = true;
        handleZPress();
    }

    // E — pick up scroll when close enough
    if (e.code === "KeyE" && inMirrorMode && isNearScroll && !scrollPickedUp) {
        pickUpScroll();
    }

    // Block movement keys from reaching movement.js while in mirror mode
    if (inMirrorMode && MOVEMENT_CODES.includes(e.code)) {
        e.stopImmediatePropagation();
    }
}, true);

window.addEventListener("keyup", (e) => {
    mirrorKeys[e.code] = false;

    if (e.code === "KeyZ" || e.key === "z" || e.key === "Z") zWasPressed = false;

    if (inMirrorMode && MOVEMENT_CODES.includes(e.code)) {
        e.stopImmediatePropagation();
    }
}, true);

// Briefly disables mirror mode so movement.js receives keyup events and stops the real player
function forceStopRealPlayer() {
    const wasInMirror = inMirrorMode;
    inMirrorMode = false;
    MOVEMENT_CODES.forEach(code =>
        document.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }))
    );
    inMirrorMode = wasInMirror;
}

// ---- Prompt UI ----------------------------------------------

function updateDynamicPrompt(text, targetElement) {
    const promptBox  = document.getElementById("dynamic-z-prompt");
    const promptText = document.getElementById("dynamic-z-text");
    if (!promptBox || !promptText) return;

    if (!text || !targetElement) {
        promptBox.style.display = "none";
        return;
    }

    promptText.innerText = text;
    promptBox.style.display = "flex";

    // Float the prompt above the target with a gentle bounce
    const left   = parseFloat(targetElement.style.left)  || 0;
    const top    = parseFloat(targetElement.style.top)   || 0;
    const width  = parseFloat(targetElement.style.width) || 100;
    const bounce = Math.sin(Date.now() / 200) * 4;

    promptBox.style.left = `${left + (width / 2) - (promptBox.offsetWidth / 2)}px`;
    promptBox.style.top  = `${top - 40 + bounce}px`;
}

// ---- Zone detection -----------------------------------------

function checkZones() {
    // In mirror mode, show pick-up prompt if near scroll, otherwise show exit prompt
    if (inMirrorMode && fakeMainPlayer) {
        updateDynamicPrompt(
            isNearScroll && !scrollPickedUp ? "[E] Pick up" : "Stop inspecting",
            fakeMainPlayer
        );
        return;
    }

    const map    = document.getElementById("map");
    const player = document.getElementById("player");
    if (!map || !player) return;

    const mapRect    = map.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const foot = {
        x: playerRect.left + playerRect.width / 2,
        y: playerRect.bottom
    };

    isInMirrorZone       = false;
    activeTeleportHitbox = null;

    for (const hitbox of MIRROR_ROOM_CONFIG.hitboxes) {
        const r = {
            left:   mapRect.left + (hitbox.x / 100) * mapRect.width,
            top:    mapRect.top  + (hitbox.y / 100) * mapRect.height,
            right:  mapRect.left + ((hitbox.x + hitbox.width)  / 100) * mapRect.width,
            bottom: mapRect.top  + ((hitbox.y + hitbox.height) / 100) * mapRect.height
        };

        const inside = foot.x >= r.left && foot.x <= r.right &&
                       foot.y >= r.top  && foot.y <= r.bottom;

        if (!inside) continue;
        if (hitbox.trigger?.type === "mirror")          isInMirrorZone       = true;
        if (hitbox.trigger?.type === "manual_teleport") activeTeleportHitbox = hitbox;
    }

    if (isInMirrorZone)            updateDynamicPrompt("Inspect", player);
    else if (activeTeleportHitbox) updateDynamicPrompt("Leave",   player);
    else                           updateDynamicPrompt(null, null);
}

// ---- Z press handler ----------------------------------------

function handleZPress() {
    if (inMirrorMode)              leaveMirrorMode();
    else if (isInMirrorZone)       enterMirrorMode();
    else if (activeTeleportHitbox) executeTeleport(activeTeleportHitbox);
}

// ---- Teleport -----------------------------------------------

function executeTeleport(hitbox) {
    const { trigger } = hitbox;
    if (!trigger?.room) return;

    forceStopRealPlayer();

    if (typeof trigger.spawn?.x === "number") {
        sessionStorage.setItem("requiem_player_spawn", JSON.stringify({
            room: trigger.room,
            x: trigger.spawn.x,
            y: trigger.spawn.y
        }));
    }

    // Fade to black then navigate
    sessionStorage.setItem("requiem_transition_fade", "1");
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", inset: "0",
        backgroundColor: "#000",
        opacity: "0", pointerEvents: "none",
        zIndex: "9999", transition: "opacity 350ms ease"
    });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = "1");
    setTimeout(() => window.location.href = `./${trigger.room}`, 350);
}

// ---- Mirror enter / leave -----------------------------------

function enterMirrorMode() {
    const realPlayer = document.getElementById("player");
    const stage      = document.getElementById("room-stage");
    if (!realPlayer || !stage) return;

    inMirrorMode = true;
    forceStopRealPlayer();

    // Hide the normal scene
    realPlayer.style.opacity = "0";
    ["map", "forrest", "window-light"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = "0";
    });

    // Reveal the mirror scene layers
    setStyles("mirror-overlay", { display: "block", opacity: "1",   zIndex: "10" });
    setStyles("mirror-glass",   { display: "block", opacity: "0.5", zIndex: "50" });
    setStyles("mirror",         { display: "block", opacity: "1" });

    // Show the scroll item if it hasn't been picked up yet
    if (scrollItemEl && !scrollPickedUp) scrollItemEl.style.display = "block";

    // Create the fake player and mirror clone on first entry
    if (!fakeMainPlayer) {
        fakeMainPlayer = createSpriteDiv("fake-main-player", { zIndex: "500" });
        stage.appendChild(fakeMainPlayer);
    }
    if (!mirrorClone) {
        mirrorClone = createSpriteDiv("mirror-player-clone", { zIndex: "49" });
        stage.appendChild(mirrorClone);
    }

    // Start both sprites at the real player's position
    mirrorFacing = "back";
    const startX = parseFloat(realPlayer.style.left) || 0;
    const startY = parseFloat(realPlayer.style.top)  || 0;

    mirrorZoneY = startY + 180;
    cloneBaseY  = startY + 20;
    idleAnimFrame    = 0;
    lastIdleAnimTime = Date.now();

    Object.assign(fakeMainPlayer.style, {
        display: "block", left: `${startX}px`, top: `${mirrorZoneY}px`,
        backgroundImage: sprite("idle_back", 0), transform: "scaleX(3.0) scaleY(3.0)"
    });
    Object.assign(mirrorClone.style, {
        display: "block", left: `${startX}px`, top: `${cloneBaseY}px`,
        backgroundImage: sprite("idle_front", 0), transform: "scaleX(-2.5) scaleY(2.5)"
    });
}

function leaveMirrorMode() {
    inMirrorMode = false;
    forceStopRealPlayer();

    if (fakeMainPlayer) fakeMainPlayer.style.display = "none";
    if (mirrorClone)    mirrorClone.style.display    = "none";
    if (scrollItemEl && !scrollPickedUp) scrollItemEl.style.display = "none";

    // Restore the normal scene
    const realPlayer = document.getElementById("player");
    if (realPlayer) realPlayer.style.opacity = "1";
    ["map", "forrest", "window-light"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = "1";
    });
    ["mirror-overlay", "mirror-glass", "mirror"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

// ---- Scroll pickup ------------------------------------------

function spawnScrollItem(stage) {
    // Don't spawn if already collected in a previous session
    if (localStorage.getItem(MIRROR_ROOM_CONFIG.storageKeyMine) === "true") {
        scrollPickedUp = true;
        return;
    }

    scrollItemEl = document.createElement("img");
    scrollItemEl.src = MIRROR_ROOM_CONFIG.scrollHalfSrc;
    Object.assign(scrollItemEl.style, {
        position:  "absolute",
        left:      "50%",           // centered horizontally in the stage
        top:       "40%",           // roughly mid-screen vertically
        transform: "translateX(-50%)",
        width:     "5%",            // scales with the stage width
        display:   "none",          // only shown when inside mirror mode
        zIndex:    "200",
        pointerEvents: "none"
    });
    stage.appendChild(scrollItemEl);
}

function checkScrollProximity() {
    if (!inMirrorMode || !fakeMainPlayer || scrollPickedUp || !scrollItemEl) {
        isNearScroll = false;
        return;
    }
    // Compare fake player position against scroll element's actual screen position
    const stage     = document.getElementById("room-stage");
    const stageRect = stage?.getBoundingClientRect();
    const scrollRect = scrollItemEl.getBoundingClientRect();
    if (!stageRect || !scrollRect.width) { isNearScroll = false; return; }

    // Convert fake player's px (relative to stage) to screen coords
    const playerScreenX = stageRect.left + parseFloat(fakeMainPlayer.style.left);
    const playerScreenY = stageRect.top  + parseFloat(fakeMainPlayer.style.top);
    const scrollCX = scrollRect.left + scrollRect.width  / 2;
    const scrollCY = scrollRect.top  + scrollRect.height / 2;

    const dx = playerScreenX - scrollCX;
    const dy = playerScreenY - scrollCY;
    isNearScroll = Math.sqrt(dx * dx + dy * dy) < SCROLL_PICKUP_RADIUS;
}

function pickUpScroll() {
    scrollPickedUp = true;
    localStorage.setItem(MIRROR_ROOM_CONFIG.storageKeyMine, "true");
    if (scrollItemEl) scrollItemEl.style.display = "none";

    const otherAlreadyCollected = localStorage.getItem(MIRROR_ROOM_CONFIG.storageKeyOther) === "true";

    if (otherAlreadyCollected) {
        // Both halves are now collected — combine into the full scroll
        window.removeFromInventory(MIRROR_ROOM_CONFIG.scrollOtherItem);
        window.addToInventory(SCROLL_FULL);
        if (window.startDialogue) window.startDialogue(MIRROR_ROOM_CONFIG.combineDialogue, "character");
    } else {
        // Only have one half, add it and wait for the other
        window.addToInventory(MIRROR_ROOM_CONFIG.scrollHalfItem);
        if (window.startDialogue) window.startDialogue(MIRROR_ROOM_CONFIG.pickupDialogue, "character");
    }

    window.loadInventory();
}

// ---- Mirror movement & animation ----------------------------

function processMirrorMovement() {
    if (!inMirrorMode || !fakeMainPlayer || !mirrorClone) return;

    let curX = parseFloat(fakeMainPlayer.style.left);
    let curY = parseFloat(fakeMainPlayer.style.top);
    let dx = 0, dy = 0;

    if (mirrorKeys["KeyA"] || mirrorKeys["ArrowLeft"])  { dx -= MOVE_SPEED; mirrorFacing = "left";  }
    if (mirrorKeys["KeyD"] || mirrorKeys["ArrowRight"]) { dx += MOVE_SPEED; mirrorFacing = "right"; }
    if (mirrorKeys["KeyW"] || mirrorKeys["ArrowUp"])    { dy -= MOVE_SPEED; mirrorFacing = "back";  }
    if (mirrorKeys["KeyS"] || mirrorKeys["ArrowDown"])  { dy += MOVE_SPEED; mirrorFacing = "front"; }

    const isMoving = dx !== 0 || dy !== 0;

    curX += dx;
    curY  = Math.min(Math.max(curY + dy, mirrorZoneY + MAX_FORWARD), mirrorZoneY + MAX_BACKWARD);

    fakeMainPlayer.style.left = `${curX}px`;
    fakeMainPlayer.style.top  = `${curY}px`;

    checkScrollProximity();
    animateFakePlayer(isMoving);
    animateClone(curX, curY, isMoving);
}

function animateFakePlayer(isMoving) {
    const key    = facingToKey(mirrorFacing);
    const scale  = 3.0;
    const scaleX = mirrorFacing === "left" ? -scale : scale;

    if (isMoving) {
        idleAnimFrame = 0;
        if (Date.now() - lastMirrorAnimTime > WALK_ANIM_MS) { mirrorAnimFrame++; lastMirrorAnimTime = Date.now(); }
        fakeMainPlayer.style.backgroundImage = sprite(key, mirrorAnimFrame);
    } else {
        if (Date.now() - lastIdleAnimTime > IDLE_ANIM_MS) { idleAnimFrame++; lastIdleAnimTime = Date.now(); }
        fakeMainPlayer.style.backgroundImage = sprite("idle_" + key, idleAnimFrame);
    }

    fakeMainPlayer.style.transform = `scaleX(${scaleX}) scaleY(${scale})`;
}

function animateClone(curX, curY, isMoving) {
    const yOffset = curY - mirrorZoneY;
    const scale   = 2.5;
    const { cloneKey, cloneScaleX } = cloneTransform(mirrorFacing, scale);

    mirrorClone.style.left = `${curX}px`;
    mirrorClone.style.top  = `${cloneBaseY - yOffset * 0.7}px`;

    if (isMoving) {
        mirrorClone.style.backgroundImage = sprite(cloneKey, mirrorAnimFrame);
    } else {
        mirrorClone.style.backgroundImage = sprite("idle_" + cloneKey, idleAnimFrame);
    }

    mirrorClone.style.transform = `scaleX(${cloneScaleX}) scaleY(${scale})`;
}

// ---- Helpers ------------------------------------------------

// Returns the url() string for a sprite sheet entry at the given frame
function sprite(key, frame) {
    const arr = MIRROR_SPRITES[key];
    if (!arr?.length) return "";
    return `url("${arr[frame % arr.length]}")`;
}

// Maps left/right to "side", everything else passes through
function facingToKey(facing) {
    return (facing === "left" || facing === "right") ? "side" : facing;
}

// Returns the clone's sprite key and X scale — the true mirror reflection logic
function cloneTransform(facing, scale) {
    switch (facing) {
        case "back":  return { cloneKey: "front", cloneScaleX: -scale };
        case "front": return { cloneKey: "back",  cloneScaleX: -scale };
        case "left":  return { cloneKey: "side",  cloneScaleX: -scale };
        case "right": return { cloneKey: "side",  cloneScaleX:  scale };
        default:      return { cloneKey: "front", cloneScaleX: -scale };
    }
}

// Creates a bare positioned div used for the player and clone sprites
function createSpriteDiv(id, extraStyles = {}) {
    const div = document.createElement("div");
    div.id = id;
    Object.assign(div.style, {
        position: "absolute", width: "100px", height: "180px",
        backgroundSize: "contain", backgroundRepeat: "no-repeat",
        transformOrigin: "center bottom",
        ...extraStyles
    });
    return div;
}

// Shorthand — apply a style object to an element by id
function setStyles(id, styles) {
    const el = document.getElementById(id);
    if (el) Object.assign(el.style, styles);
}

// ---- Init ---------------------------------------------------

function init() {
    // Register this room's hitboxes globally so other scripts can read them
    window.ROOM_HITBOXES = window.ROOM_HITBOXES || {};
    window.ROOM_HITBOXES[MIRROR_ROOM_CONFIG.roomFile] = MIRROR_ROOM_CONFIG.hitboxes;

    // Hide all mirror layers on load — JS shows them when entering mirror mode
    ["mirror-overlay", "mirror-glass", "mirror"].forEach(id => setStyles(id, { display: "none" }));

    const stage = document.getElementById("room-stage");
    if (!stage) return;

    spawnScrollItem(stage);

    // Position the teleport zone overlay to match its hitbox
    MIRROR_ROOM_CONFIG.hitboxes.forEach(hitbox => {
        const type = hitbox.trigger?.type;
        if (type !== "manual_teleport" && type !== "teleport") return;

        const elId = `teleport-zone-${hitbox.id.split("-")[1]}`;
        const el   = document.getElementById(elId)
                  || document.getElementById(`teleport-zone-${hitbox.trigger.room.replace(".html", "")}`);

        if (el) Object.assign(el.style, {
            left: `${hitbox.x}%`, top:    `${hitbox.y}%`,
            width:`${hitbox.width}%`, height: `${hitbox.height}%`
        });
    });
}

function gameLoop() {
    checkZones();
    processMirrorMovement();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
    init();
    requestAnimationFrame(gameLoop);
});