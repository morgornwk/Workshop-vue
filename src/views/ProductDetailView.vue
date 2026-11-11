<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="cartCount" />

    <section class="shop-vault detail">
      <router-link to="/shop" class="kv-btn detail__back">
        <v-icon small>mdi-arrow-left</v-icon>&nbsp;Back to Home
      </router-link>

      <p v-if="loading" class="shop-vault__msg">Loading slab details...</p>

      <div v-else-if="error" class="detail__info detail__notice" role="alert">
        <h2 class="detail__notice-title">
          {{ errorStatus === 401 ? 'Sign in required' : errorStatus === 403 ? 'Account pending approval' : 'Unable to load product' }}
        </h2>
        <p class="detail__desc">{{ error }}</p>
        <div class="detail__notice-actions">
          <router-link
            v-if="errorStatus === 401"
            :to="{ path: '/signin', query: { redirect: $route.fullPath } }"
            class="kv-btn detail__add detail__notice-btn"
          >
            Sign In
          </router-link>
          <button
            v-else
            type="button"
            class="kv-btn detail__add detail__notice-btn"
            @click="loadProduct(id)"
          >
            Try Again
          </button>
        </div>
      </div>

      <p v-else-if="notFound" class="shop-vault__msg">Product not found or no longer available.</p>

      <div v-else-if="product" class="detail__grid">
        <div class="detail__media">
          <div class="detail__art" :style="{ background: imageSrc ? '#f8fafc' : (product.art || '#cbd5e1') }">
            <img v-if="imageSrc" :src="imageSrc" :alt="product.name" class="detail__img" />
            <div v-else class="kv-slab detail__slab"></div>
            <span v-if="product.grade" class="detail__badge" :class="`detail__badge--${tone}`">{{ product.grade }}</span>
            <span v-if="popText" class="detail__pop">
              POP {{ popText }}
            </span>
          </div>
        </div>

        <div class="detail__info">
          <div class="detail__set">{{ product.set_name }} {{ product.card_number }}</div>
          <h1 class="detail__name">{{ product.name }}</h1>

          <dl class="detail__specs">
            <div><dt class="kv-label">Set</dt><dd>{{ product.set_name || '-' }}</dd></div>
            <div><dt class="kv-label">Card No.</dt><dd>{{ product.card_number || '-' }}</dd></div>
            <div><dt class="kv-label">Grade</dt><dd>{{ product.grade || '-' }}</dd></div>
            <div><dt class="kv-label">Population</dt><dd>{{ popText || '-' }}</dd></div>
          </dl>

          <p class="detail__desc">{{ product.description || 'Verified authentic slab inspected and sealed for collectors.' }}</p>

          <div class="detail__priceRow">
            <div class="detail__stat detail__stat--price">
              <div class="kv-label">Vault price</div>
              <div class="detail__price">{{ priceText }}</div>
            </div>
            <div class="detail__stat detail__stat--stock">
              <div class="kv-label">Stock</div>
              <div class="detail__stockNum" :class="{ 'detail__stockNum--out': soldOut }">
                <span class="detail__stock-dot" aria-hidden="true"></span>
                <span>{{ soldOut ? 'Out of stock' : `${product.stock} in stock` }}</span>
              </div>
            </div>
          </div>

          <div class="detail__buy">
            <div class="detail__qty" role="group" aria-label="Quantity">
              <button :disabled="soldOut || qty <= 1" aria-label="Decrease quantity" @click="qty--">−</button>
              <span>{{ qty }}</span>
              <button :disabled="soldOut || qty >= product.stock" aria-label="Increase quantity" @click="qty++">+</button>
            </div>
            <button class="kv-btn detail__add" :disabled="soldOut" @click="addToCart">
              {{ soldOut ? 'Out of Stock' : 'ADD TO CART' }}
            </button>
          </div>

          <p v-if="added" class="detail__added" role="status">
            Added {{ qty }} item(s) to cart · <router-link to="/cart" class="detail__cart-link">View Cart</router-link>
          </p>
        </div>
      </div>
    </section>

    <TornEdge fill="#212121" :seed="21" />
    <footer class="shop-foot">
      <span class="shop-foot__logo">Mor <span>gorn</span></span>
      <span>© 2026 Morgorn. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import { useProduct } from '@/hook/useProducts'
import { useCart } from '@/hook/useCart'
import { resolveImageUrl } from '@/services/api'
import { formatMoney, formatPopulation, gradeBadgeTone } from '@/utils/format'

export default {
  name: 'ProductDetailView',
  components: { ShopNavbar, TornEdge },
  props: { id: { type: String, required: true } },
  setup(props) {
    const { product, loading, error, errorStatus, notFound, loadProduct } = useProduct(() => props.id)
    const { count: cartCount, add } = useCart()

    const qty = ref(1)
    const added = ref(false)

    watch(
      () => props.id,
      () => {
        qty.value = 1
        added.value = false
      }
    )

    const soldOut = computed(() => !product.value || product.value.stock <= 0)
    const tone = computed(() => gradeBadgeTone(product.value && product.value.grade))
    const popText = computed(() => formatPopulation(product.value && product.value.population))
    const imageSrc = computed(() => resolveImageUrl(product.value && product.value.image))
    const priceText = computed(() => (product.value ? formatMoney(product.value.price) : ''))

    function addToCart() {
      if (!product.value) return
      add(product.value, qty.value)
      added.value = true
    }

    return {
      product,
      loading,
      error,
      errorStatus,
      notFound,
      loadProduct,
      qty,
      cartCount,
      added,
      soldOut,
      tone,
      popText,
      imageSrc,
      priceText,
      addToCart,
    }
  },
}
</script>

<style src="../assets/style/shop-view.css"></style>
<style src="../assets/style/components/product-detail.css"></style>
