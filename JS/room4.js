console.log("Room 4 script loaded");

import { addToInventory } from "./inventory.js";
import { getGameState_exp } from "./states.js";
import { startDialogue } from "./dialogue.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room4.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 20 },
        { id: "pedestal", x: 15, y: 65, width: 1, height: 0.1 },
        { id: "piano", x: 10, y: 50, width: 15, height: 15 },
        {
             id: "teleporter-room3a",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room3.html",
                spawn: { x: 25, y: 48 }
            }
        }
    ]
};


export function triggerPianoDialogue() {
    startDialogue([
        "An old piano...",
        "It looks like it hasn't been played in years.",
        "The keys are dusty and some are missing."
    ], "character");
}

export function triggerMissingPictureDialogue() {
    startDialogue([
        "A painting...",
        "Its eyes seem to follow me across the room.",
        "It hangs rather loosely on the wall..."
    ], "character");
}


document.addEventListener("DOMContentLoaded", load_room6_entrance);

const room_stage = document.getElementById("room-stage");

let hitboxes = window.ROOM_HITBOXES["room4.html"];
function load_room6_entrance(){
    let game = getGameState_exp();
    if(game["fingertino"]){
        hitboxes.push({
            id: "maze-wall",
            x: 20,
            y: 10,
            width: 8,
            height: 14,
            trigger: {
                type: "teleport",
                room: "room5.html",
                spawn: { x: 55, y: 76 }
            }
        })
    }
}