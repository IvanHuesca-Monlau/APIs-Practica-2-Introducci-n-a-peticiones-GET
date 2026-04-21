import {
  HABITAT_BATCH_SIZE,
  getHabitat,
  getPokemon,
  listHabitats,
} from "../pokedex/api";
import { renderPokemonCard, toTitleCase } from "../pokedex/ui";

function initHabitatsPage() {
  const habitatList = document.getElementById("habitat-list");
  const habitatGrid = document.getElementById("habitat-grid");
  const habitatTitle = document.getElementById("habitat-title");
  const habitatCount = document.getElementById("habitat-count");

  if (!habitatList || !habitatGrid || !habitatTitle || !habitatCount) {
    return;
  }

  let habitatsLoaded = false;

  async function loadHabitats() {
    if (habitatsLoaded) {
      return;
    }

    habitatsLoaded = true;

    const data = await listHabitats();
    const habitats = data.results ?? [];
    habitatList.innerHTML = habitats
      .map(
        (habitat) => `
          <button type="button" data-habitat="${habitat.name}" class="rounded-full border border-slate-300 bg-white px-4 py-1 text-sm text-slate-700 hover:bg-slate-100">
            ${toTitleCase(habitat.name)}
          </button>
        `,
      )
      .join("");
  }

  async function loadHabitatPokemon(habitatName) {
    const normalizedName = habitatName.trim().toLowerCase();

    if (!normalizedName) {
      return;
    }

    habitatTitle.textContent = toTitleCase(normalizedName);
    habitatCount.textContent = "Cargando Pokemon...";
    habitatGrid.innerHTML = "";

    try {
      const habitat = await getHabitat(normalizedName);
      const species = (habitat.pokemon_species ?? []).slice(0, HABITAT_BATCH_SIZE);

      if (!species.length) {
        habitatCount.textContent =
          "No se han encontrado Pokemon para este habitat.";
        return;
      }

      const pokemon = await Promise.all(
        species.map((entry) => getPokemon(entry.name)),
      );

      habitatGrid.innerHTML = pokemon.map((entry) => renderPokemonCard(entry)).join("");
      habitatCount.textContent = `Mostrando ${pokemon.length} Pokemon.`;
    } catch (error) {
      habitatCount.textContent = "Error al cargar el habitat.";
    }
  }

  habitatList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("button[data-habitat]");
    if (!button || !button.dataset.habitat) {
      return;
    }

    loadHabitatPokemon(button.dataset.habitat);
  });

  loadHabitats();
}

document.addEventListener("DOMContentLoaded", initHabitatsPage, { once: true });
