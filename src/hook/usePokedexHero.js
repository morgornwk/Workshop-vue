import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { fetchPokedexEntries } from '@/services/pokemonSprites'

const ENTRY_COUNT = 20
const SCROLL_SPEED = 46

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    const done = () => resolve(true)
    img.onload = () => (img.decode ? img.decode().then(done, done) : done())
    img.onerror = () => resolve(false)
    img.src = url
  })
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  )
}

function wrapItemX(index, stride, offset, span, thumbSize) {
  let x = (((index * stride + offset) % span) + span) % span
  if (x >= span - thumbSize) x -= span
  return x
}

function alignRowOffset(count, offset, { stride, thumbSize, midX }) {
  if (!count || !stride) return offset
  const span = count * stride
  let bestDelta = Infinity
  for (let i = 0; i < count; i++) {
    const x = wrapItemX(i, stride, offset, span, thumbSize)
    const delta = x + thumbSize / 2 - midX
    if (Math.abs(delta) < Math.abs(bestDelta)) bestDelta = delta
  }
  return offset - bestDelta
}

function positionRow(row, { stride, thumbSize }) {
  const count = row.items.value.length
  if (!count || !stride) return

  const span = count * stride
  const topY = row.yCenter - thumbSize / 2
  for (let i = 0; i < count; i++) {
    const el = row.els[i]
    if (!el) continue
    const x = wrapItemX(i, stride, row.offset, span, thumbSize)
    el.style.transform = `translate3d(${x}px, ${topY}px, 0)`
    row.centers[i] = x + thumbSize / 2
  }
}

function findClosestLoaded(items, centers, loadedMap, midX) {
  let bestItem = null
  let bestDist = Infinity
  for (let i = 0; i < centers.length; i++) {
    const item = items[i]
    if (!item || !loadedMap[item.id]) continue
    const dist = Math.abs(centers[i] - midX)
    if (dist < bestDist) {
      bestDist = dist
      bestItem = item
    }
  }
  return { item: bestItem, dist: bestDist }
}

// Drive the dual-row Pokédex carousel animation and center spotlight feature in ShopHero.
export function usePokedexHero(stageRef) {
  const topPokemons = ref([])
  const bottomPokemons = ref([])
  const loadedMap = ref({})
  const featured = ref(null)
  const featuredKey = ref('')

  let rafId = 0
  let observer = null
  let mounted = false

  onMounted(async () => {
    mounted = true
    const stage = stageRef.value
    if (!stage) return

    const reducedMotion = prefersReducedMotion()
    const metrics = { thumbSize: 84, stride: 128, midX: 0 }
    let currentKey = ''

    const rows = [
      { key: 'top', selector: '.pokedex-kv__thumb--top', items: topPokemons, dir: -1, stagger: 0, els: [], centers: [], offset: 0, yCenter: 0 },
      { key: 'bot', selector: '.pokedex-kv__thumb--bot', items: bottomPokemons, dir: 1, stagger: 0.5, els: [], centers: [], offset: 0, yCenter: 0 },
    ]

    const setFeatured = (item, key) => {
      if (!item || key === currentKey) return
      currentKey = key
      featured.value = item
      featuredKey.value = key
    }

    const measure = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight || 340
      const isMobile = width <= 768

      metrics.midX = width / 2
      metrics.thumbSize = Math.round(height * (isMobile ? 0.25 : 0.27))
      metrics.stride = Math.round(metrics.thumbSize * (isMobile ? 1.35 : 1.38))

      rows[0].yCenter = Math.round(height * (isMobile ? 0.145 : 0.16))
      rows[1].yCenter = Math.round(height * (isMobile ? 0.855 : 0.84))

      for (const row of rows) {
        for (const el of row.els) {
          el.style.width = `${metrics.thumbSize}px`
          el.style.height = `${metrics.thumbSize}px`
        }
      }
    }

    const alignRows = () => {
      for (const row of rows) {
        row.offset = alignRowOffset(row.items.value.length, row.offset, metrics) + metrics.stride * row.stagger
      }
    }

    const updateFeatured = () => {
      let bestPick = null
      let bestRowKey = ''
      for (const row of rows) {
        const pick = findClosestLoaded(row.items.value, row.centers, loadedMap.value, metrics.midX)
        if (pick.item && (!bestPick || pick.dist < bestPick.dist)) {
          bestPick = pick
          bestRowKey = row.key
        }
      }
      if (bestPick) setFeatured(bestPick.item, `${bestRowKey}-${bestPick.item.id}`)
    }

    const entries = await fetchPokedexEntries(ENTRY_COUNT)
    if (!mounted) return

    const half = Math.floor(entries.length / 2)
    const topUnique = entries.slice(0, half)
    const botUnique = entries.slice(half)
    topPokemons.value = [...topUnique, ...topUnique]
    bottomPokemons.value = [...botUnique, ...botUnique]

    entries.forEach((entry) => {
      preloadImage(entry.image).then((ok) => {
        if (!mounted || !ok) return
        loadedMap.value = { ...loadedMap.value, [entry.id]: true }
        if (!featured.value) setFeatured(entry, `init-${entry.id}`)
      })
    })

    await nextTick()
    if (!mounted) return

    for (const row of rows) {
      row.els = Array.from(stage.querySelectorAll(row.selector))
      row.centers = Array(row.items.value.length).fill(0)
    }

    measure()
    alignRows()
    rows.forEach((row) => positionRow(row, metrics))
    updateFeatured()

    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      for (const row of rows) {
        if (!reducedMotion) row.offset += row.dir * SCROLL_SPEED * dt
        positionRow(row, metrics)
      }
      updateFeatured()
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measure()
        alignRows()
      })
      observer.observe(stage)
    }
  })

  onBeforeUnmount(() => {
    mounted = false
    if (rafId) cancelAnimationFrame(rafId)
    if (observer) observer.disconnect()
  })

  return {
    topPokemons,
    bottomPokemons,
    loadedMap,
    featured,
    featuredKey,
  }
}
