<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="count" />

    <section class="shop-vault cart-page">
      <div class="cart-page__inner">
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
            Successfully placed {{ confirmedCount }} order(s). Your items are being prepared for dispatch.
          </p>
          <router-link to="/shop" class="kv-btn cart-page__cta">Continue Shopping</router-link>
        </div>

        <div v-else-if="!items.length" class="cart-page__card cart-page__empty">
          <v-icon size="44" color="#9ca3af">mdi-cart-outline</v-icon>
          <h2>ตระกร้าสินค้าว่าง</h2>
          <p>เลือกการ์ดที่ผ่านการประเมินสภาพ (graded slab) หรือซองการ์ดวินเทจจากคลังสะสมเพื่อเพิ่มลงในตะกร้าสินค้าของคุณ</p>
        </div>

        <template v-else>
          <div v-if="!isAuthenticated" class="cart-page__banners">
            <AlertBanner
              type="warning"
              title="กรุณาเข้าสู่ระบบก่อนชำระเงิน"
              message="เข้าสู่ระบบเพื่อดำเนินการยืนยันคำสั่งซื้อสินค้าในตะกร้าของคุณ"
            >
              <template #actions>
                <router-link
                  :to="{ path: '/signin', query: { redirect: '/cart' } }"
                  class="ca-btn ca-btn--banner"
                >
                  เข้าสู่ระบบ
                </router-link>
              </template>
            </AlertBanner>
          </div>

          <div class="cart-page__grid">
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
                </div>

                <div class="cart-page__controls">
                  <div class="cart-page__sub">{{ money(i.price * i.qty) }}</div>

                  <div class="cart-page__qty" role="group" :aria-label="`${i.name} quantity`">
                    <button :disabled="submitting || i.qty <= 1" aria-label="Decrease quantity" @click="setQty(i.id, i.qty - 1)">
                      −
                    </button>
                    <span>{{ i.qty }}</span>
                    <button :disabled="submitting || i.qty >= i.stock" aria-label="Increase quantity" @click="setQty(i.id, i.qty + 1)">
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    class="cart-page__remove"
                    :disabled="submitting"
                    :title="`Remove ${i.name}`"
                    :aria-label="`Remove ${i.name}`"
                    @click="handleRemove(i)"
                  >
                    <v-icon size="18">mdi-trash-can-outline</v-icon>
                  </button>
                </div>
              </li>
            </ul>

            <aside class="cart-page__card cart-page__summary">
              <h2 class="cart-page__sum-title">Order Summary</h2>
              <div class="cart-page__row">
                <span>Products</span>
                <span>{{ count }} item</span>
              </div>
              <div class="cart-page__row">
                <span>Total Quantity</span>
                <span>{{ totalQty }} pcs</span>
              </div>
              <div class="cart-page__divider"></div>
              <div class="cart-page__row cart-page__row--total">
                <span>Total</span>
                <strong>{{ money(total) }}</strong>
              </div>

              <AlertBanner
                v-if="checkoutError"
                type="error"
                title="สั่งซื้อไม่สำเร็จ"
                :message="checkoutError"
              />

              <button
                class="kv-btn cart-page__cta cart-page__cta--full"
                :disabled="submitting"
                @click="checkout"
              >
                {{ submitting ? 'Processing...' : isAuthenticated ? 'Checkout' : 'Sign In to Checkout' }}
              </button>
              <button type="button" class="cart-page__clear" :disabled="submitting" @click="handleClear">
                <v-icon size="17">mdi-cart-remove</v-icon>
                <span>Clear Cart</span>
              </button>
            </aside>
          </div>
        </template>
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
import AlertBanner from '@/components/common/AlertBanner.vue'
import router from '@/router'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useAlert } from '@/hook/useAlert'
import { resolveImageUrl } from '@/services/api'
import { createProductOrder } from '@/services/orderService'
import { formatMoney } from '@/utils/format'

export default {
  name: 'CartView',
  components: { ShopNavbar, TornEdge, AlertBanner },
  setup() {
    const { items, count, totalQty, total, setQty, remove, clear } = useCart()
    const { isAuthenticated } = useAuth()
    const { warning, info, confirm, popup } = useAlert()

    const orderDone = ref(false)
    const confirmedCount = ref(0)
    const submitting = ref(false)
    const checkoutError = ref('')

    const money = formatMoney
    const imageSrc = (i) => resolveImageUrl(i.image)

    async function handleRemove(item) {
      if (submitting.value) return
      const gradeLabel = item.grade ? ` (${item.grade})` : ''
      const ok = await confirm({
        type: 'error',
        title: 'เอาสินค้าออกจากตะกร้า?',
        message: `${item.name}${gradeLabel} จะถูกนำออกจากตะกร้า สินค้านี้อาจถูกผู้ซื้อท่านอื่นสั่งซื้อก่อนได้`,
        confirmText: 'เอาออก',
        cancelText: 'เก็บไว้',
      })
      if (!ok) return

      remove(item.id)
      info(item.name, { title: 'เอาออกจากตะกร้าแล้ว' })
    }

    async function handleClear() {
      if (!items.value.length || submitting.value) return
      const ok = await confirm({
        type: 'warning',
        title: 'ล้างตะกร้าสินค้าทั้งหมด?',
        message: `ต้องการนำสินค้าทั้ง ${count.value} รายการ (${totalQty.value} ชิ้น) ออกจากตะกร้าใช่ไหม`,
        confirmText: 'ล้างตะกร้า',
        cancelText: 'เก็บไว้',
      })
      if (!ok) return

      clear()
      info('นำสินค้าทั้งหมดออกจากตะกร้าแล้ว', { title: 'ล้างตะกร้าแล้ว' })
    }

    async function checkout() {
      if (!items.value.length || submitting.value) return
      checkoutError.value = ''

      if (!isAuthenticated.value) {
        warning('เข้าสู่ระบบเพื่อดำเนินการสั่งซื้อสินค้า', { title: 'กรุณาเข้าสู่ระบบก่อน' })
        router.push({ path: '/signin', query: { redirect: '/cart' } }).catch(() => {})
        return
      }

      const ok = await confirm({
        type: 'info',
        title: `ยืนยันสั่งซื้อ ${count.value} รายการ (${totalQty.value} ชิ้น)?`,
        message: `ยอดรวม ${money(total.value)}`,
        confirmText: 'ยืนยันและชำระเงิน',
        cancelText: 'กลับไปแก้ไข',
      })
      if (!ok) return

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
        popup({
          type: 'success',
          title: 'สั่งซื้อสำเร็จ!',
          message: `ยืนยันคำสั่งซื้อ ${placed} รายการเรียบร้อยแล้ว เรากำลังเตรียมจัดส่งสินค้าของคุณ`,
          confirmText: 'ตกลง',
        })
      } catch (err) {
        const prefix = err.itemName ? `${err.itemName}: ` : ''
        checkoutError.value = `${prefix}${err.message || 'ไม่สามารถดำเนินการสั่งซื้อได้'}`
      } finally {
        submitting.value = false
      }
    }

    return {
      items,
      count,
      totalQty,
      total,
      isAuthenticated,
      orderDone,
      confirmedCount,
      submitting,
      checkoutError,
      setQty,
      handleRemove,
      handleClear,
      checkout,
      money,
      imageSrc,
    }
  },
}
</script>

<style src="../../assets/style/shop-view.css"></style>
<style src="../../assets/style/shop/cart-view.css"></style>
