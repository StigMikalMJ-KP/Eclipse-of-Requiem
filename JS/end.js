// Constants for localStorage keys
const ROOMS_EXPLORED_KEY = "requiem_rooms_explored";
const START_TIME_KEY = "requiem_start_time";

// Function to retrieve the number of rooms explored from localStorage
function getRoomsExplored(){
    const stored = localStorage.getItem(ROOMS_EXPLORED_KEY);
    return stored ? parseInt(stored, 10) : 0;
}

// Function to calculate the time survived in seconds
function getTimeSurvived(){
    const startTime = localStorage.getItem(START_TIME_KEY);
    if(!startTime){
        return 0;
    }
    
    const elapsed = Date.now() - parseInt(startTime, 10);
    return Math.floor(elapsed / 1000);
}

// Function to format time in minutes and seconds
function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Function to set the end message based on win/loss
function setEndMessage(won){
    const messageEl = document.getElementById("end-message");
    
    if(won){
        messageEl.textContent = "You have escaped the eclipse.";
    } else{
        messageEl.textContent = "The eclipse claims another soul.";
    }
}

// Event listener for when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get rooms explored and time survived
    const roomsExplored = getRoomsExplored();
    const timeSurvived = getTimeSurvived();
    
    // Update the UI elements
    const roomsEl = document.getElementById("rooms-explored");
    const timeEl = document.getElementById("time-survived");
    
    if(roomsEl){
        roomsEl.textContent = roomsExplored;
    }
    
    if(timeEl){
        timeEl.textContent = formatTime(timeSurvived);
    }
    
    // Check URL parameters for win/loss
    const urlParams = new URLSearchParams(window.location.search);
    const won = urlParams.get("won") === "true";
    setEndMessage(won);
    
    // Set up button event listeners
    const restartBtn = document.getElementById("restart-btn");
    const titleBtn = document.getElementById("title-btn");
    const elskespillBtn = document.getElementById("elskespill-btn");
    
    if(restartBtn){
        restartBtn.addEventListener("click", () => {
            // Clear localStorage and restart game
            localStorage.removeItem(ROOMS_EXPLORED_KEY);
            localStorage.removeItem(START_TIME_KEY);
            window.location.href = "./room.html";
        });
    }
    
    if(titleBtn){
        titleBtn.addEventListener("click", () => {
            // Clear localStorage and go to title screen
            localStorage.removeItem(ROOMS_EXPLORED_KEY);
            localStorage.removeItem(START_TIME_KEY);
            window.location.href = "../index.html";
        });
    }

    if(elskespillBtn){
        elskespillBtn.addEventListener("click", () => {
            localStorage.removeItem(ROOMS_EXPLORED_KEY);
            localStorage.removeItem(START_TIME_KEY);
            window.location.href = "./room.html"
        });
    }
});