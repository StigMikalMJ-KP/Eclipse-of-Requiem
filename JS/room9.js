// ==========================================
// ROOM 9 CONFIGURATION
// ==========================================
window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room9.html": [
        {
            id: "teleporter-room2",
            x: 40, y: 90, width: 10, height: 10,
            trigger: { type: "teleport", room: "room1.html", spawn: { x: 99, y: 55 } }
        },
        {
            id: "mirror-zone",
            x: 82, y: 35, width: 25, height: 60, // Wide zone so it's easy to hit
            trigger: { type: "mirror", action: "show" }
        }
    ]
};

// ==========================================
// MIRROR STATE & KEY TRACKING
// ==========================================
window.mirrorActive = false; // Tells your movement script to stop
let inMirrorMode = false;
let mirrorOriginalX = null;
let mirrorOriginalY = null;
let mirrorZoneY = null;
let isInZone = false;

// Independent key tracker so it doesn't break if you change your walking script later
const mirrorKeys = {};
document.addEventListener("keydown", (e) => mirrorKeys[e.code] = true);
document.addEventListener("keyup", (e) => mirrorKeys[e.code] = false);

// ==========================================
// ZONE DETECTION
// ==========================================
function checkMirrorZone() {
    const map = document.getElementById('map');
    const player = document.getElementById('player');
    if (!map || !player || inMirrorMode) return;

    const roomHitboxes = window.ROOM_HITBOXES["room9.html"];
    const mirrorHitbox = roomHitboxes.find(hitbox => hitbox.id === "mirror-zone");
    if (!mirrorHitbox) return;

    const mapRect = map.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Calculate Hitbox Pixel Coordinates
    const hitboxRect = {
        left: mapRect.left + (mirrorHitbox.x / 100) * mapRect.width,
        top: mapRect.top + (mirrorHitbox.y / 100) * mapRect.height,
        right: mapRect.left + ((mirrorHitbox.x + mirrorHitbox.width) / 100) * mapRect.width,
        bottom: mapRect.top + ((mirrorHitbox.y + mirrorHitbox.height) / 100) * mapRect.height
    };

    // Check player's feet
    const footPoint = {
        x: playerRect.left + playerRect.width / 2,
        y: playerRect.bottom
    };

    isInZone = (
        footPoint.x >= hitboxRect.left &&
        footPoint.x <= hitboxRect.right &&
        footPoint.y <= hitboxRect.bottom &&
        footPoint.y >= hitboxRect.top
    );

    // Toggle the UI Prompt
    const prompt = document.getElementById('mirror-inspect-prompt');
    if (prompt) {
        if (isInZone) {
            prompt.classList.remove('mirror-inspect-prompt-hidden');
            prompt.classList.add('mirror-inspect-prompt-visible');
            prompt.style.display = "block"; 
        } else {
            prompt.classList.add('mirror-inspect-prompt-hidden');
            prompt.classList.remove('mirror-inspect-prompt-visible');
            prompt.style.display = "none";
        }
    }
}

// ==========================================
// ENTER / LEAVE LOGIC
// ==========================================
window.enterMirrorMode = function() {
    if (inMirrorMode) return;

    const player = document.getElementById('player');
    const mirrorOverlay = document.getElementById('mirror-overlay');
    if (!player) return;

    // 1. Save original position
    mirrorOriginalX = parseFloat(player.style.left) || 0;
    mirrorOriginalY = parseFloat(player.style.top) || 0;
    
    inMirrorMode = true;
    window.mirrorActive = true; // Signal for room9Movement.js to pause

    // 2. Show the mirror glass overlay
    if (mirrorOverlay) {
        mirrorOverlay.classList.remove('mirror-hidden');
        mirrorOverlay.classList.add('mirror-visible');
        mirrorOverlay.style.zIndex = "1000"; // Keep frame on top
    }

    // 3. Move player into the center of the mirror
    centerPlayerInMirrorZone();
    mirrorZoneY = parseFloat(player.style.top); 
    
    // 4. Adjust visual layering
    player.style.zIndex = '500'; // Behind the frame, but in front of background
    player.style.transformOrigin = 'center bottom';
    player.style.transform = 'scale(2.2)'; // Scale up for cinematic look
    
    // Hide the prompt while inspecting
    const prompt = document.getElementById('mirror-inspect-prompt');
    if (prompt) prompt.style.display = "none";
};

window.leaveMirrorMode = function() {
    if (!inMirrorMode) return;

    const player = document.getElementById('player');
    const mirrorOverlay = document.getElementById('mirror-overlay');

    inMirrorMode = false;
    window.mirrorActive = false; // Re-enable normal walking

    // 1. Return player to their original spot on the floor
    if (mirrorOriginalX !== null && mirrorOriginalY !== null && player) {
        player.style.left = `${mirrorOriginalX}px`;
        player.style.top = `${mirrorOriginalY}px`;
    }

    // 2. Hide the mirror overlay
    if (mirrorOverlay) {
        mirrorOverlay.classList.remove('mirror-visible');
        mirrorOverlay.classList.add('mirror-hidden');
    }

    // 3. Reset player visuals
    if (player) {
        player.style.zIndex = '';
        player.style.transform = 'scale(1)';
    }
};

function centerPlayerInMirrorZone() {
    const map = document.getElementById('map');
    const player = document.getElementById('player');
    const mirrorHitbox = window.ROOM_HITBOXES["room9.html"].find(h => h.id === "mirror-zone");
    
    if (!map || !mirrorHitbox || !player) return;

    const mapRect = map.getBoundingClientRect();
    const centerX = ((mirrorHitbox.x + mirrorHitbox.width / 2) / 100) * mapRect.width;
    const centerY = ((mirrorHitbox.y + mirrorHitbox.height / 2) / 100) * mapRect.height;

    // Center horizontally, but place their feet nicely in the mirror
    player.style.left = `${centerX - (player.offsetWidth / 2)}px`;
    player.style.top = `${centerY - (player.offsetHeight / 2)}px`;
}

// ==========================================
// FIXED CAMERA MOVEMENT (Inside Mirror)
// ==========================================
function handleMirrorMovement() {
    if (!inMirrorMode) return;

    const player = document.getElementById('player');
    if (!player) return;

    // Adjust these to change how it feels
    const speedX = 3.5;   // Fast left/right
    const speedY = 0.5;   // Very slow forward/back for depth effect
    
    // Bounds constraints
    const MAX_FORWARD = 30; // Max pixels they can walk "up" into the mirror
    const ESCAPE_DISTANCE = 80; // Walk this far "down" to exit

    let curX = parseFloat(player.style.left);
    let curY = parseFloat(player.style.top);

    if (mirrorKeys["KeyA"] || mirrorKeys["ArrowLeft"]) curX -= speedX;
    if (mirrorKeys["KeyD"] || mirrorKeys["ArrowRight"]) curX += speedX;
    if (mirrorKeys["KeyW"] || mirrorKeys["ArrowUp"]) curY -= speedY;
    if (mirrorKeys["KeyS"] || mirrorKeys["ArrowDown"]) curY += speedY;

    // Constraint: Can't walk too far up
    if (curY < mirrorZoneY - MAX_FORWARD) {
        curY = mirrorZoneY - MAX_FORWARD;
    }

    // Exit Condition: Walking too far back (down)
    if (curY > mirrorZoneY + ESCAPE_DISTANCE) {
        window.leaveMirrorMode();
        return;
    }

    player.style.left = `${curX}px`;
    player.style.top = `${curY}px`;
}

// ==========================================
// EVENT LISTENERS & LOOPS
// ==========================================
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyZ") {
        if (inMirrorMode) {
            window.leaveMirrorMode();
        } else if (isInZone) {
            window.enterMirrorMode();
        }
    }
});

function initializeTeleportZones() {
    const map = document.getElementById('map');
    if (!map) return;
    window.ROOM_HITBOXES["room9.html"].forEach(hitbox => {
        if (hitbox.trigger && hitbox.trigger.type === "teleport") {
            const el = document.getElementById(`teleport-zone-${hitbox.trigger.room.replace('.html', '')}`);
            if (el) {
                el.style.left = `${hitbox.x}%`; 
                el.style.top = `${hitbox.y}%`;
                el.style.width = `${hitbox.width}%`; 
                el.style.height = `${hitbox.height}%`;
            }
        }
    });
}

function mirrorLoop() {
    checkMirrorZone();
    handleMirrorMovement();
    requestAnimationFrame(mirrorLoop);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTeleportZones();
    requestAnimationFrame(mirrorLoop);
});