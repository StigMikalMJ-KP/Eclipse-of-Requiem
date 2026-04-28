import { getGameState_exp, setGameState } from "./states.js";
import { isInInventory } from "./inventory.js";
import { startDialogue } from "./dialogue.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room2.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff-left", x: 0, y: 0, width: 45, height: 20 },
        //{ id: "top-cutoff-middle", x: 45, y: 0, width: 10, height: 20 },
        { id: "top-cutoff-right", x: 60, y: 0, width: 35, height: 20 },
        { id: "statue-blue", x: 0, y: 0, width: 20, height: 35 },
        { id: "statue-red", x: 82, y: 0, width: 20, height: 35 },
        { id: "statue-pink", x: 77, y: 70, width: 20, height: 35 },
        { id: "statue-green", x: 5, y: 70, width: 20, height: 35 },
        { id: "pedestal", x: 49, y: 47, width: 6, height: 10 },
        {
            id: "teleporter-room2",
            x: 2,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room1.html",
                spawn: { x: 99, y: 55 }
            }
        },
        {
            id: "teleporter-room8b",
            x: 45,
            y: 0,
            width: 10,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room8.html",
                spawn: { x: 99, y: 55 }
            }
        }
        
    ]
};

export function triggerPedestalNoDialogue() {
    startDialogue([
        "This Pedstal seems to have some sort of indentation on top.",
        "It looks like something could fit in there.",
    ], "character");
}

export function triggerPedestalYesDialogue() {
    startDialogue([
        "The book, the symbols match.",
        "I place the holy book on the pedestal.",
        "Huh, thats weird, there is a note inside the book",
        "The pedestal starts to shake, and a hidden compartment opens up.",
        "Inside, I find a key.",
        "Key and Weird Note was added to your inventory.",
    ], "character");
}

export function triggerPedestalDialogue() {
    if(isInInventory("holy-book1")) {
        triggerPedestalYesDialogue();
    } else {
        triggerPedestalNoDialogue();
    }
}
