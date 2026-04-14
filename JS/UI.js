const inv_content = `<aside id="inventory-grid" aria-label="Inventory">
    <div class="inventory-slot"></div>
    <div class="inventory-slot"></div>
    <div class="inventory-slot"></div>
    <div class="inventory-slot"></div>
    <div class="inventory-slot"></div>
</aside>
`;

const side_content = `<aside id="controls-panel" aria-label="Controls">
    <h2>Controls</h2>
    <p><strong>Move:</strong> WASD or Arrow Keys</p>
    <p><strong>Interact:</strong> Z</p>
    <p><strong>Dialogue:</strong> Enter</p>
</aside>`;

const infected_content = `<aside id="infected-list" aria-label="Infected List">
    <h2>Infected</h2>
    <div id="infected-bar" class="infected-bar">
        <img id="infected-base" src="../Assets/UI/infected_bar/pixil_background.png" alt="Infection background">
    </div>
</aside>`;

const leave_button = `<button id="leave-button" aria-label="Leave the game">Quit the game</button>`;

const left_ui_content = `<section id="left-ui-column" aria-label="Left UI">
    ${side_content}
    ${infected_content}
    ${leave_button}
</section>`;

const INFECTED_STAGES = [
    { atMs: 60000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-1.png" },
    { atMs: 120000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-2.png" },
    { atMs: 180000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-3.png" },
    { atMs: 240000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-4.png" },
    { atMs: 300000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-5.png" },
    { atMs: 360000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-6.png" },
    { atMs: 420000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-7.png" },
    { atMs: 480000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-8.png" },
    { atMs: 540000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-9.png" },
    { atMs: 600000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-10.png" },
    { atMs: 660000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-11.png" },
    { atMs: 720000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-12.png" },
    { atMs: 780000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-13.png" },
    { atMs: 840000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-14.png" },
    { atMs: 900000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-15.png" },
    { atMs: 960000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-16.png" },
    { atMs: 1020000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-17.png" },
    { atMs: 1080000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-18.png" },
    { atMs: 1140000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-19.png" },
    { atMs: 1200000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-20.png" },
    { atMs: 1260000, layerSrc: "../Assets/UI/infected_bar/pixil-layer-21.png" },

];  

const INFECTION_START_KEY = "requiem_infection_start_time";

function addInfectedLayer(container, layerSrc){
    const layerImage = document.createElement("img");
    layerImage.src = layerSrc;
    layerImage.alt = "Infection progress layer";
    layerImage.className = "infected-layer";
    layerImage.setAttribute("aria-hidden", "true");
    container.appendChild(layerImage);
}

function getOrCreateInfectionStartTime(){
    const savedStartTime = Number(localStorage.getItem(INFECTION_START_KEY));

    if(Number.isFinite(savedStartTime) && savedStartTime > 0){
        return savedStartTime;
    }

    const newStartTime = Date.now();
    localStorage.setItem(INFECTION_START_KEY, String(newStartTime));
    return newStartTime;
}

function startInfectedTimer(){
    const infectedBar = document.getElementById("infected-bar");
    if(!infectedBar){
        return;
    }

    const startTime = getOrCreateInfectionStartTime();
    let nextStageToApply = 0;

    const updateStage = () => {
        const elapsedMs = Date.now() - startTime;

        while(
            nextStageToApply < INFECTED_STAGES.length &&
            elapsedMs >= INFECTED_STAGES[nextStageToApply].atMs
        ){
            addInfectedLayer(infectedBar, INFECTED_STAGES[nextStageToApply].layerSrc);
            nextStageToApply++;
        }
    };

    updateStage();
    setInterval(updateStage, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("container").insertAdjacentHTML("beforeend", inv_content);
    document.getElementById("container").insertAdjacentHTML("afterbegin", left_ui_content);
    const leaveButton = document.getElementById("leave-button");

    if(leaveButton){
        leaveButton.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    startInfectedTimer();
})
