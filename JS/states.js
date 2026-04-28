const GAME_STATE = "requiem_gamestate2026";


document.addEventListener("DOMContentLoaded", loadAssets);

const default_states = {
    "bar": true,
    "holy-book1": true,
    "holy-book2": false,
    "keyinhole": false,
    "bar": true,
    "opened-rooms": [1,2]
}

/*
    Laster inn assets med oppdartet tilstand.
    Synlig/ikke synlig
*/
function loadAssets(){
    let game = getGameState();
    for(let state in game){
        if(!document.getElementById(state)) continue;
        let assetE = document.getElementById(state)
        if(game[state] == true){
            assetE.style.display = "inline";
        } else {
            assetE.style.display = "none";
        }
    }
}

export function resetStates(){
    localStorage.setItem(GAME_STATE, JSON.stringify(default_states));
}

export function loadAssets_exp(){
    let game = getGameState();
    for(let state in game){
        if(!document.getElementById(state)) continue;
        let assetE = document.getElementById(state)
        if(game[state] == true){
            assetE.style.display = "inline";
        } else {
            assetE.style.display = "none";
        }
    }
}

function unlockNewRoom(){
    game.unlockedRooms.push(game.unlockedRooms[-1]+1);
}

function updateCurrentRoom(currentRoom){
    game.currentRoom = currentRoom;
}


export function setGameState(game_state){
    let stringed_state = JSON.stringify(game_state);
    localStorage.setItem(GAME_STATE, stringed_state);
}

//Får game state
function getGameState(){
    let objs = localStorage.getItem(GAME_STATE);

    if(!objs){
        return default_states;
    }

    try {
        console.log("Returned", objs);
        return JSON.parse(objs);
    } catch(e){
        console.log("[PARSE ERROR] Failed at parsing game state data: "+ e);
        return null;
    }
}

export function getGameState_exp(){
    let objs = localStorage.getItem(GAME_STATE);

    if(!objs){
        return default_states;
    }
    
    try {
        return JSON.parse(objs);
    } catch(e){
        console.log("[PARSE ERROR] Failed at parsing game state data: "+ e);
        return null;
    }
}
