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
        <div v-else-if="error" class="shop-vault__msg shop-vault__msg--error">
          <span>{{ error }}</span>
          <button type="button" class="shop-vault__retry" @click="loadProducts">ลองใหม่</button>
        </div>
        <p v-else-if="!filtered.length" class="shop-vault__msg">
          {{ products.length ? 'ไม่พบสินค้าที่ตรงกับคำค้นหา' : 'ยังไม่มีสินค้าในคลังขณะนี้' }}
        </p>

        <div v-else class="shop-vault__grid">
          <ProductCard
            v-for="p in filtered"
            :key="p._id"
            :product="p"
            :is-admin="isAdmin"
            :deleting="deleting && Boolean(deleteTarget) && deleteTarget._id === p._id"
            @add="addToCart"
            @view="viewProduct"
            @delete="askDeleteProduct"
          />
        </div>
      </div>
    </section>

    <div
      v-if="deleteTarget"
      class="admin-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
      @click.self="closeDeleteModal"
    >
      <div class="admin-modal admin-modal--sm">
        <header class="admin-modal__head">
          <h2 id="delete-product-title" class="admin-modal__title">Delete Product</h2>
          <button
            type="button"
            class="admin-modal__close"
            :disabled="deleting"
            aria-label="Close modal"
            @click="closeDeleteModal"
          >
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </header>
        <div class="admin-modal__body">
          <div v-if="deleteError" class="admin-modal__alert" role="alert">
            {{ deleteError }}
          </div>
          <p class="admin-modal__confirm-text">
            Are you sure you want to remove <strong>{{ deleteTarget.name }}</strong> from the shop?
          </p>
        </div>
        <footer class="admin-modal__foot">
          <button
            type="button"
            class="admin-modal__btn admin-modal__btn--cancel"
            :disabled="deleting"
            @click="closeDeleteModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="admin-modal__btn admin-modal__btn--danger"
            :disabled="deleting"
            @click="confirmDeleteProduct"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </footer>
      </div>
    </div>

    <TornEdge fill="#212121" :seed="8" />
    <footer class="shop-foot">
      <span class="shop-foot__logo">Mor <span>gorn</span></span>
      <div class="shop-foot__sprites" aria-hidden="true">
        <img
          v-for="mon in buddySprites"
          :key="mon.id"
          :src="mon.src"
          alt=""
          class="shop-foot__sprite"
        />
      </div>
      <span>© 2026 Morgorn. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import ShopHero from '@/components/shop/ShopHero.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import router from '@/router'
import { useProducts, FILTERS } from '@/hook/useProducts'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useToast } from '@/hook/useToast'
import { FOOTER_BUDDY_SPRITES } from '@/services/pokemonSprites'

export default {
  name: 'ShopView',
  components: { ShopNavbar, ShopHero, TornEdge, ProductCard },
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
    const { toastSuccess } = useToast()

    const deleteTarget = ref(null)
    const deleting = ref(false)
    const deleteError = ref('')

    const viewProduct = (p) => router.push(`/shop/${p._id}`)

    function askDeleteProduct(product) {
      deleteError.value = ''
      deleteTarget.value = product
    }

    function closeDeleteModal() {
      if (deleting.value) return
      deleteTarget.value = null
      deleteError.value = ''
    }

    async function confirmDeleteProduct() {
      if (!deleteTarget.value || deleting.value) return
      deleting.value = true
      deleteError.value = ''
      const targetId = deleteTarget.value._id
      const targetName = deleteTarget.value.name
      try {
        await removeProduct(targetId)
        removeFromCart(targetId)
        deleteTarget.value = null
        toastSuccess('ลบสินค้าเรียบร้อย', `ลบ "${targetName}" ออกจากร้านค้าแล้ว`)
      } catch (err) {
        deleteError.value = err.message || 'Unable to delete product'
      } finally {
        deleting.value = false
      }
    }

    function onKeyDown(e) {
      if (e.key === 'Escape' && deleteTarget.value) {
        closeDeleteModal()
      }
    }

    onMounted(() => window.addEventListener('keydown', onKeyDown))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))

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
      addToCart,
      viewProduct,
      deleteTarget,
      deleting,
      deleteError,
      askDeleteProduct,
      closeDeleteModal,
      confirmDeleteProduct,
      buddySprites: FOOTER_BUDDY_SPRITES,
    }
  },
}
</script>

<style src="../assets/style/shop-view.css"></style>
<style src="../assets/style/components/product-modal.css"></style>
