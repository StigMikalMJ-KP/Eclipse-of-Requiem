import { setGameState, getGameState_exp, loadAssets_exp } from "./states.js"
import { addToInventory, loadInventory } from "./inventory.js"

document.addEventListener("DOMContentLoaded", loadInventory);
document.addEventListener("DOMContentLoaded", createInteractableHitboxes);
document.addEventListener("keydown", checkInteractableHitboxes);

const inventorySlots = document.querySelectorAll(".inventory-slot");

const showHitboxes = false;
let insideHitbox = false;
let currentHitbox;

const dimensions = {
    width: 10,
    height: 29
}

const hitboxes = {
    "holy-book1": {
        x: 18, y: 18, item_pickup: true
    },
}


/*
/ Funksjon som lager hitboxene til interactables
/ Tar utgangspunkt i variabelen "hitboxes" som lagrer hva hitboxen tilhører til, og hvor den skal ligge
*/
function createInteractableHitboxes(){
    let stage = document.getElementById("room-stage");
    
    for(let hitbox in hitboxes){
        if(!document.getElementById(hitbox)) continue;
    
        let hitboxE = document.createElement("div");
        hitboxE.style.position = "absolute";
        hitboxE.style.left = hitboxes[hitbox].x + "%";
        hitboxE.style.top = hitboxes[hitbox].y + "%";
        hitboxE.style.height = dimensions.height + "%";
        hitboxE.style.width = dimensions.width + "%";
        hitboxE.id = hitbox + "-hitbox";
        hitboxE.classList.add("hitbox");
        if(showHitboxes){
            hitboxE.style.border = "1px solid red";
        }
        stage.appendChild(hitboxE);
    }
}


/*

    Funksjon som sjekker om spilleren er innafor hitbox til interactables

*/
function checkInteractableHitboxes(){
    let hbs = document.querySelectorAll(".hitbox");

    for(let hb in hbs){
        if(!(hbs[hb] instanceof HTMLElement)) continue;
        let inside = inside_bounds(hbs[hb]);
        if(inside) {
            insideHitbox = true;
            console.log("Is inside bounds!")
            currentHitbox = hbs[hb].id;

            document.addEventListener("keydown", interactInput);
        } else {
            if(insideHitbox){
                document.removeEventListener("keydown", interactInput);
                insideHitbox = false;
            }
            console.log("Not inside bounds!")
        }
    }
}

/*
    Funksjon som blir knyttet til en 'keydown' event listener. ¨
    Blir aktivert når spilleren er innenfor en interactable hitbox
    Og sjekker om spilleren trykker på interact input. Equipper i inventory
*/
function interactInput(e){
    if(e.code != "KeyZ") return;
    console.log("Current hitbox: ", currentHitbox);
    let interacted = currentHitbox.substring(0, currentHitbox.length - 7);
    
    if(hitboxes[interacted].item_pickup){
        addToInventory(interacted);
        loadInventory();
        delete hitboxes[interacted];
    }

    for(let i = 0; i < inventorySlots.length; i++){
        let itemSlot = document.createElement("img");
        itemSlot.id = interacted+"-inv";
        itemSlot.src = "../Assets/ITEMS/"+interacted+".png";
        inventorySlots[i].appendChild(itemSlot);
        break;
    }



    let gameState = getGameState_exp();
    console.log("Interacted with:",interacted)
    console.log("New value: ", !gameState[interacted]);
    gameState[interacted] = !gameState[interacted];
    setGameState(gameState);
    loadAssets_exp();

}

function inside_bounds(obj){
    const plr = player.getBoundingClientRect();
    const obj_rect = obj.getBoundingClientRect();
    const margin = 15;

    return plr.left >= obj_rect.left && 
       plr.top >= obj_rect.top && 
       plr.right <= obj_rect.right && 
       plr.bottom <= obj_rect.bottom;

}