const MAX_ITEMS = 6;


function get_inventory(){
    let inv_json = localStorage.getItem("requiem_inventory");
    if(!inv_json){
        return false;
    }
    let inv = JSON.stringify(inv_json).split(",");
    return inv;
}

function add_to_inventory(item){
    let inv = get_inventory();
    if(inv.length === MAX_ITEMS){
        return false;
    }
    if(inv === false){
        inv = [];
    }

    inv.push(item);
    let json_inv = JSON.stringify(inv);

    localStorage.setItem("requiem_inventory", json_inv);
}

localStorage.clear();


console.log(get_inventory());
add_to_inventory("HEYA");

console.log(get_inventory());
