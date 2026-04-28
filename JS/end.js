const ROOMS_EXPLORED_KEY = "requiem_rooms_explored";
const START_TIME_KEY = "requiem_start_time";

function getRoomsExplored(){
    const stored = localStorage.getItem(ROOMS_EXPLORED_KEY);
    return stored ? parseInt(stored, 10) : 0;
}

function getTimeSurvived(){
    const startTime = localStorage.getItem(START_TIME_KEY);
    if(!startTime){
        return 0;
    }
    
    const elapsed = Date.now() - parseInt(startTime, 10);
    return Math.floor(elapsed / 1000);
}

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function setEndMessage(won){
    const messageEl = document.getElementById("end-message");
    
    if(won){
        messageEl.textContent = "You have escaped the eclipse.";
    } else{
        messageEl.textContent = "The eclipse claims another soul.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const roomsExplored = getRoomsExplored();
    const timeSurvived = getTimeSurvived();
    
    const roomsEl = document.getElementById("rooms-explored");
    const timeEl = document.getElementById("time-survived");
    
    if(roomsEl){
        roomsEl.textContent = roomsExplored;
    }
    
    if(timeEl){
        timeEl.textContent = formatTime(timeSurvived);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const won = urlParams.get("won") === "true";
    setEndMessage(won);
    
    const restartBtn = document.getElementById("restart-btn");
    const titleBtn = document.getElementById("title-btn");
    
    if(restartBtn){
        restartBtn.addEventListener("click", () => {
            localStorage.removeItem(ROOMS_EXPLORED_KEY);
            localStorage.removeItem(START_TIME_KEY);
            window.location.href = "./room.html";
        });
    }
    
    if(titleBtn){
        titleBtn.addEventListener("click", () => {
            localStorage.removeItem(ROOMS_EXPLORED_KEY);
            localStorage.removeItem(START_TIME_KEY);
            window.location.href = "../index.html";
        });
    }
});