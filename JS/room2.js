window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room2.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 25 },
        { id: "statue-blue", x: 0, y: 0, width: 20, height: 35 },
        { id: "statue-red", x: 82, y: 0, width: 20, height: 35 },
        { id: "statue-pink", x: 77, y: 70, width: 20, height: 35 },
        { id: "statue-green", x: 5, y: 70, width: 20, height: 35 },
        { id: "pedestal", x: 49, y: 47, width: 6, height: 10 },
        {
            id: "teleporter-room2",
            x: 2,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room1.html",
                spawn: { x: 99, y: 48 }
            }
        }
    ]
};
