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
    const INTERACT = ["z", "Z"];
    const DIALOGUE = ["Enter"];

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

    if(INTERACT.includes(keyPressed)){
        console.log("Interact key pressed");
    }

    if(DIALOGUE.includes(keyPressed)){
        console.log("Dialogue key pressed");
    }


    console.log(xPos, yPos);
    player.style.left = xPos + "px";
    player.style.top = yPos + "px";


})