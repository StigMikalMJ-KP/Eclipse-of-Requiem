const GAME_STATE = "requiem_gamestate2026";

let game = getGameState();

if(!game){
    game = {
        unlockedRooms: [1, 2],
        currentRoom: 1,
        states: {
            "bar": true,
            "holy-book1": true,
            "holy-book2": false,
            "keyinhole": false
        },
    }
}


document.addEventListener("DOMContentLoaded", loadAssets);


function loadAssets(){
    for(state in game.states){
        if(!document.getElementById(state)) continue;
        let assetE = document.getElementById(state)
        if(game.states[state] == true){
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


function setGameState(game_state){
    let stringed_state = JSON.stringify(game_state);
    localStorage.setItem(GAME_STATE, stringed_state);
}

function getGameState(){
    let objs = localStorage.getItem(GAME_STATE);

    if(!objs){
        return null;
    }

    try {
        return JSON.parse(objs);
    } catch(e){
        console.log("[PARSE ERROR] Failed at parsing game state data: "+ e);
        return null;
    }
}

