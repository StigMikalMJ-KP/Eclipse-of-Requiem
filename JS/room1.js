import { getGameState_exp, setGameState } from "./states.js";
import { isInInventory } from "./inventory.js";
import { startDialogue } from "./dialogue.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room1.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff-left", x: 0, y: 0, width: 38, height: 20 },
        { id: "top-cutoff-middle", x: 39, y: 0, width: 14, height: 20 },
        { id: "top-cutoff-right", x: 54, y: 0, width: 40, height: 20 },
        {
            id: "teleporter-room1a",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room2.html",
                spawn: { x: 25, y: 48 }
            }
        },
        {
            id: "teleporter-room1b",
            x: 38,
            y: 0,
            width: 16,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room3.html",
                spawn: { x: 59, y: 77 }
            }
        }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    let gameState = getGameState_exp();
    if(gameState["opened-rooms"] && gameState["opened-rooms"].includes(3)){
        let hitbox = window.ROOM_HITBOXES["room1.html"].find(hb => hb.id === "top-cutoff-middle");
        hitbox.width = 1;
        hitbox.height = 1;
    }

    let path = window.location.pathname;
    let page = path.split("/").pop();
    if(page === "room1.html"){
        
    };
})

export function openRoom1Exit(){
    let hitbox = window.ROOM_HITBOXES["room1.html"].find(hb => hb.id === "top-cutoff-middle");
    hitbox.width = 1;
    hitbox.height = 1;
}

export function triggerHolyBookDialogue() {
    startDialogue([
        "A sacred book...",
        "It Looks almost Holy.",
        "This must be important.",
        "Holy book was added to your inventory."
    ], "character");

   
}



window.addEventListener("load", () => {
    // Only show dialogue once per game
    const ROOM1_DIALOGUE_KEY = "requiem_room1_dialogue_shown";
    
    if(!localStorage.getItem(ROOM1_DIALOGUE_KEY)){
        // Added "character" here to trigger the portrait (hode.png)
        startDialogue([
            "So this must be the library. It seems like the previous owner was a scholar of some sort.",
            "There is a locked door over there.",
            "I wonder if I can find a key to open it somehow.",
            "I better start looking for clues."
        ], "character"); 

        localStorage.setItem(ROOM1_DIALOGUE_KEY, "true");
    }
});


const room_stage = document.getElementById("room-stage");
let hitboxes = window.ROOM_HITBOXES["room1.html"];
for(let i = 0; i < hitboxes.length; i++){
    if(hitboxes[i].id === "maze-wall"){
        let wall = document.createElement("div");
        wall.style.position = "absolute";
        wall.style.left = hitboxes[i].x + "%";
        wall.style.top = hitboxes[i].y + "%";
        wall.style.width = hitboxes[i].width + "%";
        wall.style.height = hitboxes[i].height + "%";
        wall.style.backgroundColor = "rgb(69, 42, 14)"; 
        wall.style.border = "5px solid rgb(43, 27, 10)";
        room_stage.appendChild(wall);
    }
}