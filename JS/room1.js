window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room1.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 25 },
        {
            id: "teleporter-room2",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room2.html",
                spawn: { x: 25, y: 55 }
            }
        }
    ]
};

