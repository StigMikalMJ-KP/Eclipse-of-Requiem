export let game = {
    unlockedRooms: [],
    currentRoom: 1,
}



export function updateUnlockedRooms(newRooms){
    game.unlockedRooms = newRooms;
}

export function updateCurrentRoom(currentRoom){
    game.currentRoom = currentRoom;
}