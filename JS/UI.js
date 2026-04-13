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


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("container").insertAdjacentHTML("beforeend", inv_content);
    document.getElementById("container").insertAdjacentHTML("afterbegin", side_content);
})
