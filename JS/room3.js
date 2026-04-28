window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room3.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 15 },
        { id: "coffin", x: 70, y: 43, width: 10, height: 23 },
        { id: "pedestal", x: 15, y: 65, width: 1, height: 0.1 },
        {
            id: "teleporter-room3to1",
            x: 2,
            y: 55,
            width: 5,
            height: 5,
            trigger: {
                type: "teleport",
                room: "room1.html",
                spawn: { x: 99, y: 48 }
            }
        },
        {
            id: "teleporter-room3to4",
            x: 55,
            y: 5,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room4.html",
                spawn: { x: 99, y: 48 }
            }
        },
        {
            id: "teleporter-room3to6",
            x: 2,
            y: 0,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room6.html",
                spawn: { x: 99, y: 48 }
            }
        }
    ]
};
