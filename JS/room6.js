// room6.js
// Room 6 puzzle logic using existing state + interactables system

//import { getGameState_exp, setGameState, loadAssets_exp } from "./states.js";    

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room6.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 20 },
        { id: "mirror", x: 72, y: 0, width: 20, height: 35 },
        { id: "lamp", x: 15, y: 70, width: 1, height: 40 },
        {
            id: "teleporter-room6a",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room7.html",
                spawn: { x: 25, y: 48 }
            }
        },
        {
            id: "teleporter-room6b",
            x: 50,
            y: 10,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room3.html",
                spawn: { x: 25, y: 48 }
            }
        },
        {
            id: "teleporter-room6c",
            x: 50,
            y: 20,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room10.html",
                spawn: { x: 25, y: 48 }
            }
        }
    ]
};
/*
    FAST TEST SEQUENCE:
    lamp -> mirror -> drawer -> clock

    You can randomize later if wanted.
*/
const correctSequence = ["lamp", "mirror", "drawer", "clock"];

let puzzleSequence = [];

/*
    Called from interactables.js whenever player presses Z on an interactable object.

    REQUIRED in interactables.js:
    if (typeof handleRoom6Puzzle === "function") {
        handleRoom6Puzzle(interacted);
    }
*/
window.handleRoom6Puzzle = function(interacted) {
    // Ignore unrelated objects
    if (!correctSequence.includes(interacted)) {
        return;
    }

    let gameState = getGameState_exp();

    // Puzzle already solved
    if (gameState.states["room6-note"] === true) {
        return;
    }

    puzzleSequence.push(interacted);

    console.log("[ROOM6] Current sequence:", puzzleSequence);

    // Check when enough inputs are entered
    if (puzzleSequence.length === correctSequence.length) {
        if (JSON.stringify(puzzleSequence) === JSON.stringify(correctSequence)) {
            solveRoom6Puzzle();
        } else {
            failRoom6Puzzle();
        }
    }
};

/*
    Success:
    - Reveal note
    - Unlock door
*/
function solveRoom6Puzzle() {
    let gameState = getGameState_exp();

    gameState.states["room6-note"] = true;
    gameState.states["room6-door"] = true;

    setGameState(gameState);
    loadAssets_exp();

    showRoom6Message("Du hører en skuff åpne seg...");
}

/*
    Failure:
    - Reset sequence
*/
function failRoom6Puzzle() {
    puzzleSequence = [];

    showRoom6Message("Noe føles feil...");
}

/*
    Optional note collection:
    If player interacts with room6-note later,
    your interactables system can add it visually.
*/
window.collectRoom6Note = function() {
    let gameState = getGameState_exp();

    if (!gameState.states["room6-note"]) {
        return;
    }

    showRoom6Message("Du tok lappen.");
};

/*
    UI message box
*/
function showRoom6Message(message) {
    let msgBox = document.getElementById("room6-message");

    if (!msgBox) {
        msgBox = document.createElement("div");
        msgBox.id = "room6-message";

        msgBox.style.position = "absolute";
        msgBox.style.bottom = "5%";
        msgBox.style.left = "50%";
        msgBox.style.transform = "translateX(-50%)";

        msgBox.style.backgroundColor = "rgba(0,0,0,0.85)";
        msgBox.style.color = "white";
        msgBox.style.padding = "12px 20px";
        msgBox.style.fontSize = "18px";
        msgBox.style.border = "1px solid white";
        msgBox.style.zIndex = "9999";

        document.body.appendChild(msgBox);
    }

    msgBox.textContent = message;

    clearTimeout(msgBox.hideTimeout);

    msgBox.hideTimeout = setTimeout(() => {
        msgBox.textContent = "";
    }, 2000);
}

/*
    Optional helper:
    If you later want randomized puzzle order
*/
function shuffleArray(array) {
    let copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

