const INVENTORY = "requiem_inventory2026";



function getInventoryArray(){
    let objs = localStorage.getItem(INVENTORY);

    if(!objs){
        return [];
    }

    try {
        return JSON.parse(objs);
    } catch(e){
        console.log("[PARSE ERROR] Failed at parsing inventory data: "+ e);
        return [];
    }
}

export function addToInventory(obj){
    let inv_objects = getInventoryArray();
    inv_objects.push(obj);
    localStorage.setItem(INVENTORY, JSON.stringify(inv_objects));
}

function removeFromInventory(obj){
    let inv_objects = getInventoryArray();
    inv_objects.splice(inv_objects.indexOf(obj), 1);
    localStorage.setItem(INVENTORY, JSON.stringify(inv_objects));
}

export function loadInventory(){
    let items = getInventoryArray();
    let slots = document.querySelectorAll(".inventory-slot");

    for(let i = 0; i < items.length; i++){
        let itemSlot = document.createElement("img");
        itemSlot.id = items[i]+"-inv";
        itemSlot.src = "../Assets/ITEMS/"+items[i]+".png";
        slots[i].appendChild(itemSlot);
    }
}

