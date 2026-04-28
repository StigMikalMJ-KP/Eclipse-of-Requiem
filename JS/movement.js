let player = document.createElement("div");
player.id = "player";

document.getElementById("container").appendChild(player);

let map;

if(document.getElementById("map")){
    map = document.getElementById("map");
}

const PLAYER_SPAWN_KEY = "requiem_player_spawn";
const TRANSITION_FADE_KEY = "requiem_transition_fade";
const TRANSITION_DURATION_MS = 350;
const roomHitboxesConfig = window.ROOM_HITBOXES || {};
const WALK_FRAME_INTERVAL_MS = 180;
const MOVEMENT_KEYS = new Set([
    "KeyA",
    "ArrowLeft",
    "KeyD",
    "ArrowRight",
    "KeyW",
    "ArrowUp",
    "KeyS",
    "ArrowDown"
]);

const PLAYER_SPRITES = {
    front: {
        idle: "../Assets/Karakter/Front/Base/Front-Breathe.png",
        walk: [
            "../Assets/Karakter/Front/Base/Front-Walking-1.png",
            "../Assets/Karakter/Front/Base/Front-Walking-2.png"
        ]
    },
    back: {
        idle: "../Assets/Karakter/Back/Base/Back-Base-Breathe.png",
        walk: [
            "../Assets/Karakter/Back/Base/Back-Base-Walking-1.png",
            "../Assets/Karakter/Back/Base/Back-Base-Walking-2.png",
            "../Assets/Karakter/Back/Base/Back-Base-Walking-3.png",
            "../Assets/Karakter/Back/Base/Back-Base-Walking-4.png"
        ]
    },
    left: {
        idle: "../Assets/Karakter/Side/Left/Left-Breathe.png",
        walk: [
            "../Assets/Karakter/Side/Left/Left-Base-Walk-1.png"
        ]
    },
    right: {
        idle: "../Assets/Karakter/Side/Right/Right-Breathe.png",
        walk: [
            "../Assets/Karakter/Side/Right/Right-Base-Walk-1.png",
            "../Assets/Karakter/Side/Right/Right-Base-Walk-2.png",
            "../Assets/Karakter/Side/Right/Right-Base-Walk-3.png",
            "../Assets/Karakter/Side/Right/Right-Base-Walk-4.png"
        ]
    }
};



const acceleration = 0.2;
const max_speed = 15;
const min_speed = 5;
let speed_x = 5;
let speed_y = 5;
let xPos = 500;
let yPos = 350;
let playerFacing = "front";
let walkFrameIndex = 0;
let lastWalkFrameTime = 0;
let currentSpritePath = "";

const keys_pressed = {};

player.style.left = `${xPos}px`;
player.style.top = `${yPos}px`;

let enabled_keys = {
    LEFT: true,
    UP: true,
    RIGHT: true,
    DOWN: true
};
let isHandlingTrigger = false;


window.addEventListener("load", () => {
    applySpawnPosition();
    fadeInFromBlackIfNeeded();
    updatePlayerSprite(false);
});


import { getDialogueState } from "./dialogue.js";

document.addEventListener("keydown", (e) => {
    if(MOVEMENT_KEYS.has(e.code)){
        e.preventDefault();
    }
    keys_pressed[e.code] = true;
    handle_input();
});

document.addEventListener("keyup", (e) => {
    if(MOVEMENT_KEYS.has(e.code)){
        e.preventDefault();
    }
    delete keys_pressed[e.code];
});




function applySpawnPosition(){
    if(!map){
        return;
    }

    const rawSpawn = sessionStorage.getItem(PLAYER_SPAWN_KEY);
    if(!rawSpawn){
        return;
    }

    const currentRoom = getCurrentRoomFileName();

    try{
        const spawn = JSON.parse(rawSpawn);
        if(spawn.room !== currentRoom){
            return;
        }

        const mapRect = map.getBoundingClientRect();
        xPos = (spawn.x / 100) * mapRect.width;
        yPos = (spawn.y / 100) * mapRect.height;
        player.style.left = `${xPos}px`;
        player.style.top = `${yPos}px`;
        sessionStorage.removeItem(PLAYER_SPAWN_KEY);
    } catch{
        sessionStorage.removeItem(PLAYER_SPAWN_KEY);
    }
}

/*
    Håndterer keyboard-input.
    Går med WASD eller arrow-keys
    Akselerasjon når man går og passer på at spilleren ikke 
    går utenfor map

*/
function handle_input(){
    enabled_keys = {
        LEFT: true,
        UP: true,
        RIGHT: true,
        DOWN: true
    };

    if(getDialogueState()){
        return;
    }


    if(map){
        check_bounds(map);
    }

    if((keys_pressed["KeyA"] || keys_pressed["ArrowLeft"]) && enabled_keys["LEFT"]){
        speed_x = clamp(min_speed, speed_x + acceleration, max_speed);
        speed_y = clamp(min_speed, speed_y - acceleration, max_speed);
        const nextX = xPos - speed_x;
        playerFacing = "left";
        if(!collidesWithHitbox(-speed_x, 0)){
            xPos = nextX;
        }
    }

    if((keys_pressed["KeyD"] || keys_pressed["ArrowRight"]) && enabled_keys["RIGHT"]){
        speed_x = clamp(min_speed, speed_x + acceleration, max_speed);
        speed_y = clamp(min_speed, speed_y - acceleration, max_speed);
        const nextX = xPos + speed_x;
        playerFacing = "right";
        if(!collidesWithHitbox(speed_x, 0)){
            xPos = nextX;
        }
    }

    if((keys_pressed["KeyW"] || keys_pressed["ArrowUp"]) && enabled_keys["UP"]){
        speed_y = clamp(min_speed, speed_y + acceleration, max_speed);
        speed_x = clamp(min_speed, speed_x - acceleration, max_speed);
        const nextY = yPos - speed_y;
        playerFacing = "back";
        if(!collidesWithHitbox(0, -speed_y)){
            yPos = nextY;
        }
    }

    if((keys_pressed["KeyS"] || keys_pressed["ArrowDown"]) && enabled_keys["DOWN"]){
        speed_y = clamp(min_speed, speed_y + acceleration, max_speed);
        speed_x = clamp(min_speed, speed_x - acceleration, max_speed);
        const nextY = yPos + speed_y;
        playerFacing = "front";
        if(!collidesWithHitbox(0, speed_y)){
            yPos = nextY;
        }
    }


    const isMoving = Boolean(
        keys_pressed["KeyA"] ||
        keys_pressed["ArrowLeft"] ||
        keys_pressed["KeyD"] ||
        keys_pressed["ArrowRight"] ||
        keys_pressed["KeyW"] ||
        keys_pressed["ArrowUp"] ||
        keys_pressed["KeyS"] ||
        keys_pressed["ArrowDown"]
    );

    player.style.left = `${xPos}px`;
    player.style.top = `${yPos}px`;
    updatePlayerSprite(isMoving);
    checkTriggerZones();
}

//Sjekker om spilleren er nærme kanten til map
//Er den det, blir tasten til siden deaktivert
function check_bounds(obj){
    const plr = player.getBoundingClientRect();
    const obj_rect = obj.getBoundingClientRect();
    const margin = 15;

    if(!(plr.left - margin >= obj_rect.left)){
        enabled_keys.LEFT = false;
    }

    if(plr.top - margin <= obj_rect.top){
        enabled_keys.UP = false;
    }

    if(plr.right + margin >= obj_rect.right){
        enabled_keys.RIGHT = false;
    }

    if(plr.bottom + margin >= obj_rect.bottom){
        enabled_keys.DOWN = false;
    }
}
// CLAMP
/*
    Funskjon som "clamper" verdier
    Tar inn 3 parametere
    min: int
    value: int
    max: int

    Og returerer en int verdi

    Blir brukt der man ikke vil at en verdi skal gå under, eller overstige to bestemte verdier

*/
function clamp(min, value, max){
    if(value < min){
        return min;
    }

    if(value > max){
        return max;
    }

    return value;
}

function setPlayerSprite(spritePath){
    if(!spritePath || spritePath === currentSpritePath){
        return;
    }

    currentSpritePath = spritePath;
    player.style.backgroundImage = `url("${spritePath}")`;
}

function updatePlayerSprite(isMoving){
    const usesMirroredRight = playerFacing === "left";
    const spriteFacing = usesMirroredRight ? "right" : playerFacing;
    const spriteSet = PLAYER_SPRITES[spriteFacing] || PLAYER_SPRITES.front;
    player.style.transform = usesMirroredRight ? "scaleX(-1)" : "scaleX(1)";
    if(!isMoving){
        walkFrameIndex = 0;
        setPlayerSprite(spriteSet.idle);
        return;
    }

    if(spriteSet.walk.length === 0){
        setPlayerSprite(spriteSet.idle);
        return;
    }

    const now = Date.now();
    if(now - lastWalkFrameTime >= WALK_FRAME_INTERVAL_MS){
        walkFrameIndex = (walkFrameIndex + 1) % spriteSet.walk.length;
        lastWalkFrameTime = now;
    }

    setPlayerSprite(spriteSet.walk[walkFrameIndex]);
}


function checkTriggerZones(){
    if(!map || isHandlingTrigger){
        return;
    }

    const activeHitboxes = getActiveHitboxes().filter(isTriggerZone);
    if(activeHitboxes.length === 0){
        return;
    }

    const mapRect = map.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    for(const hitbox of activeHitboxes){
        const hitboxRect = getHitboxRect(hitbox, mapRect);
        const intersects =
            playerRect.left < hitboxRect.right &&
            playerRect.right > hitboxRect.left &&
            playerRect.top < hitboxRect.bottom &&
            playerRect.bottom > hitboxRect.top;

        if(intersects){
            isHandlingTrigger = true;
            handleTrigger(hitbox);
            setTimeout(() => {
                isHandlingTrigger = false;
            }, 200);
            return;
        }
    }
}

function collidesWithHitbox(moveX, moveY){
    if(!map){
        return false;
    }

    const activeHitboxes = getActiveHitboxes().filter((hitbox) => !isTriggerZone(hitbox));
    if(activeHitboxes.length === 0){
        return false;
    }

    const mapRect = map.getBoundingClientRect();
    const currentPlayerRect = player.getBoundingClientRect();
    const playerRect = {
        left: currentPlayerRect.left + moveX,
        top: currentPlayerRect.top + moveY,
        right: currentPlayerRect.right + moveX,
        bottom: currentPlayerRect.bottom + moveY
    };

    for(const hitbox of activeHitboxes){
        const hitboxRect = getHitboxRect(hitbox, mapRect);
        const intersects =
            playerRect.left < hitboxRect.right &&
            playerRect.right > hitboxRect.left &&
            playerRect.top < hitboxRect.bottom &&
            playerRect.bottom > hitboxRect.top;

        if(intersects){
            return true;
        }
    }

    return false;
}

function getHitboxRect(hitbox, mapRect){
    return {
        left: mapRect.left + (hitbox.x / 100) * mapRect.width,
        top: mapRect.top + (hitbox.y / 100) * mapRect.height,
        right: mapRect.left + ((hitbox.x + hitbox.width) / 100) * mapRect.width,
        bottom: mapRect.top + ((hitbox.y + hitbox.height) / 100) * mapRect.height
    };
}


function getCurrentRoomFileName(){
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
}

function getActiveHitboxes(){
    const roomFileName = getCurrentRoomFileName();
    return roomHitboxesConfig[roomFileName] || [];
}

function isTriggerZone(hitbox){
    return Boolean(hitbox.trigger && typeof hitbox.trigger === "object");
}

function createFadeOverlay(){
    const overlay = document.createElement("div");
    overlay.id = "room-transition-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "#000";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "9999";
    overlay.style.transition = `opacity ${TRANSITION_DURATION_MS}ms ease`;
    document.body.appendChild(overlay);
    return overlay;
}

function fadeInFromBlackIfNeeded(){
    const shouldFade = sessionStorage.getItem(TRANSITION_FADE_KEY);
    if(shouldFade !== "1"){
        return;
    }

    sessionStorage.removeItem(TRANSITION_FADE_KEY);
    const overlay = createFadeOverlay();
    overlay.style.opacity = "1";

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
            }, TRANSITION_DURATION_MS);
        });
    });
}

function handleTrigger(hitbox){
    const trigger = hitbox.trigger;
    if(trigger.type !== "teleport" || !trigger.room){
        return;
    }

    if(trigger.spawn && typeof trigger.spawn.x === "number" && typeof trigger.spawn.y === "number"){
        sessionStorage.setItem(
            PLAYER_SPAWN_KEY,
            JSON.stringify({ room: trigger.room, x: trigger.spawn.x, y: trigger.spawn.y })
        );
    }

    sessionStorage.setItem(TRANSITION_FADE_KEY, "1");
    const overlay = createFadeOverlay();
    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
    });

    setTimeout(() => {
        window.location.href = `./${trigger.room}`;
    }, TRANSITION_DURATION_MS);
}

