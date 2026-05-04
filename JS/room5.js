import { getGameState_exp, setGameState } from "./states.js";
import { startDialogue } from "./dialogue.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room5.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff-left", x: 0, y: 0, width: 38, height: 20 },
        { id: "top-cutoff-right", x: 54, y: 0, width: 40, height: 20 },
        { id: "chest", x: 0, y: 30, width: 10, height: 3},

        { id: "maze-wall", x: 33, y: 65, width: 3, height: 32},
        { id: "maze-wall", x: 13, y: 15, width: 3, height: 60},
        { id: "maze-wall", x: 16.5, y: 50, width: 10, height: 3},
        { id: "maze-wall", x: 33, y: 10, width: 3, height: 30},
        { id: "maze-wall", x: 0, y: 85, width: 6, height: 12},
        { id: "maze-wall", x: 36.5, y: 65, width: 28, height: 3},
        { id: "maze-wall", x: 33, y: 41, width: 58, height: 3},
        { id: "maze-wall", x: 89, y: 41, width: 3, height: 28},
        { id: "maze-wall", x: 76, y: 41, width: 3, height: 35},

        {
            id: "teleporter-room5a",
            x: 40,
            y: 91,
            width: 10,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room4.html",
                spawn: { x: 25, y: 48 }
            }
        },
        {
            id: "teleporter-room5b",
            x: 37.5,
            y: 5,
            width: 16,
            height: 14,
            trigger: {
                type: "teleport",
                room: "room9.html",
                spawn: { x: 59, y: 77 }
            }
        }
            
    ]
};

/*
    Lager synlige vegger ut i fra hitboxene
*/
const room_stage = document.getElementById("room-stage");
let hitboxes = window.ROOM_HITBOXES["room5.html"];
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

window.addEventListener("load", () => {
    // Only show dialogue once per game
    const ROOM5_DIALOGUE_KEY = "requiem_room5_dialogue_shown";
    
    if(!localStorage.getItem(ROOM5_DIALOGUE_KEY)){
        // Added "character" here to trigger the portrait (hode.png)
        startDialogue([
            "Wow, this seems like a maze!", 
            "I am bombastically aMAZEd.", 
            "To think that they managed to fit that in here!"
        ], "character"); 

        localStorage.setItem(ROOM5_DIALOGUE_KEY, "true");
    }
});
