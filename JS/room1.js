window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room1.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 20 },
        {
            id: "teleporter-room2",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room2.html",
                spawn: { x: 25, y: 48 }
            }
        }
    ]
};

window.addEventListener("load", () => {
    // Only show dialogue once per game
    const ROOM1_DIALOGUE_KEY = "requiem_room1_dialogue_shown";
    
    if(!localStorage.getItem(ROOM1_DIALOGUE_KEY)){
        startDialogue([
            "So this must be the library. It seems like the previous owner was a scholar of some sort.",
            "There is a locked door over there.",
            "I wonder if I can find a key to open it somehow.",
            "I better start looking for clues."
          

        ]);
        localStorage.setItem(ROOM1_DIALOGUE_KEY, "true");
    }
});