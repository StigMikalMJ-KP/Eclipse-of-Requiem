import { getGameState_exp, setGameState } from "./states.js";

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room5.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff-left", x: 0, y: 0, width: 38, height: 20 },
        //{ id: "top-cutoff-middle", x: 45, y: 0, width: 10, height: 20 },
        { id: "top-cutoff-right", x: 54, y: 0, width: 40, height: 20 },

        { id: "maze-wall", x: 50, y: 50, width: 10, height: 10}
        /*
        {
            id: "teleporter-room5a",
            x: 95,
            y: 55,
            width: 5,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room2.html",
                spawn: { x: 25, y: 48 }
            }
        },
        {
            id: "teleporter-room5b",
            x: 38,
            y: 0,
            width: 16,
            height: 10,
            trigger: {
                type: "teleport",
                room: "room3.html",
                spawn: { x: 59, y: 77 }
            }
        }
            */
    ]
};

const room_stage = document.getElementById("room-stage");
let hitboxes = window.ROOM_HITBOXES["room5.html"];
for(let i = 0; i < hitboxes.length; i++){
    if(hitboxes[i].id === "maze-wall"){
        let wall = document.createElement("div");
        

        

    }
}


