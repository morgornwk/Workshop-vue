<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="count" />

    <section class="shop-vault cart-page">
      <div class="cart-page__top">
        <router-link to="/shop" class="kv-btn detail__back">
          <v-icon small>mdi-arrow-left</v-icon>&nbsp;Back to Home
        </router-link>
        <h1 class="cart-page__title">Shopping Cart ({{ count }})</h1>
      </div>

      <div v-if="orderDone" class="cart-page__card cart-page__done" role="status">
        <v-icon size="42" color="#16a34a">mdi-check-circle-outline</v-icon>
        <h2>Order Confirmed!</h2>
        <p>
          Successfully placed {{ confirmedCount }} order(s). Your graded slabs are being prepared for insured dispatch.
        </p>
        <router-link to="/shop" class="kv-btn cart-page__cta">Continue Shopping</router-link>
      </div>

      <div v-else-if="!items.length" class="cart-page__card cart-page__empty">
        <v-icon size="44" color="#9ca3af">mdi-cart-outline</v-icon>
        <h2>Your cart is empty</h2>
        <p>Pick any graded slab or vintage pack from the vault to add it to your cart.</p>
        <router-link to="/shop" class="kv-btn cart-page__cta">Browse Cards</router-link>
      </div>

      <div v-else class="cart-page__grid">
        <ul class="cart-page__list">
          <li v-for="i in items" :key="i.id" class="cart-page__item">
            <router-link
              :to="`/shop/${i.id}`"
              class="cart-page__thumb"
              :style="{ background: i.art || '#cbd5e1' }"
            >
              <img v-if="imageSrc(i)" :src="imageSrc(i)" :alt="i.name" />
            </router-link>

            <div class="cart-page__info">
              <div class="cart-page__set">{{ i.set_name }} {{ i.card_number }}</div>
              <router-link :to="`/shop/${i.id}`" class="cart-page__name">
                {{ i.name }}
              </router-link>
              <div class="cart-page__grade">{{ i.grade }}</div>
              <div class="cart-page__unit">{{ money(i.price) }}</div>
            </div>

            <div class="cart-page__controls">
              <div class="cart-page__qty" role="group" :aria-label="`${i.name} quantity`">
                <button :disabled="submitting || i.qty <= 1" aria-label="Decrease quantity" @click="setQty(i.id, i.qty - 1)">
                  −
                </button>
                <span>{{ i.qty }}</span>
                <button :disabled="submitting || i.qty >= i.stock" aria-label="Increase quantity" @click="setQty(i.id, i.qty + 1)">
                  +
                </button>
              </div>
              <div class="cart-page__price-col">
                <div class="cart-page__sub">{{ money(i.price * i.qty) }}</div>
                <button class="cart-page__remove" :disabled="submitting" :aria-label="`Remove ${i.name}`" @click="remove(i.id)">
                  <v-icon small>mdi-trash-can-outline</v-icon> Remove
                </button>
              </div>
            </div>
          </li>
        </ul>

        <aside class="cart-page__card cart-page__summary">
          <h2 class="cart-page__sum-title">Order Summary</h2>
          <div class="cart-page__row">
            <span>Items ({{ count }})</span>
            <span>{{ money(total) }}</span>
          </div>
          <div class="cart-page__row">
            <span>Insured Vault Shipping</span>
            <span class="cart-page__free">Free</span>
          </div>
          <div class="cart-page__divider"></div>
          <div class="cart-page__row cart-page__row--total">
            <span>Total</span>
            <strong>{{ money(total) }}</strong>
          </div>
          <p v-if="checkoutError" class="cart-page__error" role="alert">
            {{ checkoutError }}
          </p>
          <button
            class="kv-btn cart-page__cta cart-page__cta--full"
            :disabled="submitting"
            @click="checkout"
          >
            {{ submitting ? 'Processing...' : isAuthenticated ? 'Checkout' : 'Sign In to Checkout' }}
          </button>
          <button class="cart-page__clear" :disabled="submitting" @click="clear">Clear Cart</button>
        </aside>
      </div>
    </section>

    <TornEdge fill="#212121" :seed="12" />
    <footer class="shop-foot">
      <span class="shop-foot__logo">Mor <span>gorn</span></span>
      <span>© 2026 Morgorn. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import router from '@/router'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useToast } from '@/hook/useToast'
import { resolveImageUrl } from '@/services/api'
import { createProductOrder } from '@/services/orderService'
import { formatMoney } from '@/utils/format'

export default {
  name: 'CartView',
  components: { ShopNavbar, TornEdge },
  setup() {
    const { items, count, total, setQty, remove, clear } = useCart()
    const { isAuthenticated } = useAuth()
    const { toastSuccess } = useToast()

    const orderDone = ref(false)
    const confirmedCount = ref(0)
    const submitting = ref(false)
    const checkoutError = ref('')

    const money = formatMoney
    const imageSrc = (i) => resolveImageUrl(i.image)

    async function checkout() {
      if (!items.value.length || submitting.value) return
      checkoutError.value = ''

      if (!isAuthenticated.value) {
        router.push({ path: '/signin', query: { redirect: '/cart' } }).catch(() => {})
        return
      }

      submitting.value = true
      let placed = 0

      try {
        for (const item of [...items.value]) {
          try {
            await createProductOrder(item.id, item.qty)
            remove(item.id)
            placed++
          } catch (err) {
            err.itemName = item.name
            throw err
          }
        }

        confirmedCount.value = placed
        orderDone.value = true
        toastSuccess('สั่งซื้อสำเร็จ!', `ยืนยันคำสั่งซื้อ ${placed} รายการเรียบร้อยแล้ว`)
      } catch (err) {
        const prefix = err.itemName ? `${err.itemName}: ` : ''
        checkoutError.value = `${prefix}${err.message || 'Unable to complete checkout'}`
      } finally {
        submitting.value = false
      }
    }

    return {
      items,
      count,
      total,
      isAuthenticated,
      orderDone,
      confirmedCount,
      submitting,
      checkoutError,
      setQty,
      remove,
      clear,
      checkout,
      money,
      imageSrc,
    }
  },
}
</script>

<style src="../assets/style/shop-view.css"></style>
<style src="../assets/style/components/cart-view.css"></style>
