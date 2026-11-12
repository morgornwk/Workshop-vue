<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="cartCount" />

    <section class="shop-vault detail">
      <router-link to="/shop" class="kv-btn detail__back">
        <v-icon small>mdi-arrow-left</v-icon>&nbsp;Back to Home
      </router-link>

      <p v-if="loading" class="shop-vault__msg">กำลังโหลดรายละเอียดสินค้า...</p>

      <AlertNotice
        v-else-if="error"
        :type="noticeType"
        :title="noticeTitle"
        :message="noticeMessage"
      >
        <template #actions>
          <router-link to="/shop" class="ca-btn ca-btn--notice-ghost">
            กลับหน้าร้าน
          </router-link>
          <router-link
            v-if="errorStatus === 401"
            :to="{ path: '/signin', query: { redirect: $route.fullPath } }"
            class="ca-btn ca-btn--notice-primary"
          >
            เข้าสู่ระบบ
          </router-link>
          <button
            v-else-if="errorStatus !== 403"
            type="button"
            class="ca-btn ca-btn--notice-primary"
            @click="loadProduct(id)"
          >
            ลองอีกครั้ง
          </button>
        </template>
      </AlertNotice>

      <AlertBanner
        v-else-if="notFound"
        type="warning"
        title="ไม่พบสินค้านี้"
        message="ไม่พบข้อมูลสินค้านี้ หรือสินค้าถูกลบออกจากร้านค้าแล้ว"
        class="detail__status-banner"
      >
        <template #actions>
          <router-link to="/shop" class="ca-btn ca-btn--banner">กลับหน้าร้าน</router-link>
        </template>
      </AlertBanner>

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
import AlertBanner from '@/components/common/AlertBanner.vue'
import AlertNotice from '@/components/common/AlertNotice.vue'
import { useProduct } from '@/hook/useProducts'
import { useCart } from '@/hook/useCart'
import { useAlert } from '@/hook/useAlert'
import { resolveImageUrl } from '@/services/api'
import { formatMoney, formatPopulation, gradeBadgeTone } from '@/utils/format'

export default {
  name: 'ProductDetailView',
  components: { ShopNavbar, TornEdge, AlertBanner, AlertNotice },
  props: { id: { type: String, required: true } },
  setup(props) {
    const { product, loading, error, errorStatus, notFound, loadProduct } = useProduct(() => props.id)
    const { count: cartCount, add } = useCart()
    const { warning } = useAlert()

    const qty = ref(1)

    watch(
      errorStatus,
      (status) => {
        if (status === 401) {
          warning('เข้าสู่ระบบเพื่อดูรายละเอียดและสั่งซื้อสินค้า', { title: 'กรุณาเข้าสู่ระบบก่อน' })
        }
      },
      { immediate: true }
    )

    watch(
      () => props.id,
      () => {
        qty.value = 1
      }
    )

    const noticeType = computed(() =>
      errorStatus.value === 401 || errorStatus.value === 403 ? 'warning' : 'error'
    )
    const noticeTitle = computed(() => {
      if (errorStatus.value === 401) return 'กรุณาเข้าสู่ระบบก่อน'
      if (errorStatus.value === 403) return 'บัญชีอยู่ระหว่างรออนุมัติ'
      return 'ไม่สามารถโหลดข้อมูลสินค้าได้'
    })
    const noticeMessage = computed(() => {
      if (errorStatus.value === 401) return 'กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดและสั่งซื้อสินค้านี้'
      if (errorStatus.value === 403) return 'กรุณารอผู้ดูแลระบบอนุมัติบัญชีก่อนเข้าดูรายละเอียดสินค้า'
      return error.value
    })

    const soldOut = computed(() => !product.value || product.value.stock <= 0)
    const tone = computed(() => gradeBadgeTone(product.value && product.value.grade))
    const popText = computed(() => formatPopulation(product.value && product.value.population))
    const imageSrc = computed(() => resolveImageUrl(product.value && product.value.image))
    const priceText = computed(() => (product.value ? formatMoney(product.value.price) : ''))

    function addToCart() {
      if (product.value) add(product.value, qty.value)
    }

    return {
      product,
      loading,
      error,
      errorStatus,
      notFound,
      loadProduct,
      noticeType,
      noticeTitle,
      noticeMessage,
      qty,
      cartCount,
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

<style src="../../assets/style/shop-view.css"></style>
<style src="../../assets/style/shop/product-detail.css"></style>
