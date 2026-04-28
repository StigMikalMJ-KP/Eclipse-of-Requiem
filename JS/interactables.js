import { setGameState, getGameState_exp, loadAssets_exp } from "./states.js"
import { addToInventory, loadInventory, isInInventory, removeFromInventory } from "./inventory.js"
import { openRoom1Exit, triggerHolyBookDialogue } from "./room1.js"
import { triggerPedestalDialogue } from "./room2.js"

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
        x: 18, y: 18, 
        item_pickup: true, 
        required_item: false, 
        switch_item: false, 
        toggle: false
    },

    "holy-book2": {
        x: 42, y: 27, width: 20, height: 53,
        item_pickup: false, 
        required_item: "holy-book1", 
        switch_item: ["key", "scroll_purple"], 
        toggle: false
    },

    "keyinhole": {
        x: 51, y: 18, 
        item_pickup: false,
         required_item: "key", 
         switch_item: false, 
         toggle: "bar"
    }, 

    "lamp": {
    x: 15,
    y: 70,
    item_pickup: false,
    required_item: false,
    switch_item: false,
    toggle: false
},

    "mirror": {
    x: 72,
    y: 0,
    item_pickup: false,
    required_item: false,
    switch_item: false,
    toggle: false,
    width: 20,
    height: 35
},

    "drawer": {
    x: 59,
    y: 70,
    item_pickup: false,
    required_item: false,
    switch_item: false,
    toggle: false,
    width: 11,
    height: 40
},

    "clock": {
    x: 40,
    y: 10,
    item_pickup: false,
    required_item: false,
    switch_item: false,
    toggle: false
}
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

function checkInteractableHitboxes() {
    let hbs = document.querySelectorAll(".hitbox");
    let foundInside = false; // Temporary flag
    let activeHbId = null;


    for (let hb of hbs) {
        if (inside_bounds(hb)) {
            foundInside = true;
            activeHbId = hb.id;
            break; 
        }
    }
 
    if (foundInside && !insideHitbox) {
    
        insideHitbox = true;
        currentHitbox = activeHbId;
        document.addEventListener("keydown", interactInput);
        console.log("Entered bounds:", currentHitbox);
    } 
    else if (!foundInside && insideHitbox) {
      
        insideHitbox = false;
        currentHitbox = null;
        document.removeEventListener("keydown", interactInput);
        console.log("Exited all bounds");
    }

    else if (foundInside && insideHitbox && currentHitbox !== activeHbId) {
        currentHitbox = activeHbId;
        console.log("Switched to hitbox:", currentHitbox);
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
        
        if(interacted === "holy-book1") {
            triggerHolyBookDialogue();
        }
        
        loadInventory();
        delete hitboxes[interacted];

    } else if(
    !hitboxes[interacted].required_item ||
    isInInventory(hitboxes[interacted].required_item)
    ){
        gameState[interacted] = !gameState[interacted];
        
        if(interacted === "holy-book2") {
            triggerPedestalDialogue();
        }
        
        removeFromInventory(hitboxes[interacted].required_item);
        
        if(hitboxes[interacted].switch_item){
            let items = hitboxes[interacted].switch_item;
            if(Array.isArray(items)){
                for(let item in items){
                    addToInventory(items[item]);
                }
            } else if(typeof items === "string") addToInventory(items);
            
        } else if(hitboxes[interacted].toggle){
            let element = document.getElementById(hitboxes[interacted].toggle);
            gameState[element.id] = !gameState[element.id];

            switch(interacted){
                case "keyinhole":
                    gameState["opened-rooms"].push(3);
                    openRoom1Exit();
                    break;
            }
        }

        loadInventory();

        delete hitboxes[interacted];
    } else if(interacted === "holy-book2") {
        // Show dialogue even if they don't have the required item
        triggerPedestalDialogue();
    }

    

    console.log("New value: ", !gameState[interacted]);
    setGameState(gameState);
    console.log(getGameState_exp());
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