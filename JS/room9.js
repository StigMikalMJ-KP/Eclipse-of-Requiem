window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room9.html": [
        // Values are percentages of map width/height.
        {
            id: "teleporter-room2",
            x: 2,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room1.html",
                spawn: { x: 99, y: 55 }
            }
        }
    ]
};
