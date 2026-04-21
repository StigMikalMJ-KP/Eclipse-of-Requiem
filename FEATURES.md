# Eclipse of Requiem - New Features Documentation

## 1. Room Selection at Start Menu

### How It Works
When players start a new game, they now have the option to choose which room they want to begin in.

### User Flow
1. Click "New Game" on the start menu
2. Select from available rooms (Room 1, Room 2, Room 9, Room 10)
3. The game loads in the selected room

### Technical Details
- Selected room is stored in localStorage with key `requiem_starting_room`
- The start-menu.js routes players to the correct room file based on selection

## 2. Dialogue System

### Features
- Display dialogue text in a styled dialogue box at the bottom of the screen
- Press Enter to advance through dialogue lines
- Movement is disabled while dialogue is active
- Simple and extensible API

### How to Use Dialogue

#### Starting a Dialogue
```javascript
// Start a dialogue sequence with an array of lines
startDialogue([
    "Hello there!",
    "How are you doing today?",
    "Welcome to the game!"
]);
```

#### Dialogue Functions

**`startDialogue(dialogueLines)`**
- Starts a new dialogue sequence
- Parameter: Array of strings containing dialogue text
- Example: `startDialogue(["Line 1", "Line 2", "Line 3"])`

**`nextDialogueLine()`**
- Manually advance to the next dialogue line
- Automatically called when player presses Enter
- Automatically called when line completes

**`endDialogue()`**
- End the current dialogue sequence
- Movement becomes enabled again
- Dialogue box is hidden

**`getDialogueState()`**
- Returns `true` if dialogue is currently active, `false` otherwise
- Useful for checking if player is in dialogue before performing other actions

### Example: Adding Dialogue to an Interactable

```javascript
// In your interactable handler
document.getElementById("some-npc").addEventListener("click", () => {
    startDialogue([
        "I've been waiting for you...",
        "The prophecy speaks of your arrival.",
        "You must find the three sacred items.",
        "Good luck, hero."
    ]);
});
```

### Dialogue Box Styling

The dialogue box is styled with:
- Semi-transparent black background
- White text and border
- Fixed position at bottom of screen
- Blinking "Press Enter to continue" indicator
- Responsive and readable design

### Movement Restrictions

When dialogue is active:
- Player cannot move in any direction
- All movement keys (WASD, Arrow Keys) are ignored
- Only Enter key works to advance dialogue

This ensures immersive dialogue sequences without accidental movement interruptions.

## Implementation Details

### Files Modified
- `index.html` - Added room selection UI
- `JS/start-menu.js` - Added room selection logic
- `JS/dialogue.js` - New dialogue system (non-module)
- `JS/movement.js` - Added dialogue state check before movement
- `CSS/Overlay.css` - Added dialogue box styles
- `CSS/start-menu.css` - Added room selection button styles
- `Rooms/room.html`, `room1.html`, `room2.html`, `room9.html`, `room10.html` - Added dialogue.js script

### localStorage Keys Used
- `requiem_starting_room` - Stores the player's selected starting room

### Global Variables
The dialogue system uses these global variables (accessible throughout the app):
- `isDialogueActive` - Boolean flag for current dialogue state
- `currentDialogueIndex` - Current line index in dialogue queue
- `currentDialogueQueue` - Array of current dialogue lines

## Future Enhancements

Possible improvements:
- Character names in dialogue
- Multiple dialogue options/choices
- Dialogue sound effects
- Text animation effects
- Save/load dialogue progress
- Different dialogue styles for different characters
