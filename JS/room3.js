console.log("Room 3 script loaded");

import { addToInventory } from "./inventory.js";
import { getGameState_exp } from "./states.js";
import { startDialogue } from "./dialogue.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room3.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff-left", x: 0, y: 0, width: 38, height: 20 },
        { id: "top-cutoff-middle", x: 39, y: 0, width: 14, height: 20 },
        { id: "top-cutoff-right", x: 54, y: 0, width: 40, height: 20 },

        { id: "coffin", x: 70, y: 43, width: 10, height: 26 },
        { id: "pedestal", x: 15, y: 65, width: 1, height: 0.1 },
        {
            id: "teleporter-room3to1",
            x: 40,
            y: 95,
            width: 8,
            height: 5,
            trigger: {
                type: "teleport",
                room: "room1.html",
                spawn: { x: 60, y: 20 }
            }
        },
        {
            id: "teleporter-room3to4",
            x: 2,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room4.html",
                spawn: { x: 99, y: 48 }
            }
        },
        {
            id: "teleporter-room3to6",
            x: 2,
            y: 0,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room6.html",
                spawn: { x: 99, y: 48 }
            }
        },
    ]
};


export function triggerFingerDialogue() {
    startDialogue([
        "A Skeleton finger?...",
        "Its quite cold.",
        "Looks like the finger is from an old man",
        "Skeleton-Finger was added to your inventory."
    ], "character");
}

export function triggerFingertinoPedestalDialogue() {
    startDialogue([
        "I place the finger on the pedestal...",
        "The finger glows with an eerie light.",
        "It seems as if im going to have a bad time",
    ], "character");
}


document.addEventListener("DOMContentLoaded", load_room5_entrance);

const room_stage = document.getElementById("room-stage");

let hitboxes = window.ROOM_HITBOXES["room3.html"];
function load_room5_entrance(){
    let game = getGameState_exp();
    if(game["chest-open"]){
        hitboxes.push({
            id: "maze-wall",
            x: 45,
            y: 7,
            width: 8,
            height: 14,
            trigger: {
                type: "teleport",
                room: "room6.html",
                spawn: { x: 55, y: 73 }
            }
        })

        for(let hitbox in hitboxes){
            if(hitboxes[hitbox].id === "top-cutoff-middle"){
                delete hitboxes[hitbox];
                break;
            }
        }
    }

}

