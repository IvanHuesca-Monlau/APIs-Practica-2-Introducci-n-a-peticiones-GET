export function toTitleCase(value) {
  return String(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const TYPE_ICONS = {
  normal: "⚪",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🍃",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "🟤",
  flying: "🪽",
  psychic: "🔮",
  bug: "🐛",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  fairy: "✨",
};

function renderTypeIcons(types) {
  return types
    .map((type) => {
      const icon = TYPE_ICONS[type] || "❔";
      const label = toTitleCase(type);
      return `<span class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-base" title="${label}" aria-label="${label}">${icon}</span>`;
    })
    .join("");
}

function renderItemStateIcon({ active, icon, label }) {
  const tone = active
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";

  return `<span class="inline-flex h-8 w-8 items-center justify-center rounded-full border ${tone}" title="${label}" aria-label="${label}">${icon}</span>`;
}

export function renderPokemonCard(pokemon) {
  const image =
    pokemon.image || "https://placehold.co/200x200/f1f5f9/0f172a?text=No+image";

  return `
    <article class="rounded-lg border border-slate-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-xl font-bold text-slate-950">${toTitleCase(pokemon.name)}</h3>
          <p class="text-sm text-slate-600">ID ${pokemon.id}</p>
        </div>
        <div class="flex items-center gap-2">${renderTypeIcons(pokemon.types)}</div>
      </div>
      <img class="mx-auto mt-4 h-32 w-32 object-contain" src="${image}" alt="${toTitleCase(pokemon.name)}" loading="lazy" />
      <div class="mt-4">
        <audio class="w-full" controls preload="none" src="${pokemon.cry}"></audio>
      </div>
      <p class="mt-3 text-sm text-slate-700">Juegos: ${pokemon.games.slice(0, 4).join(", ") || "No disponible"}</p>
    </article>
  `;
}

export function renderItemCard(item) {
  const image = item.image || "https://placehold.co/120x120/e2e8f0/0f172a?text=Item";

  return `
    <article class="rounded-lg border border-slate-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-bold text-slate-950">${toTitleCase(item.name)}</h3>
        </div>
        <div class="flex items-center gap-2">
          ${renderItemStateIcon({
            active: item.consumable,
            icon: "🧪",
            label: item.consumable ? "Consumible" : "No consumible",
          })}
          ${renderItemStateIcon({
            active: item.battleUsable,
            icon: "⚔️",
            label: item.battleUsable ? "Se puede usar en batalla" : "No se puede usar en batalla",
          })}
        </div>
      </div>
      <img class="mx-auto mt-4 h-32 w-32 object-contain" src="${image}" alt="${toTitleCase(item.name)}" loading="lazy" />
      <p class="mt-4 text-sm leading-6 text-slate-700">${item.description}</p>
    </article>
  `;
}
