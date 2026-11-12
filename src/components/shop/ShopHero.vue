<template>
  <section class="shop-hero">
    <div class="shop-hero__inner">
      <div class="shop-hero__left">
        <img
          src="../../assets/images/pokemon_pikachu_02.svg"
          alt="Pikachu"
          class="shop-hero__pikachu"
        />
      </div>

      <div class="shop-hero__content">
        <img
          src="../../assets/images/logo_pokemoncenter_bangkok_01.svg"
          alt="Pokémon Center Bangkok"
          class="shop-hero__logo"
        />
        <h1 class="shop-hero__title">Grand Opening!</h1>
        <p class="shop-hero__intro">
          “ร้านการ์ดโปเกมอนเปิดใหม่” สำหรับนักสะสม รวมทั้งการ์ดหายาก การ์ดเกรด PSA 10
          <br class="shop-hero__br" />
          ซองบูสเตอร์ลิขสิทธิ์แท้ และอุปกรณ์ถนอมการ์ดคุณภาพสูง พร้อมคัดสภาพอย่างใส่ใจทุกใบ
          <br class="shop-hero__br" />
          พบกับโปรโมชั่นฉลองเปิดร้านและดรอปการ์ดแรร์อัปเดตใหม่ทุกสัปดาห์!
        </p>
      </div>

      <div class="shop-hero__right">
        <img
          src="../../assets/images/pokemon_shaymin_03.svg"
          alt="Shaymin"
          class="shop-hero__shaymin"
        />
      </div>
    </div>

    <div ref="pokedexStage" class="pokedex-kv">
      <div class="pokedex-kv__rows" aria-hidden="true">
        <div
          v-for="(mon, idx) in topPokemons"
          :key="`top-${idx}-${mon.id}`"
          class="pokedex-kv__thumb pokedex-kv__thumb--top"
        >
          <img
            v-if="loadedMap[mon.id]"
            :src="mon.image"
            alt=""
            class="pokedex-kv__thumb-img"
          />
        </div>
        <div
          v-for="(mon, idx) in bottomPokemons"
          :key="`bot-${idx}-${mon.id}`"
          class="pokedex-kv__thumb pokedex-kv__thumb--bot"
        >
          <img
            v-if="loadedMap[mon.id]"
            :src="mon.image"
            alt=""
            class="pokedex-kv__thumb-img"
          />
        </div>
      </div>

      <div class="pokedex-kv__feature">
        <div v-if="featured" :key="featuredKey" class="pokedex-kv__feature-inner">
          <img :src="featured.image" :alt="featured.name" class="pokedex-kv__feature-img" />
        </div>
      </div>
    </div>

    <div class="shop-hero__scroll-wrap">
      <button type="button" class="shop-hero__scroll" @click="scrollToVault">
        <span>เลื่อนลงเพื่อเลือกชมสินค้า</span>
        <v-icon size="20">mdi-chevron-down</v-icon>
      </button>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { usePokedexHero } from '@/hook/usePokedexHero'

export default {
  name: 'ShopHero',
  setup() {
    const pokedexStage = ref(null)
    const { topPokemons, bottomPokemons, loadedMap, featured, featuredKey } =
      usePokedexHero(pokedexStage)

    const scrollToVault = () => {
      const target = document.getElementById('vault')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return {
      pokedexStage,
      topPokemons,
      bottomPokemons,
      loadedMap,
      featured,
      featuredKey,
      scrollToVault,
    }
  },
}
</script>

<style src="../../assets/style/shop/shop-hero.css"></style>
