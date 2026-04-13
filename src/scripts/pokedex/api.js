const API = "https://pokeapi.co/api/v2";

export const HOME_BATCH_SIZE = 30;
export const HABITAT_BATCH_SIZE = 20;
export const ITEM_BATCH_SIZE = 20;

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se ha podido cargar la informacion");
  }

  return response.json();
}

export async function listPokemonBatch(offset, limit = HOME_BATCH_SIZE) {
  return fetchJson(`${API}/pokemon?limit=${limit}&offset=${offset}`);
}

export async function getPokemon(idOrName) {
  const data = await fetchJson(`${API}/pokemon/${String(idOrName).toLowerCase()}`);

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((typeInfo) => typeInfo.type.name),
    image:
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default ||
      "",
    cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`,
  };
}

export async function listHabitats() {
  return fetchJson(`${API}/pokemon-habitat`);
}

export async function getHabitat(habitatName) {
  return fetchJson(`${API}/pokemon-habitat/${habitatName.toLowerCase()}`);
}

export async function listAllItems() {
  return fetchJson(`${API}/item?limit=10000`);
}

export async function getItem(itemName) {
  const data = await fetchJson(`${API}/item/${itemName.toLowerCase()}`);
  const englishEffect = data.effect_entries.find(
    (entry) => entry.language.name === "en",
  );
  const englishFlavor = data.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  );

  return {
    name: data.name,
    image: data.sprites?.default || "",
    description:
      englishEffect?.short_effect ||
      englishFlavor?.text ||
      "No description available.",
    consumable: data.consumable,
    battleUsable: data.attributes.some(
      (attribute) => attribute.name === "usable-in-battle",
    ),
  };
}
