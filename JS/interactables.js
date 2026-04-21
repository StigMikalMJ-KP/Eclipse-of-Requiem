document.addEventListener("DOMContentLoaded", createInteractableHitboxes);
document.addEventListener("keydown", checkInteractableHitboxes);


const showHitboxes = true;
const dimensions = {
    width: 10,
    height: 29
}

const hitboxes = {
    "holy-book1": {
        x: 18, y: 18, 
    },
}



function createInteractableHitboxes(){
    let stage = document.getElementById("room-stage");
    
    for(let hitbox in hitboxes){
        console.log(hitbox+"-hitbox");
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

function checkInteractableHitboxes(){
    let hbs = document.querySelectorAll(".hitbox");
    console.log(hbs)

    for(let hb in hbs){
        if(!(hbs[hb] instanceof HTMLElement)) continue;
        let inside = inside_bounds(hbs[hb]);
        if(inside) {
            hbs[hb].style.border = "none";
            console.log("Is inside bounds!")
        } else {
            console.log("Not inside bounds!")
        }
            
    }
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