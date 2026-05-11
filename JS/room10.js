// room10.js — Flipped mirror room, second half of the blue scroll

const MIRROR_ROOM_CONFIG = {
    roomFile:        "room10.html",

    // Scroll item for this room and the other half (in room 9)
    scrollHalfSrc:   "../Assets/ITEMS/scroll_blue_Half_Second.png",
    scrollHalfItem:  "scroll_blue_Half_Second",
    scrollOtherItem: "scroll_blue_Half_First",

    // Full scroll when both halves are collected
    scrollFullSrc:   "../Assets/ITEMS/scroll_blue.png",
    scrollFullItem:  "scroll_blue",

    // localStorage keys to track collection across rooms
    storageKeyMine:  "requiem_scroll_second_picked",
    storageKeyOther: "requiem_scroll_first_picked",

    // Position of the scroll in the mirror scene (px) — adjust to fit your layout
    scrollPosition: { x: 320, y: 280 },

    hitboxes: [
        {
            id: "teleporter-room1",
            x: 40, y: 85, width: 20, height: 15,
            trigger: { type: "manual_teleport", room: "room1.html", spawn: { x: 99, y: 55 } }
        },
        {
            id: "mirror-zone",
            x: 0, y: 30, width: 35, height: 70,
            trigger: { type: "mirror", action: "show" }
        }
    ]
};