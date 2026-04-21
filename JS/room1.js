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
    // Add your starting dialogue here
    startDialogue([
        "Welcome to Eclipse of Requiem",
        "To Move around Use either WASD\nor the Arrow Keys.",
        "Interact with objects by moving,close to them and pressing the Z key.",
        "Objects you can interact with will be the ones that seem out of place",
        "Your mission is to escape the mansion and find the vaccine before you succumb to the infection.",
        "Your controls are on your top left",
        "More information can be found in the library in the next room" 

    ]);
});