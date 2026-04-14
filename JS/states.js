const GAME_STATE = "requiem_gamestate2026";

/*


GJØR IKKE NOE I DET HELE TATT

IKKE FERDIG


*/


export let game = getGameState();

if(!game){
    game = {
        unlockedRooms: [],
        currentRoom: 1,
        states: {
            "bar": true,
            "holy-book": true,
            "keyinhole": false
        },
    }
}


export function updateUnlockedRooms(newRooms){
    game.unlockedRooms = newRooms;
}

export function updateCurrentRoom(currentRoom){
    game.currentRoom = currentRoom;
}


function setGameState(game_state){
    let stringed_state = JSON.stringify(game_state);
    localStorage.setItem(GAME_STATE, stringed_state);
}

function getGameState(){
    let objs = localStorage.getItem(GAME_STATE);

    if(!objs){
        return false;
    }

    try {
        return JSON.parse(objs);
    } catch(e){
        console.log("[PARSE ERROR] Failed at parsing game state data: "+ e);
        return false;
    }
}