const INVENTORY_KEY = "requiem_inventory2026";
const INFECTION_START_KEY = "requiem_infection_start_time";

function resetRunData(){
    localStorage.removeItem(INVENTORY_KEY);
    localStorage.removeItem(INFECTION_START_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
    const newGameButton = document.getElementById("new-game-btn");

    if(!newGameButton){
        return;
    }

    newGameButton.addEventListener("click", () => {
        resetRunData();
        window.location.href = "./Rooms/room1.html";
    });
});
