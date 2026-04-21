const INVENTORY_KEY = "requiem_inventory2026";
const INFECTION_START_KEY = "requiem_infection_start_time";
const ROOM1_DIALOGUE_KEY = "requiem_room1_dialogue_shown";

function resetRunData(){
    localStorage.removeItem(INVENTORY_KEY);
    localStorage.removeItem(INFECTION_START_KEY);
    localStorage.removeItem(ROOM1_DIALOGUE_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
    const newGameButton = document.getElementById("new-game-btn");

    if(!newGameButton){
        return;
    }

    newGameButton.addEventListener("click", () => {
        resetRunData();
        window.location.href = "./Rooms/room.html";
    });
});
