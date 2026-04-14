let player = document.createElement("div");
player.id = "player";

document.getElementById("container").appendChild(player);

let map;

if(document.getElementById("map")){
    map = document.getElementById("map");
}

const PLAYER_SPAWN_KEY = "requiem_player_spawn";
const roomHitboxesConfig = window.ROOM_HITBOXES || {};

function getCurrentRoomFileName(){
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
}

function getActiveHitboxes(){
    const roomFileName = getCurrentRoomFileName();
    return roomHitboxesConfig[roomFileName] || [];
}

function isTriggerZone(hitbox){
    return Boolean(hitbox.trigger);
}

function callTriggerHandler(hitbox){
    if(typeof window.handleRoomTrigger !== "function"){
        return;
    }

    window.handleRoomTrigger(hitbox);
}

const acceleration = 0.2;
const max_speed = 15;
const min_speed = 5;
let speed_x = 5;
let speed_y = 5;
let xPos = 500;
let yPos = 500;

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

document.addEventListener("keydown", (e) => {
    keys_pressed[e.code] = true;
    handle_input();
});

document.addEventListener("keyup", (e) => {
    delete keys_pressed[e.code];
});

function handle_input(){
    enabled_keys = {
        LEFT: true,
        UP: true,
        RIGHT: true,
        DOWN: true
    };

    if(map){
        check_bounds(map);
    }

    if((keys_pressed["KeyA"] || keys_pressed["ArrowLeft"]) && enabled_keys["LEFT"]){
        speed_x = clamp(min_speed, speed_x + acceleration, max_speed);
        speed_y = clamp(min_speed, speed_y - acceleration, max_speed);
        const nextX = xPos - speed_x;
        if(!collidesWithHitbox(-speed_x, 0)){
            xPos = nextX;
        }
    }

    if((keys_pressed["KeyD"] || keys_pressed["ArrowRight"]) && enabled_keys["RIGHT"]){
        speed_x = clamp(min_speed, speed_x + acceleration, max_speed);
        speed_y = clamp(min_speed, speed_y - acceleration, max_speed);
        const nextX = xPos + speed_x;
        if(!collidesWithHitbox(speed_x, 0)){
            xPos = nextX;
        }
    }

    if((keys_pressed["KeyW"] || keys_pressed["ArrowUp"]) && enabled_keys["UP"]){
        speed_y = clamp(min_speed, speed_y + acceleration, max_speed);
        speed_x = clamp(min_speed, speed_x - acceleration, max_speed);
        const nextY = yPos - speed_y;
        if(!collidesWithHitbox(0, -speed_y)){
            yPos = nextY;
        }
    }

    if((keys_pressed["KeyS"] || keys_pressed["ArrowDown"]) && enabled_keys["DOWN"]){
        speed_y = clamp(min_speed, speed_y + acceleration, max_speed);
        speed_x = clamp(min_speed, speed_x - acceleration, max_speed);
        const nextY = yPos + speed_y;
        if(!collidesWithHitbox(0, speed_y)){
            yPos = nextY;
        }
    }

    player.style.left = `${xPos}px`;
    player.style.top = `${yPos}px`;
    checkTriggerZones();
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
            callTriggerHandler(hitbox);
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

function clamp(min, value, max){
    if(value < min){
        return min;
    }

    if(value > max){
        return max;
    }

    return value;
}

window.addEventListener("load", () => {
    applySpawnPosition();
});