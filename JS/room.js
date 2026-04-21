window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 15 },
        { id: "table", x: 48, y: 57, width: 5, height: 1 },
        {
            id: "teleporter-room1",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room1.html",
                spawn: { x: 25, y: 48 }
            }
        }
    ]
};

// Start dialogue when the room loads
window.addEventListener("load", () => {
    // Add your starting dialogue here
    startDialogue([
        "Welcome to Eclipse of Requiem...",
        "Your journey begins now."
    ]);
});
