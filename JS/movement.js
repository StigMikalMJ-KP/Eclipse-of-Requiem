let player = document.createElement("div");
player.id = "player";
document.getElementById("container").appendChild(player);
let map;

if(document.getElementById("map")){
    map = document.getElementById("map");
}

const acceleration = 0.2
let speed_x = 5;
let speed_y = 5;
let xPos = 500;
let yPos = 500;

const keys_pressed = {};

player.style.left = xPos;
player.style.top = yPos;

let mapRect = map.getBoundingClientRect();

let enabled_keys = {
    LEFT: true,
    UP: true,
    RIGHT: true,
    DOWN: true
}


document.addEventListener("keydown", (e) => {
    keys_pressed[e.code] = true;
    handle_input();
})

document.addEventListener("keyup", (e) => {
    delete keys_pressed[e.code];
})


function handle_input(){
    const LEFT = ["KeyA", "ArrowLeft"];
    const UP = ["KeyW", "ArrowUp"];
    const RIGHT = ["KeyD", "ArrowRight"];
    const DOWN = ["KeyS", "ArrowDown"];

    enabled_keys = {
        LEFT: true,
        UP: true,
        RIGHT: true,
        DOWN: true
    }

    //Movement input
    if(map){
        check_bounds(map);
    }
    console.log(enabled_keys);
    if(keys_pressed["KeyA"] || keys_pressed["ArrowLeft"] && enabled_keys["LEFT"] ){
        xPos -= speed_x;
    }

    if(keys_pressed["KeyD"] || keys_pressed["ArrowRight"] && enabled_keys["RIGHT"]){
        xPos += speed_x;
    }

    if(keys_pressed["KeyW"] || keys_pressed["ArrowUp"] && enabled_keys["UP"]){
        yPos -= speed_y;
    }

    if(keys_pressed["KeyS"] || keys_pressed["ArrowDown"] && enabled_keys["DOWN"]){
        yPos += speed_y;
    }

    console.log(xPos, yPos);
    player.style.left = xPos + "px";
    player.style.top = yPos + "px";

}


function check_bounds(obj){
    const plr = player.getBoundingClientRect();
    const obj_rect = obj.getBoundingClientRect();
    const margin = 15;

    if (!(plr.left - margin >= obj_rect.left)){
        enabled_keys["LEFT"] = false;
    }

    if (plr.top  - margin <= obj_rect.top) {
        enabled_keys["UP"] = false;
    }

    if (plr.right + margin >= obj_rect.right) {
        enabled_keys["RIGHT"] = false;
    }

    if (plr.bottom + margin >= obj_rect.bottom){
        enabled_keys["DOWN"] = false;
    }
}

function clamp(min, value, max){
    if(value < min){
        return min;
    } else if(value > max){
        return max;
    }
    return value;
}