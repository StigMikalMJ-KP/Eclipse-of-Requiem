console.log("Room 4 script loaded");

import { addToInventory } from "./inventory.js";
import { getGameState_exp } from "./states.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room4.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 20 },
        { id: "pedestal", x: 15, y: 65, width: 1, height: 0.1 },
        {
             id: "teleporter-room3a",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room3.html",
                spawn: { x: 25, y: 48 }
            }
        },
        {
            id: "teleporter-room3to5",
            x: 60,
            y: 0,
            width: 10,
            height: 5,
            trigger: {
                type: "teleport",
                room: "room5.html",
                spawn: { x: 99, y: 48 }
            }
        }
    ]
};
