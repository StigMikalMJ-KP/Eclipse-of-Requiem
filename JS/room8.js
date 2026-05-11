import { getGameState_exp, setGameState } from "./states.js";
let step = 1;
const gameArea = document.getElementById("gameArea");

// Farger for dummy kuler
const dummyColors = [
    "radial-gradient(circle at 30% 30%, #FFD700, #FFA500)", // Gold/Orange
    "radial-gradient(circle at 30% 30%, #FF6B9D, #FF1493)", // Pink
    "radial-gradient(circle at 30% 30%, #00CED1, #20B2AA)", // Turquoise
    "radial-gradient(circle at 30% 30%, #9370DB, #8A2BE2)", // Purple
    "radial-gradient(circle at 30% 30%, #FF8C00, #FF4500)", // Orange/Red
    "radial-gradient(circle at 30% 30%, #32CD32, #228B22)", // Green
    "radial-gradient(circle at 30% 30%, #FF69B4, #FFB6C1)", // Hot Pink
    "radial-gradient(circle at 30% 30%, #87CEEB, #4169E1)", // Sky Blue
    "radial-gradient(circle at 30% 30%, #F0E68C, #FFD700)", // Khaki/Gold
];

function isValidPosition(x, y, size, existingCircles) {
    const minDistance = 120;
    
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

function getValidPosition(size, placedCircles) {
    let posX, posY, attempts = 0;
    const maxAttempts = 50;
    
    do {
        posX = Math.random() * (gameArea.offsetWidth - size);
        posY = Math.random() * (gameArea.offsetHeight - size);
        attempts++;
    } while (!isValidPosition(posX, posY, size, placedCircles) && attempts < maxAttempts);
    
    return { x: posX, y: posY };
}

function clearGameArea() {
    gameArea.innerHTML = "";
}

function generateStage1() {
    const placedCircles = [];
    const sizes = [];
    let maxSize = 0;
    let bigIndex = -1;
    
    // Generer størrelse for alle kuler
    for (let i = 0; i < 25; i++) {
        const size = Math.floor(Math.random() * 100) + 40; // 40-140px
        sizes.push(size);
        if (size > maxSize) {
            maxSize = size;
            bigIndex = i;
        }
    }
    
    // Opprett alle kuler
    sizes.forEach((size, index) => {
        const circle = document.createElement("div");
        circle.className = "circle";
        
        const pos = getValidPosition(size, placedCircles);
        placedCircles.push({ x: pos.x, y: pos.y, size: size });
        
        circle.style.width = size + "px";
        circle.style.height = size + "px";
        circle.style.left = pos.x + "px";
        circle.style.top = pos.y + "px";
        circle.style.animationDuration = (Math.random() * 4 + 4) + "s";
        
        if (index === bigIndex) {
            // Største kule - blå
            circle.id = "targetCircle";
            circle.className += " big";
            circle.classList.add("move-large");
            
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                alert("Bra! Du valgte den største kulen!");
                generateStage2();
            });
            
            circle.addEventListener("contextmenu", (e) => e.preventDefault());
        } else {
            // Dummy kuler
            circle.className += " dummy";
            const colorIndex = index % dummyColors.length;
            circle.style.background = dummyColors[colorIndex];
            
            const randomAnim = ["move-large", "move-medium", "move-small"][Math.floor(Math.random() * 3)];
            circle.classList.add(randomAnim);
            
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                alert("Feil! Det var ikke den største kulen!");
                location.reload();
            });
        }
        
        gameArea.appendChild(circle);
    });
}

function generateStage2() {
    clearGameArea();
    const placedCircles = [];
    const sizes = [];
    let minSize = Infinity;
    let tinyIndex = -1;
    
    // Generer størrelse for alle kuler
    for (let i = 0; i < 25; i++) {
        const size = Math.floor(Math.random() * 100) + 40; // 40-140px
        sizes.push(size);
        if (size < minSize) {
            minSize = size;
            tinyIndex = i;
        }
    }
    
    // Opprett alle kuler
    sizes.forEach((size, index) => {
        const circle = document.createElement("div");
        circle.className = "circle";
        
        const pos = getValidPosition(size, placedCircles);
        placedCircles.push({ x: pos.x, y: pos.y, size: size });
        
        circle.style.width = size + "px";
        circle.style.height = size + "px";
        circle.style.left = pos.x + "px";
        circle.style.top = pos.y + "px";
        circle.style.animationDuration = (Math.random() * 4 + 4) + "s";
        
        if (index === tinyIndex) {
            // Minste kule - lilla
            circle.id = "targetCircle";
            circle.className += " tiny";
            circle.classList.add("move-small");
            
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                alert("Bra! Du valgte den minste kulen!");
                generateStage3();
            });
        } else {
            // Dummy kuler
            circle.className += " dummy";
            const colorIndex = index % dummyColors.length;
            circle.style.background = dummyColors[colorIndex];
            
            const randomAnim = ["move-large", "move-medium", "move-small"][Math.floor(Math.random() * 3)];
            circle.classList.add(randomAnim);
            
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                alert("Feil! Det var ikke den minste kulen!");
                location.reload();
            });
        }
        
        gameArea.appendChild(circle);
    });
}

function generateStage3() {
    clearGameArea();
    const placedCircles = [];
    const sizes = [];
    let redIndex = -1;
    
    // Generer størrelse for alle kuler, en blir rød
    redIndex = Math.floor(Math.random() * 25);
    
    for (let i = 0; i < 25; i++) {
        const size = Math.floor(Math.random() * 100) + 40; // 40-140px
        sizes.push(size);
    }
    
    // Opprett alle kuler
    sizes.forEach((size, index) => {
        const circle = document.createElement("div");
        circle.className = "circle";
        
        const pos = getValidPosition(size, placedCircles);
        placedCircles.push({ x: pos.x, y: pos.y, size: size });
        
        circle.style.width = size + "px";
        circle.style.height = size + "px";
        circle.style.left = pos.x + "px";
        circle.style.top = pos.y + "px";
        circle.style.animationDuration = (Math.random() * 4 + 4) + "s";
        
        if (index === redIndex) {
            // Rød kule
            circle.id = "targetCircle";
            circle.className += " red";
            
            const randomAnim = ["move-large", "move-medium", "move-small"][Math.floor(Math.random() * 3)];
            circle.classList.add(randomAnim);
            
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                alert("DU KLARTE ROOM 8!");
                let game = getGameState_exp();
                game["doorfromtop"] = true;
                setGameState(game);
                window.location.href = "room2.html";
            });
        } else {
            // Dummy kuler
            circle.className += " dummy";
            const colorIndex = index % dummyColors.length;
            circle.style.background = dummyColors[colorIndex];
            
            const randomAnim = ["move-large", "move-medium", "move-small"][Math.floor(Math.random() * 3)];
            circle.classList.add(randomAnim);
            
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                alert("Feil! Det var ikke den røde kulen!");
                location.reload();
            });
        }
        
        gameArea.appendChild(circle);
    });
}

// Start med steg 1
generateStage1();