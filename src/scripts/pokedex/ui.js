export function toTitleCase(value) {
  return String(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function renderPokemonCard(pokemon) {
  const image =
    pokemon.image || "https://placehold.co/200x200/f1f5f9/0f172a?text=No+image";
  const types = pokemon.types.map((type) => toTitleCase(type)).join(", ");

  return `
    <article class="rounded-lg border border-slate-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-xl font-bold text-slate-950">${toTitleCase(pokemon.name)}</h3>
          <p class="text-sm text-slate-600">ID ${pokemon.id}</p>
        </div>
      </div>
      <img class="mx-auto mt-4 h-32 w-32 object-contain" src="${image}" alt="${toTitleCase(pokemon.name)}" loading="lazy" />
      <div class="mt-4">
        <audio class="w-full" controls preload="none" src="${pokemon.cry}"></audio>
      </div>
      <p class="mt-3 text-sm text-slate-700">Tipo: ${types || "No disponible"}</p>
    </article>
  `;
}

export function renderItemCard(item) {
  const image =
    item.image || "https://placehold.co/120x120/e2e8f0/0f172a?text=Item";
  const consumableText = item.consumable ? "Si" : "No";
  const battleText = item.battleUsable ? "Si" : "No";

  return `
    <article class="rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h3 class="text-lg font-bold text-slate-950">${toTitleCase(item.name)}</h3>
      </div>
      <img class="mx-auto mt-4 h-32 w-32 object-contain" src="${image}" alt="${toTitleCase(item.name)}" loading="lazy" />
      <p class="mt-3 text-sm text-slate-700">Consumible: ${consumableText}</p>
      <p class="mt-1 text-sm text-slate-700">Uso en batalla: ${battleText}</p>
      <p class="mt-4 text-sm leading-6 text-slate-700">${item.description}</p>
    </article>
  `;
}
