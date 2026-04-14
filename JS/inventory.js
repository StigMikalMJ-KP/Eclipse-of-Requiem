const INVENTORY = "requiem_inventory2026";
const MAP_STATE = "requiem_mapstate2026";

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

function addToInventory(obj){
    let inv_objects = getInventoryArray();
    inv_objects.push(obj);
    localStorage.setItem(INVENTORY, JSON.stringify(inv_objects));
}

function removeFromInventory(obj){
    let inv_objects = getInventoryArray();
    inv_objects.splice(inv_objects.indexOf(obj), 1);
    localStorage.setItem(INVENTORY, JSON.stringify(inv_objects));
}



let default_state = {
    "bar": true,
    "holy-book": true,
    "keyinhole": false
};

export function updateMapState(state, bool){
    default_state[state] = bool;
}

export function getMapState(state){
    return default_state[state];
}

export function getAllMapStates(){
    return default_state;
}