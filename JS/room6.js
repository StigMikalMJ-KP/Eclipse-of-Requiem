window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room6.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 20 },
        { id: "mirror", x: 72, y: 0, width: 20, height: 35 },
        { id: "lamp", x: 15, y: 70, width: 1, height: 40 },
        { id: "drawer", x: 59, y: 70, width: 11, height: 40 },
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
            x: 40,
            y: 80,
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
            x: 40,
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

const correctSequence = ["lamp", "mirror", "drawer", "clock"];

let puzzleSequence = [];

/*
    Called from interactables.js whenever player presses Z on an interactable object.

*/
window.handleRoom6Puzzle = function(interacted) {
    // Ignore unrelated objects
    if (!correctSequence.includes(interacted)) {
        return;
    }

    let gameState = getGameState_exp();

    // Puzzle already solved
    if (gameState["room6-note"] === true) {
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

    gameState["room6-note"] = true;
    gameState["room6-door"] = true;

    setGameState(gameState);
    loadAssets_exp();

    startDialogue([
        "You hear a drawer slide open somewhere.",
        "Something has changed..."
    ], "character");
}

/*
    Failure:
    - Reset sequence
*/
function failRoom6Puzzle() {
    puzzleSequence = [];

    startDialogue([
        "That didn't feel right."
    ], "character");
}

/*
    Optional note collection:
    If player interacts with room6-note later,
    your interactables system can add it visually.
*/
window.collectRoom6Note = function() {
    let gameState = getGameState_exp();

    if (!gameState["room6-note"]) {
        return;
    }

    startDialogue([
        "You found a note."
    ], "character");
};


function shuffleArray(array) {
    let copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

window.addEventListener("load", () => {
    const ROOM6_DIALOGUE_KEY = "requiem_room6_dialogue_shown";

    if (!localStorage.getItem(ROOM6_DIALOGUE_KEY)) {
        startDialogue([
            "This room feels... wrong.",
            "Multiple objects seem important.",
            "Maybe the way you interact with them matters?."
        ], "character");

        localStorage.setItem(ROOM6_DIALOGUE_KEY, "true");
    }
});