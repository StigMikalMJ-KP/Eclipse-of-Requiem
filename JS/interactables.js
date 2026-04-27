import { setGameState, getGameState_exp, loadAssets_exp } from "./states.js"
import { addToInventory, loadInventory, isInInventory, removeFromInventory } from "./inventory.js"

document.addEventListener("DOMContentLoaded", loadInventory);
document.addEventListener("DOMContentLoaded", createInteractableHitboxes);
document.addEventListener("keydown", checkInteractableHitboxes);

const inventorySlots = document.querySelectorAll(".inventory-slot");

const showHitboxes = true;
let insideHitbox = false;
let currentHitbox;

const dimensions = {
    width: 10,
    height: 29
}

const hitboxes = {
    "holy-book1": {
        x: 18, y: 18, item_pickup: true, required_item: false, switch_item: false, toggle: false
    },

    "holy-book2": {
        x: 42, y: 27, item_pickup: false, width: 20, height: 53, required_item: "holy-book1", switch_item: "key", toggle: false
    },

    //"keyinhole": {
    //    x: 51, y: 18, item_pickup: false, required_item: "key", switch_item: false, toggle: "bar", required_item: false
    //}
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
        if(hitboxes[hitbox].width){
            hitboxE.style.height = hitboxes[hitbox].height+"%"
        } else {
            hitboxE.style.height = dimensions.height + "%";
        }

        if(hitboxes[hitbox].width){
            hitboxE.style.width = hitboxes[hitbox].width+"%"
        } else {
            hitboxE.style.width = dimensions.width + "%";
        }

        hitboxE.id = hitbox + "-hitbox";
        hitboxE.classList.add("hitbox");
        console.log(hitboxE.id, hitboxE.style.width, hitboxE.height);   
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
        if(!inside) {
            if(insideHitbox){
                document.removeEventListener("keydown", interactInput);
                insideHitbox = false;
            }
            console.log("Not inside bounds!")

        } else {
            insideHitbox = true;
            console.log("Is inside bounds!")
            currentHitbox = hbs[hb].id;

            document.addEventListener("keydown", interactInput);
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
    let gameState = getGameState_exp();

    console.log("Interacted with:",interacted)

    if(hitboxes[interacted].item_pickup){
        gameState[interacted] = !gameState[interacted];
        addToInventory(interacted);
        loadInventory();
        delete hitboxes[interacted];
    } else if(isInInventory(hitboxes[interacted].required_item)){
        gameState[interacted] = !gameState[interacted];
        removeFromInventory(hitboxes[interacted].required_item);

        if(hitboxes[interacted].switch_item){
            addToInventory(hitboxes[interacted].switch_item);
        } else if(hitboxes[interacted].toggle){
            let element = document.getElementById(hitboxes[interacted].toggle);
            switch(element.style.display){
                case "inline": element.style.display = "none"; break;
                case "none": element.style.display = "inline"; break;
            }
        }

        loadInventory();

        delete hitboxes[interacted];
    }

    

    console.log("New value: ", !gameState[interacted]);
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