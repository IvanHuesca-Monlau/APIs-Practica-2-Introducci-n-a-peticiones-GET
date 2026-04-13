import { ITEM_BATCH_SIZE, getItem, listAllItems } from "../pokedex/api";
import { renderItemCard } from "../pokedex/ui";

function initItemsPage() {
  const itemsStatus = document.getElementById("items-status");
  const itemsGrid = document.getElementById("items-grid");

  if (!itemsStatus || !itemsGrid) {
    return;
  }

  let itemsLoaded = false;

  async function loadItems() {
    if (itemsLoaded) {
      return;
    }

    itemsLoaded = true;

    try {
      const list = await listAllItems();
      const results = list.results ?? [];

      if (!results.length) {
        itemsStatus.textContent = "No se encontraron objetos en la API.";
        return;
      }

      for (let index = 0; index < results.length; index += ITEM_BATCH_SIZE) {
        const chunk = results.slice(index, index + ITEM_BATCH_SIZE);
        const items = await Promise.all(chunk.map((entry) => getItem(entry.name)));

        itemsGrid.insertAdjacentHTML(
          "beforeend",
          items.map((entry) => renderItemCard(entry)).join(""),
        );

        itemsStatus.textContent = `Estamos cargando todos los objetos en bloques para mantener la interfaz fluida. Un momento, por favor... ${Math.min(index + chunk.length, results.length)} / ${results.length}`;
      }

      itemsStatus.textContent = `Hemos cargado los ${results.length} objetos correctamente.`;
    } catch (error) {
      itemsStatus.textContent = `No se han podido cargar los objetos: ${error.message}`;
    }
  }

  loadItems();
}

document.addEventListener("DOMContentLoaded", initItemsPage, { once: true });
