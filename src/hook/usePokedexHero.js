import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { fetchPokedexEntries } from '@/services/pokemonSprites'

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    const done = () => resolve(true)
    img.onload = () => (img.decode ? img.decode().then(done, done) : done())
    img.onerror = () => resolve(false)
    img.src = url
  })
}

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

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let topEls = []
    let botEls = []
    let topCenters = []
    let botCenters = []
    let thumbSize = 84
    let stride = 128
    let midX = 0
    let topY = 0
    let botY = 0
    let topOffset = 0
    let botOffset = 0
    let currentKey = ''

    const collectElements = () => {
      topEls = Array.from(stage.querySelectorAll('.pokedex-kv__thumb--top'))
      botEls = Array.from(stage.querySelectorAll('.pokedex-kv__thumb--bot'))
      topCenters = Array(topPokemons.value.length).fill(0)
      botCenters = Array(bottomPokemons.value.length).fill(0)
    }

    const alignOffset = (count, offset) => {
      if (!count || !stride) return offset
      const span = count * stride
      let best = Infinity
      for (let i = 0; i < count; i++) {
        let x = ((i * stride + offset) % span + span) % span
        if (x >= span - thumbSize) x -= span
        const delta = x + thumbSize / 2 - midX
        if (Math.abs(delta) < Math.abs(best)) best = delta
      }
      return offset - best
    }

    const measure = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight || 340
      const isMobile = width <= 768
      midX = width / 2
      thumbSize = Math.round(height * (isMobile ? 0.25 : 0.27))
      stride = Math.round(thumbSize * (isMobile ? 1.35 : 1.38))
      topY = Math.round(height * (isMobile ? 0.145 : 0.16))
      botY = Math.round(height * (isMobile ? 0.855 : 0.84))

      for (const el of topEls) {
        el.style.width = `${thumbSize}px`
        el.style.height = `${thumbSize}px`
      }
      for (const el of botEls) {
        el.style.width = `${thumbSize}px`
        el.style.height = `${thumbSize}px`
      }
    }

    const positionRow = (els, count, offset, yCenter, centers) => {
      if (!count || !stride) return
      const span = count * stride
      for (let i = 0; i < count; i++) {
        const el = els[i]
        if (!el) continue
        let x = ((i * stride + offset) % span + span) % span
        if (x >= span - thumbSize) x -= span
        el.style.transform = `translate3d(${x}px, ${yCenter - thumbSize / 2}px, 0)`
        centers[i] = x + thumbSize / 2
      }
    }

    const findClosestLoaded = (items, centers) => {
      let bestIdx = -1
      let bestDist = Infinity
      const loaded = loadedMap.value
      for (let i = 0; i < centers.length; i++) {
        const item = items[i]
        if (!item || !loaded[item.id]) continue
        const d = Math.abs(centers[i] - midX)
        if (d < bestDist) {
          bestDist = d
          bestIdx = i
        }
      }
      return { bestIdx, bestDist }
    }

    const pickClosestFeatured = () => {
      const topPick = findClosestLoaded(topPokemons.value, topCenters)
      const botPick = findClosestLoaded(bottomPokemons.value, botCenters)
      if (topPick.bestIdx < 0 && botPick.bestIdx < 0) return

      const useTop = topPick.bestDist <= botPick.bestDist
      const item = useTop
        ? topPokemons.value[topPick.bestIdx]
        : bottomPokemons.value[botPick.bestIdx]
      if (!item) return

      const nextKey = `${useTop ? 'top' : 'bot'}-${item.id}`
      if (nextKey !== currentKey) {
        currentKey = nextKey
        featured.value = item
        featuredKey.value = nextKey
      }
    }

    const entries = await fetchPokedexEntries(20)
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
        if (!featured.value) {
          currentKey = `init-${entry.id}`
          featured.value = entry
          featuredKey.value = currentKey
        }
      })
    })

    await nextTick()
    if (!mounted) return

    collectElements()
    measure()
    topOffset = alignOffset(topPokemons.value.length, 0)
    botOffset = alignOffset(bottomPokemons.value.length, 0) + stride * 0.5
    positionRow(topEls, topPokemons.value.length, topOffset, topY, topCenters)
    positionRow(botEls, bottomPokemons.value.length, botOffset, botY, botCenters)
    pickClosestFeatured()

    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (!reducedMotion) {
        const step = 46 * dt
        topOffset -= step
        botOffset += step
      }

      positionRow(topEls, topPokemons.value.length, topOffset, topY, topCenters)
      positionRow(botEls, bottomPokemons.value.length, botOffset, botY, botCenters)
      pickClosestFeatured()

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measure()
        topOffset = alignOffset(topPokemons.value.length, topOffset)
        botOffset = alignOffset(bottomPokemons.value.length, botOffset) + stride * 0.5
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
