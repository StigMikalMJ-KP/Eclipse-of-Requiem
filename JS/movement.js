let player = document.getElementById("player");

const SPEED = 9;
let xPos = 100;
let yPos = 100;

player.style.left = xPos;
player.style.top = yPos;

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