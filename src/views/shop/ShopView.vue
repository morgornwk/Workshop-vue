<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="cartCount" />
    <ShopHero />
    <TornEdge fill="#FFE14D" :seed="3" />

    <section id="vault" class="shop-vault">
      <div class="shop-vault__inner">
        <div class="shop-vault__head">
          <div class="shop-vault__intro">
            <div class="shop-vault__title-row">
              <h2 class="shop-vault__title">การ์ดเกรด &amp; ซองแรร์ประจำวัน</h2>
            </div>
            <p class="shop-vault__sub">
              ตรวจสอบความสมบูรณ์ บรรจุในเคสอะคริลิกซีลแน่นหนาป้องกันการงัดแงะ
              พร้อมยืนยันแหล่งที่มาของแท้ทุกชิ้น
            </p>
          </div>

          <div class="shop-vault__controls">
            <div class="shop-vault__filters" role="group" aria-label="กรองสินค้า">
              <button
                v-for="f in FILTERS"
                :key="f.key"
                class="kv-chip"
                :class="{ 'kv-chip--on': activeFilter === f.key }"
                @click="activeFilter = f.key"
              >
                {{ f.label }}<template v-if="f.key === 'all'"> ({{ products.length }})</template>
              </button>
            </div>

            <div class="shop-vault__tools">
              <label class="shop-vault__search">
                <v-icon size="20" color="#6b7280">mdi-magnify</v-icon>
                <input
                  v-model="keyword"
                  type="search"
                  placeholder="ค้นหาการ์ด หรือชื่อชุด..."
                  aria-label="ค้นหาการ์ด"
                />
                <button
                  v-if="keyword"
                  type="button"
                  class="shop-vault__clear"
                  aria-label="ล้างคำค้นหา"
                  @click="keyword = ''"
                >
                  <v-icon size="16">mdi-close</v-icon>
                </button>
              </label>

              <router-link
                v-if="isAdmin"
                to="/add_product"
                class="shop-vault__admin-add"
              >
                <v-icon size="18" color="#ffffff">mdi-plus</v-icon>
                Add Product
              </router-link>
            </div>
          </div>
        </div>

        <p v-if="loading" class="shop-vault__msg">กำลังโหลดรายการการ์ด...</p>
        <AlertBanner
          v-else-if="error"
          type="error"
          title="ไม่สามารถโหลดรายการสินค้าได้"
          :message="error"
          class="shop-vault__banner"
        >
          <template #actions>
            <button type="button" class="ca-btn ca-btn--banner" @click="loadProducts">ลองใหม่</button>
          </template>
        </AlertBanner>
        <AlertBanner
          v-else-if="!filtered.length"
          type="info"
          :title="products.length ? 'ไม่พบสินค้าที่ตรงกับคำค้นหา' : 'ยังไม่มีสินค้าในคลังขณะนี้'"
          :message="products.length ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรองความหายากดูอีกครั้ง' : 'กำลังเตรียมเติมสินค้าชุดใหม่เร็วๆ นี้'"
          class="shop-vault__banner"
        />

        <div v-else class="shop-vault__grid">
          <ProductCard
            v-for="p in filtered"
            :key="p._id"
            :product="p"
            :is-admin="isAdmin"
            :deleting="deletingId === p._id"
            @add="addToCart"
            @view="viewProduct"
            @edit="editProduct"
            @delete="askDeleteProduct"
          />
        </div>
      </div>
    </section>

    <TornEdge fill="#212121" :seed="8" />
    <footer class="shop-foot">
      <span class="shop-foot__logo">Mor <span>gorn</span></span>
      <div class="shop-foot__sprites" aria-hidden="true">
        <img
          v-for="mon in buddySprites"
          :key="mon.id"
          :src="mon.src"
          :title="mon.name"
          alt=""
          class="shop-foot__sprite"
        />
      </div>
      <span class="shop-foot__copy">© 2026 Morgorn. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import ShopHero from '@/components/shop/ShopHero.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import AlertBanner from '@/components/common/AlertBanner.vue'
import router from '@/router'
import { useProducts, FILTERS } from '@/hook/useProducts'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useAlert } from '@/hook/useAlert'
import { FOOTER_BUDDY_SPRITES } from '@/services/pokemonSprites'

export default {
  name: 'ShopView',
  components: { ShopNavbar, ShopHero, TornEdge, ProductCard, AlertBanner },
  setup() {
    const {
      products,
      filtered,
      loading,
      error,
      activeFilter,
      keyword,
      loadProducts,
      removeProduct,
    } = useProducts()
    const { count: cartCount, add: addToCart, remove: removeFromCart } = useCart()
    const { isAdmin } = useAuth()
    const { success, error: errorToast, confirm } = useAlert()

    const deletingId = ref('')

    const viewProduct = (p) => router.push(`/shop/${p._id}`)
    const editProduct = (p) => router.push(`/edit_product/${p._id}`)

    async function askDeleteProduct(product) {
      if (!product || deletingId.value) return
      const ok = await confirm({
        type: 'error',
        title: 'ลบสินค้านี้ใช่ไหม?',
        message: `ต้องการลบ "${product.name}" ออกจากร้านค้าหรือไม่`,
        confirmText: 'ลบสินค้า',
        cancelText: 'ยกเลิก',
      })
      if (!ok) return

      deletingId.value = product._id
      try {
        await removeProduct(product._id)
        removeFromCart(product._id)
        success(`ลบ "${product.name}" ออกจากร้านค้าแล้ว`, { title: 'ลบสินค้าเรียบร้อย' })
      } catch (err) {
        errorToast(err.message || 'ไม่สามารถลบสินค้าได้', { title: 'ลบสินค้าไม่สำเร็จ' })
      } finally {
        deletingId.value = ''
      }
    }

    return {
      products,
      filtered,
      loading,
      error,
      activeFilter,
      keyword,
      loadProducts,
      FILTERS,
      cartCount,
      isAdmin,
      deletingId,
      addToCart,
      viewProduct,
      editProduct,
      askDeleteProduct,
      buddySprites: FOOTER_BUDDY_SPRITES,
    }
  },
}
</script>

<style src="../../assets/style/shop-view.css"></style>
