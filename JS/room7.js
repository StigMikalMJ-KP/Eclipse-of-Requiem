let timeLeft = 5;
const timerText = document.getElementById("timer");
const gameArea = document.getElementById("gameArea");

// Generer 18 random kuler
const circleCount = 18;
const sizes = [];
let maxSize = 0;
let correctCircleIndex = -1;
const circles = [];

// Generer random størrelse for hver kule
for (let i = 0; i < circleCount; i++) {
    const size = Math.floor(Math.random() * 120) + 30; // 30-150px
    sizes.push(size);
    if (size > maxSize) {
        maxSize = size;
        correctCircleIndex = i;
    }
}

// Funksjon for å sjekke om en posisjon er gyldig (ikke overlapper med andre)
function isValidPosition(x, y, size, existingCircles) {
    const minDistance = 150; // Minimum avstand mellom kulene
    
    for (let circle of existingCircles) {
        const dx = (x + size/2) - (circle.x + circle.size/2);
        const dy = (y + size/2) - (circle.y + circle.size/2);
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < minDistance) {
            return false;
        }
    }
    return true;
}

// Opprett kuler i DOM med spacing
sizes.forEach((size, index) => {
    const circle = document.createElement("div");
    circle.className = "circle";
    circle.id = index === correctCircleIndex ? "correctCircle" : `circle-${index}`;
    
    // Finn valid posisjon
    let posX, posY, attempts = 0;
    const maxAttempts = 50;
    
    do {
        posX = Math.floor(Math.random() * (gameArea.offsetWidth - size));
        posY = Math.floor(Math.random() * (gameArea.offsetHeight - size));
        attempts++;
    } while (!isValidPosition(posX, posY, size, circles) && attempts < maxAttempts);
    
    circles.push({ x: posX, y: posY, size: size });
    
    circle.style.width = size + "px";
    circle.style.height = size + "px";
    circle.style.left = posX + "px";
    circle.style.top = posY + "px";
    circle.style.animationDuration = (Math.random() * 4 + 4) + "s"; // 4-8 sekunder
    
    // Velg animasjonstype basert på størrelse
    if (size > 100) {
        circle.classList.add("move-large");
    } else if (size > 70) {
        circle.classList.add("move-medium");
    } else {
        circle.classList.add("move-small");
    }
    
    gameArea.appendChild(circle);
});

// Timer logic
const countdown = setInterval(() => {
    timeLeft--;
    timerText.textContent = "Tid: " + timeLeft;

    if(timeLeft <= 0){
        clearInterval(countdown);
        alert("Tiden er ute!");
        location.reload();
    }
}, 1000);

// Event listeners
document.getElementById("correctCircle").addEventListener("click", () => {
    clearInterval(countdown);
    alert("Bra! Du valgte den største kulen!");
    window.location.href = "room8.html";
});

document.querySelectorAll(".circle").forEach(circle => {
    if(circle.id !== "correctCircle"){
        circle.addEventListener("click", () => {
            clearInterval(countdown);
            alert("Feil! Det var ikke den største kulen!");
            location.reload();
        });
    }
});