import { getGameState_exp, setGameState } from "./states.js";
import { isInInventory } from "./inventory.js";
import { startDialogue } from "./dialogue.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room2.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff-left", x: 0, y: 0, width: 45, height: 20 },
        { id: "top-cutoff-middle", x: 45, y: 0, width: 13, height: 20 },
        { id: "top-cutoff-right", x: 59, y: 0, width: 38, height: 20 },
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
        
    ]
};

let hitboxes = window.ROOM_HITBOXES["room2.html"];
const door_teleporter = {
    id: "teleporter-room2a",
    x: 45,
    y: 0,
    width: 13,
    height: 14,
    trigger: {
        type: "teleport",
        room: "room8.html",
        spawn: { x: 99, y: 55 }
    }
}


let path = window.location.pathname;
let page = path.split("/").pop();
if(page === "room2.html"){
    document.addEventListener("DOMContentLoaded", load_upper_door);
};

function load_upper_door(){
    let game = getGameState_exp();
    console.log("Door state: ", game["doorfromtop"])
    if(game["doorfromtop"]){
        hitboxes.push(door_teleporter);
        
        for(let hitbox in hitboxes){
            if(hitboxes[hitbox].id === "top-cutoff-middle"){
                delete hitboxes[hitbox];
                break;
            }
        }
    }
}


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

export function triggerPadNoDialogue() {
    startDialogue([
        "This lock seems to have some sort of indentation on top.",
        "It looks like something could fit in there.",
    ], "character");
}

export function triggerPadYesDialogue() {
    startDialogue([
        "The scroll, it seems it could fit",
        "I place the scroll on the lock.",
        "Huh, thats weird it starts to glow",
        "As you the blue scroll glows on the ground you realize",
        "In this world, can i be myself? Can i be free?",
        "Can i choose who i am? Or am i just a prisoner of fate, bound to this cycle of despair?",
        "The scroll crumbles to dust, and a hidden compartment opens up.",
        "Inside, I find a gun.",
    ], "character");
}




export function triggerPedestalDialogue() {
    if(isInInventory("holy-book1")) {
        triggerPedestalYesDialogue();
    } else {
        triggerPedestalNoDialogue();
    }
}



export function triggerPadDialogue() {
    if(isInInventory("scroll_blue")) {
        triggerPadYesDialogue();

    // 60000ms = 1 minute
    setTimeout(() => {
    window.location.href = "room12.html";
        }, 60000);
    } else {
        triggerPadNoDialogue();
    }
}