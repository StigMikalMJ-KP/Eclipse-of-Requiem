// room9.js — Mirror room, first half of the blue scroll

const MIRROR_ROOM_CONFIG = {
    roomFile:        "room9.html",

    // Scroll item for this room and the other half (in room 10)
    scrollHalfSrc:   "../Assets/ITEMS/scroll_blue_Half_First.png",
    scrollHalfItem:  "scroll_blue_Half_First",
    scrollOtherItem: "scroll_blue_Half_Second",

    // localStorage keys to track collection across rooms
    storageKeyMine:  "requiem_scroll_first_picked",
    storageKeyOther: "requiem_scroll_second_picked",

    // Position of the scroll in the mirror scene (px) — adjust to fit your layout
    scrollPosition: { x: 520, y: 280 },

    hitboxes: [
        {
            id: "teleporter-room1",
            x: 40, y: 85, width: 20, height: 15,
            trigger: { type: "manual_teleport", room: "room1.html", spawn: { x: 99, y: 55 } }
        },
        {
            id: "mirror-zone",
            x: 70, y: 30, width: 35, height: 70,
            trigger: { type: "mirror", action: "show" }
        }
    ]
};