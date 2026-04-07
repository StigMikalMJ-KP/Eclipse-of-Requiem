const INVENTORY = "requiem_inventory2026";

function getInventoryArray(){
    let objs = localStorage.getItem(INVENTORY);

    if(!objs){
        return [];
    }

    try {
        return JSON.parse(objs);
    } catch(e){
        console.log("[PARSE ERROR] Failed at parsing inv data: "+ e);
        return [];
    }
}

function addToInventory(obj){
    let inv_objects = getInventory();
    inv_objects.push(obj);
    localStorage.setItem(INVENTORY, JSON.stringify(inv_objects));
}

function removeFromInventory(obj){
    let inv_objects = getInventory();
    inv_objects.splice(inv_objects.indexOf(obj), 1);
    localStorage.setItem(INVENTORY, JSON.stringify(inv_objects));
}

