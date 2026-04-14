const ROOM1_SPAWN_KEY = "requiem_player_spawn";
const TRANSITION_DURATION_MS = 350;

window.ROOM_HITBOXES = {
    ...(window.ROOM_HITBOXES || {}),
    "room1.html": [
        // Values are percentages of map width/height.
        { id: "top-cutoff", x: 0, y: 0, width: 100, height: 25 },
        { id: "teleporter-room2", x: 95, y: 55, width: 5, height: 10, trigger: true }
    ]
};

function createFadeOverlay(){
    const overlay = document.createElement("div");
    overlay.id = "room-transition-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "#000";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "9999";
    overlay.style.transition = `opacity ${TRANSITION_DURATION_MS}ms ease`;
    document.body.appendChild(overlay);
    return overlay;
}

function transitionToRoom2(){
    sessionStorage.setItem(
        ROOM1_SPAWN_KEY,
        JSON.stringify({ room: "room2.html", x: 8, y: 55 })
    );

    const overlay = createFadeOverlay();
    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
    });

    setTimeout(() => {
        window.location.href = "./room2.html";
    }, TRANSITION_DURATION_MS);
}

window.handleRoomTrigger = (hitbox) => {
    if(hitbox.id === "teleporter-room2"){
        transitionToRoom2();
    }
};
