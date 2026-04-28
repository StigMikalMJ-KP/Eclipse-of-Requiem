// Dialogue system for Eclipse of Requiem
let isDialogueActive = false;
let currentDialogueIndex = 0;
let currentDialogueQueue = [];
let currentDialogueType = "game"; // "game" or "character"

/**
 * Create dialogue UI elements using the project's CSS classes
 */
function initializeDialogueUI() {
    if (document.getElementById("dialogue-box")) return;

    const dialogueContainer = document.createElement("div");
    dialogueContainer.id = "dialogue-box";
    dialogueContainer.className = "dialogue-container";
    dialogueContainer.style.backgroundImage = 'url("../Assets/UI/talk2.png")';

    // We add the portrait as an absolute element so it sits in the 280px margin area
    dialogueContainer.innerHTML = `
        <img id="dialogue-portrait" src="../Assets/UI/hode.png" 
             style="position: absolute; left: 280px; bottom: 60px; width: 120px; display: none; image-rendering: pixelated;" />
        <div class="dialogue-content">
            <p id="dialogue-text"></p>
            <span class="dialogue-indicator">[Press Enter to continue]</span>
        </div>
    `;
    document.body.appendChild(dialogueContainer);
}

/**
 * Start a dialogue sequence
 * @param {Array} dialogueLines - Array of strings
 * @param {String} type - Use "character" for portraits, "game" for narrator
 */
export function startDialogue(dialogueLines, type = "game") {
    if (!Array.isArray(dialogueLines) || dialogueLines.length === 0) {
        console.warn("Invalid dialogue lines provided");
        return;
    }

    initializeDialogueUI();
    
    isDialogueActive = true;
    currentDialogueIndex = 0;
    currentDialogueQueue = dialogueLines;
    currentDialogueType = type; 
    
    displayCurrentDialogue();
}

/**
 * Display current line and toggle portrait
 */
function displayCurrentDialogue() {
    if (currentDialogueIndex >= currentDialogueQueue.length) {
        endDialogue();
        return;
    }

    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    const portrait = document.getElementById("dialogue-portrait");
    
    // Toggle portrait visibility
    if (currentDialogueType === "character") {
        portrait.style.display = "block";
    } else {
        portrait.style.display = "none";
    }

    dialogueText.textContent = currentDialogueQueue[currentDialogueIndex];
    dialogueBox.style.display = "flex"; // Your CSS uses flex for centering
}

/**
 * Advance to the next line
 */
function nextDialogueLine() {
    if (!isDialogueActive) return;

    currentDialogueIndex++;
    
    if (currentDialogueIndex >= currentDialogueQueue.length) {
        endDialogue();
    } else {
        displayCurrentDialogue();
    }
}

/**
 * End the sequence and hide UI
 */
function endDialogue() {
    isDialogueActive = false;
    currentDialogueIndex = 0;
    currentDialogueQueue = [];
    
    const dialogueBox = document.getElementById("dialogue-box");
    if (dialogueBox) {
        dialogueBox.style.display = "none";
    }
}

/**
 * Global listener for Enter key
 */
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && isDialogueActive) {
        e.preventDefault();
        nextDialogueLine();
    }
});

/**
 * Get the current dialogue state
 * @returns {boolean} Whether dialogue is currently active
 */
export function getDialogueState() {
    return isDialogueActive;
}