export const POKE_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
const POKE_API_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0'

function pokemonArtworkUrl(id) {
  return `${POKE_SPRITE_BASE}/other/official-artwork/${id}.png`
}

function pokemonAnimatedSpriteUrl(id) {
  return `${POKE_SPRITE_BASE}/versions/generation-v/black-white/animated/${id}.gif`
}

function formatDexEntry(id, rawName) {
  const code = `#${String(id).padStart(4, '0')}`
  const name = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : code
  return { id, code, name, image: pokemonArtworkUrl(id) }
}

const CURATED_DEX = [
  [1, 'Bulbasaur'], [3, 'Venusaur'], [6, 'Charizard'], [9, 'Blastoise'],
  [25, 'Pikachu'], [52, 'Meowth'], [59, 'Arcanine'], [94, 'Gengar'],
  [130, 'Gyarados'], [131, 'Lapras'], [133, 'Eevee'], [143, 'Snorlax'],
  [149, 'Dragonite'], [150, 'Mewtwo'], [151, 'Mew'], [197, 'Umbreon'],
  [212, 'Scizor'], [248, 'Tyranitar'], [249, 'Lugia'], [250, 'Ho-oh'],
  [280, 'Ralts'], [282, 'Gardevoir'], [373, 'Salamence'], [384, 'Rayquaza'],
  [445, 'Garchomp'], [448, 'Lucario'], [492, 'Shaymin'], [658, 'Greninja'],
  [700, 'Sylveon'], [778, 'Mimikyu'], [887, 'Dragapult'], [906, 'Sprigatito'],
  [909, 'Fuecoco'], [912, 'Quaxly'], [1000, 'Gholdengo'], [1025, 'Pecharunt'],
]

const FALLBACK_POKEDEX_ENTRIES = CURATED_DEX.map(([id, name]) => formatDexEntry(id, name))

function pickRandomEntries(items, count) {
  const pool = items.slice()
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export async function fetchPokedexEntries(count = 20) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), 1800) : null
  try {
    const res = await fetch(
      POKE_API_LIST_URL,
      controller ? { signal: controller.signal } : undefined
    )
    if (!res.ok) return FALLBACK_POKEDEX_ENTRIES.slice(0, count)
    const data = await res.json()
    const parsed = (data.results || [])
      .map((item) => {
        const match = item.url && item.url.match(/\/pokemon\/(\d+)\//)
        return match ? formatDexEntry(Number(match[1]), item.name) : null
      })
      .filter(Boolean)
    return parsed.length >= count
      ? pickRandomEntries(parsed, count)
      : FALLBACK_POKEDEX_ENTRIES.slice(0, count)
  } catch {
    return FALLBACK_POKEDEX_ENTRIES.slice(0, count)
  } finally {
    if (timer) clearTimeout(timer)
  }
}

const FOOTER_BUDDIES = [
  [1, 'Bulbasaur'],
  [4, 'Charmander'],
  [7, 'Squirtle'],
  [25, 'Pikachu'],
  [39, 'Jigglypuff'],
  [54, 'Psyduck'],
  [94, 'Gengar'],
  [131, 'Lapras'],
  [133, 'Eevee'],
  [143, 'Snorlax'],
  [149, 'Dragonite'],
  [150, 'Mewtwo'],
  [151, 'Mew'],
  [448, 'Lucario'],
  [492, 'Shaymin'],
]

export const FOOTER_BUDDY_SPRITES = FOOTER_BUDDIES.map(([id, name]) => ({
  id,
  name,
  src: pokemonAnimatedSpriteUrl(id),
}))
