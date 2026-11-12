<template>
  <div
    class="poke-showcase"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div class="poke-showcase__ring" aria-hidden="true"></div>

    <div class="poke-showcase__brand">
      <img
        src="../../assets/images/logo_pokemoncenter_bangkok_01.svg"
        alt="Pokémon Center Bangkok"
        class="poke-showcase__logo"
      />
    </div>

    <div class="poke-showcase__head">
      <h2 class="poke-showcase__title">Collector Grade Vault</h2>
      <p class="poke-showcase__sub">
        คลังการ์ดโปเกมอนเกรด PSA / BGS และซองวินเทจแท้สำหรับนักสะสม
      </p>
    </div>

    <div class="poke-showcase__stage">
      <button
        v-for="(card, index) in cards"
        :key="card.id"
        type="button"
        class="slab-card"
        :class="positionClass(index)"
        :aria-label="`ดูการ์ด ${card.name}`"
        @click="selectCard(index)"
      >
        <div class="slab-card__header">
          <span class="slab-card__grade" :class="`slab-card__grade--${card.tone}`">
            {{ card.grade }}
          </span>
          <span class="slab-card__pop">POP {{ card.pop }}</span>
        </div>

        <div class="slab-card__art" :style="{ background: card.bg }">
          <img
            :src="artworkSrc(card.id)"
            :alt="card.name"
            class="slab-card__img"
          />
          <div class="slab-card__foil" aria-hidden="true"></div>
        </div>

        <div class="slab-card__meta">
          <span class="slab-card__set">{{ card.set }}</span>
          <strong class="slab-card__name">{{ card.name }}</strong>
        </div>
      </button>
    </div>

    <div class="poke-showcase__dots" role="tablist" aria-label="เลือกการ์ดแนะนำ">
      <button
        v-for="(card, index) in cards"
        :key="card.id"
        type="button"
        class="poke-showcase__dot"
        :class="{ 'is-active': index === activeIndex }"
        :aria-selected="index === activeIndex"
        :aria-label="card.name"
        @click="selectCard(index)"
      ></button>
    </div>

    <div class="poke-showcase__chips">
      <span class="poke-showcase__chip">
        <v-icon size="15" color="#ffd23f">mdi-shield-check-outline</v-icon>
        Authentic Verified
      </span>
      <span class="poke-showcase__chip">
        <v-icon size="15" color="#ffd23f">mdi-star-four-points-outline</v-icon>
        PSA &amp; BGS Slabs
      </span>
      <span class="poke-showcase__chip">
        <v-icon size="15" color="#ffd23f">mdi-cards-outline</v-icon>
        Sealed Vintage
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { POKE_SPRITE_BASE } from '@/services/pokemonSprites'

const SHOWCASE_CARDS = [
  {
    id: 6,
    name: 'Charizard ex',
    set: '151 SIR · #199',
    grade: 'PSA 10 GEM',
    tone: 'red',
    pop: '312',
    bg: 'linear-gradient(145deg, #7c2d12, #ea580c 58%, #facc15)',
  },
  {
    id: 25,
    name: 'Pikachu',
    set: 'PROMO · #025',
    grade: 'PSA 10 GEM',
    tone: 'red',
    pop: '41',
    bg: 'linear-gradient(145deg, #854d0e, #eab308 60%, #fef08a)',
  },
  {
    id: 150,
    name: 'Mewtwo',
    set: 'BASE SET · #10',
    grade: 'BGS 9.5',
    tone: 'yellow',
    pop: '88',
    bg: 'linear-gradient(145deg, #3b0764, #7e22ce 58%, #e879f9)',
  },
  {
    id: 384,
    name: 'Rayquaza',
    set: 'GOLD STAR · #107',
    grade: 'PSA 10 GEM',
    tone: 'blue',
    pop: '19',
    bg: 'linear-gradient(145deg, #064e3b, #059669 58%, #34d399)',
  },
]

export default {
  name: 'PokemonShowcase',
  setup() {
    const activeIndex = ref(0)
    const paused = ref(false)
    let timerId = null

    function artworkSrc(id) {
      return `${POKE_SPRITE_BASE}/other/official-artwork/${id}.png`
    }

    function selectCard(index) {
      activeIndex.value = index
    }

    function positionClass(index) {
      const len = SHOWCASE_CARDS.length
      const diff = (index - activeIndex.value + len) % len
      if (diff === 0) return 'is-center'
      if (diff === 1) return 'is-right'
      if (diff === len - 1) return 'is-left'
      return 'is-hidden'
    }

    onMounted(() => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      timerId = setInterval(() => {
        if (!paused.value) {
          activeIndex.value = (activeIndex.value + 1) % SHOWCASE_CARDS.length
        }
      }, 4000)
    })

    onBeforeUnmount(() => {
      if (timerId) clearInterval(timerId)
    })

    return {
      cards: SHOWCASE_CARDS,
      activeIndex,
      paused,
      artworkSrc,
      selectCard,
      positionClass,
    }
  },
}
</script>

<style scoped src="../../assets/style/auth/pokemon-showcase.css"></style>
