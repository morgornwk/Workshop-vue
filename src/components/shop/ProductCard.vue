<template>
  <article class="pcard" :class="{ 'pcard--sold': soldOut }">
    <div class="pcard__art" :style="artStyle">
      <img v-if="imageSrc" :src="imageSrc" :alt="product.name" loading="lazy" class="pcard__img" />
      <div v-else class="kv-slab pcard__slab"></div>
      <span v-if="product.grade" class="pcard__badge" :class="`pcard__badge--${tone}`">{{ product.grade }}</span>
      <span v-if="popText" class="pcard__pop">POP {{ popText }}</span>
      <span v-if="soldOut" class="pcard__sold">SOLD OUT</span>
    </div>

    <div class="pcard__body">
      <div class="pcard__set">{{ product.set_name }} {{ product.card_number }}</div>
      <h3 class="pcard__name">{{ product.name }}</h3>
    </div>

    <div class="pcard__foot">
      <div class="pcard__price-row">
        <span class="kv-label">Vault price</span>
        <div class="pcard__price">{{ priceText }}</div>
      </div>
      <div class="pcard__actions">
        <button class="kv-btn pcard__btn pcard__btn--detail" @click="$emit('view', product)">Detail</button>
        <button class="kv-btn pcard__btn pcard__btn--add" :disabled="soldOut" @click="$emit('add', product)">
          {{ soldOut ? 'Sold' : 'Add to cart' }}
        </button>
        <button
          v-if="isAdmin"
          type="button"
          class="kv-btn pcard__btn pcard__btn--delete"
          :disabled="deleting"
          :aria-label="`Delete ${product.name}`"
          title="Delete product"
          @click="$emit('delete', product)"
        >
          <v-icon size="18">mdi-trash-can-outline</v-icon>
          <span>Delete Product</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import { resolveImageUrl } from '@/services/api'
import { formatMoney, formatPopulation, gradeBadgeTone } from '@/utils/format'

export default {
  name: 'ProductCard',
  props: {
    product: { type: Object, required: true },
    isAdmin: { type: Boolean, default: false },
    deleting: { type: Boolean, default: false },
  },
  computed: {
    soldOut() { return this.product.stock <= 0 },
    tone() { return gradeBadgeTone(this.product.grade) },
    popText() { return formatPopulation(this.product.population) },
    imageSrc() { return resolveImageUrl(this.product.image) },
    artStyle() { return { background: this.imageSrc ? '#f8fafc' : (this.product.art || '#cbd5e1') } },
    priceText() { return formatMoney(this.product.price) },
  },
}
</script>

<style src="../../assets/style/components/product-card.css"></style>
