import { HOME_BATCH_SIZE, getPokemon, listPokemonBatch } from "../pokedex/api";
import { renderPokemonCard } from "../pokedex/ui";

function initHomePage() {
  const searchButton = document.getElementById("pokemon-search-form");
  const searchInput = document.getElementById("pokemon-search-input");
  const searchStatus = document.getElementById("search-status");
  const searchResult = document.getElementById("search-result");
  const homeGrid = document.getElementById("home-grid");
  const homeStatus = document.getElementById("home-status");
  const homeLoadMore = document.getElementById("home-load-more");

  if (
    !searchButton ||
    !searchInput ||
    !searchStatus ||
    !searchResult ||
    !homeGrid ||
    !homeStatus ||
    !homeLoadMore
  ) {
    return;
  }

  let homeOffset = 0;
  let homeLoading = false;
  let homeFinished = false;

  function updateHomeButton() {
    if (homeFinished) {
      homeLoadMore.disabled = true;
      homeLoadMore.textContent = "No hay mas Pokemon";
      return;
    }

    if (homeLoading) {
      homeLoadMore.disabled = true;
      homeLoadMore.textContent = "Cargando más Pokemon...";
      return;
    }

    homeLoadMore.disabled = false;
    homeLoadMore.textContent = "Cargar más Pokemon";
  }

  async function loadHomePokemon(reset = false) {
    if (homeLoading) {
      return;
    }

    homeLoading = true;

    if (reset) {
      homeOffset = 0;
      homeFinished = false;
      homeGrid.innerHTML = "";
      homeStatus.textContent = "Cargando Pokemon iniciales...";
    }

    updateHomeButton();

    try {
      const list = await listPokemonBatch(homeOffset, HOME_BATCH_SIZE);
      if (!list.results.length) {
        homeFinished = true;
        homeStatus.textContent = "No quedan mas Pokemon por mostrar.";
        return;
      }

      const pokemon = await Promise.all(
        list.results.map((entry) => getPokemon(entry.name)),
      );

      homeGrid.insertAdjacentHTML(
        "beforeend",
        pokemon.map((entry) => renderPokemonCard(entry)).join(""),
      );

      homeOffset += list.results.length;
      homeStatus.textContent = `Se han cargado ${homeOffset} Pokemon en total.`;

      if (!list.next) {
        homeFinished = true;
      }
    } catch (error) {
      homeStatus.textContent = `No se pudieron cargar los Pokemon: ${error.message}`;
    } finally {
      homeLoading = false;
      updateHomeButton();
    }
  }

  async function searchPokemon(query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      searchStatus.textContent = "Escribe un nombre o numero valido.";
      searchResult.classList.add("hidden");
      searchResult.innerHTML = "";
      return;
    }

    searchStatus.textContent = "Buscando Pokemon...";
    searchResult.classList.add("hidden");

    try {
      const pokemon = await getPokemon(normalizedQuery);
      searchResult.innerHTML = renderPokemonCard(pokemon);
      searchResult.classList.remove("hidden");
      searchStatus.textContent = `Hemos encontrado a ${pokemon.name.toUpperCase()} como resultado de tu búsqueda.`;
    } catch (error) {
      searchStatus.textContent = `No se encontro el Pokemon: ${error.message}`;
      searchResult.classList.add("hidden");
      searchResult.innerHTML = "";
    }
  }

  searchButton.addEventListener("click", () => {
    searchPokemon(searchInput.value);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchPokemon(searchInput.value);
    }
  });

  homeLoadMore.addEventListener("click", () => {
    loadHomePokemon();
  });

  loadHomePokemon(true);
}

document.addEventListener("DOMContentLoaded", initHomePage, { once: true });
