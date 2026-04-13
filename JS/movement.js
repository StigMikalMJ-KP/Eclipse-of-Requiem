let player = document.createElement("div");
player.id = "player";
document.getElementById("container").appendChild(player);
let map;
if(document.getElementById("map")){
    map = document.getElementById("map");
}

const SPEED = 9;
let xPos = 500;
let yPos = 500;

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
    const LEFT = ["a", "ArrowLeft"];
    const UP = ["w", "ArrowUp"];
    const RIGHT = ["d", "ArrowRight"];
    const DOWN = ["s", "ArrowDown"];

    let keyPressed = e.key;

    enabled_keys = {
        LEFT: true,
        UP: true,
        RIGHT: true,
        DOWN: true
    }

    if(map){
        check_bounds(map);

    }
    console.log(enabled_keys);

    if(LEFT.includes(keyPressed) && enabled_keys["LEFT"]){
        xPos -= SPEED;
    }

    if(UP.includes(keyPressed) && enabled_keys["UP"]){
        yPos -= SPEED;
    }

    if(RIGHT.includes(keyPressed) && enabled_keys["RIGHT"]){
        xPos += SPEED;
    }

    if(DOWN.includes(keyPressed) && enabled_keys["DOWN"]){
        yPos += SPEED;
    }


    console.log(xPos, yPos);
    player.style.left = xPos + "px";
    player.style.top = yPos + "px";
})


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