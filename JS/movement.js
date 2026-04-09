let player = document.getElementById("player");
const map = document.getElementById("map");

const SPEED = 9;
let xPos = 500;
let yPos = 500;

player.style.left = xPos;
player.style.top = yPos;

let mapRect = map.getBoundingClientRect();


document.addEventListener("keydown", (e) => {
    const LEFT = ["a", "ArrowLeft"];
    const UP = ["w", "ArrowUp"];
    const RIGHT = ["d", "ArrowRight"];
    const DOWN = ["s", "ArrowDown"];

    let keyPressed = e.key;

    if(LEFT.includes(keyPressed)){
        xPos -= SPEED;
    }

    if(UP.includes(keyPressed)){
        yPos -= SPEED;
    }

    if(RIGHT.includes(keyPressed)){
        xPos += SPEED;
    }

    if(DOWN.includes(keyPressed)){
        yPos += SPEED;
    }


    console.log(xPos, yPos);
    player.style.left = xPos + "px";
    player.style.top = yPos + "px";


})