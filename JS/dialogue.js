// Dialogue system for Eclipse of Requiem

let isDialogueActive = false;
let currentDialogueIndex = 0;
let currentDialogueQueue = [];

// Create dialogue UI elements
function initializeDialogueUI(){
    if(document.getElementById("dialogue-box")){
        return;
    }

    const dialogueContainer = document.createElement("div");
    dialogueContainer.id = "dialogue-box";
    dialogueContainer.className = "dialogue-container";
    dialogueContainer.style.backgroundImage = 'url("../Assets/UI/talk2.png")';
    dialogueContainer.innerHTML = `
        <div class="dialogue-content">
            <p id="dialogue-text"></p>
            <span class="dialogue-indicator">[Press Enter to continue]</span>
        </div>
    `;
    document.body.appendChild(dialogueContainer);
}

/**
 * Start a dialogue sequence
 * @param {Array} dialogueLines - Array of strings containing dialogue text
 */
function startDialogue(dialogueLines){
    if(!Array.isArray(dialogueLines) || dialogueLines.length === 0){
        console.warn("Invalid dialogue lines provided");
        return;
    }

    initializeDialogueUI();
    isDialogueActive = true;
    currentDialogueIndex = 0;
    currentDialogueQueue = dialogueLines;
    
    displayCurrentDialogue();
}

/**
 * Display the current dialogue line
 */
function displayCurrentDialogue(){
    if(currentDialogueIndex >= currentDialogueQueue.length){
        endDialogue();
        return;
    }

    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    
    dialogueText.textContent = currentDialogueQueue[currentDialogueIndex];
    dialogueBox.style.display = "block";
}

/**
 * Advance to the next dialogue line
 */
function nextDialogueLine(){
    if(!isDialogueActive){
        return;
    }

    currentDialogueIndex++;
    
    if(currentDialogueIndex >= currentDialogueQueue.length){
        endDialogue();
        return;
    }

    displayCurrentDialogue();
}

/**
 * End the current dialogue sequence
 */
function endDialogue(){
    isDialogueActive = false;
    currentDialogueIndex = 0;
    currentDialogueQueue = [];
    
    const dialogueBox = document.getElementById("dialogue-box");
    if(dialogueBox){
        dialogueBox.style.display = "none";
    }
}

/**
 * Check if dialogue is currently active
 * @returns {boolean} True if dialogue is ongoing
 */
function getDialogueState(){
    return isDialogueActive;
}

// Listen for Enter key to advance dialogue
document.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && isDialogueActive){
        e.preventDefault();
        nextDialogueLine();
    }
});
