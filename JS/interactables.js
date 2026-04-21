document.addEventListener("DOMContentLoaded", createInteractableHitboxes);


const showHitboxes = true;
export const hitboxes_exp = {
    "holy-book1": {
        x: 19.5, y: 20, 
        width: 7, height: 15, 
    },
}

const hitboxes = {
    "holy-book1": {
        x: 19.5, y: 20, 
        width: 7, height: 15, 
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
        hitboxE.style.height = hitboxes[hitbox].height + "%";
        hitboxE.style.width = hitboxes[hitbox].width + "%";
        hitboxE.id = hitbox + "-hitbox";
        hitboxE.classList.add("hitbox");
        if(showHitboxes){
            hitboxE.style.border = "1px solid red";
        }
        stage.appendChild(hitboxE);
        
    }
}