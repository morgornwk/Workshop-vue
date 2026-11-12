<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="cartCount" />

    <section class="shop-vault detail">
      <router-link to="/shop" class="kv-btn detail__back">
        <v-icon small>mdi-arrow-left</v-icon>&nbsp;Back to Home
      </router-link>

      <AlertNotice
        v-if="!isAuthenticated || !isAdmin"
        :type="isAuthenticated ? 'error' : 'warning'"
        :title="isAuthenticated ? 'สำหรับผู้ดูแลระบบเท่านั้น' : 'กรุณาเข้าสู่ระบบก่อน'"
        :message="
          isAuthenticated
            ? 'เฉพาะบัญชีผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มสินค้าใหม่ได้'
            : 'กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบก่อนเพิ่มสินค้า'
        "
      >
        <template #actions>
          <router-link to="/shop" class="ca-btn ca-btn--notice-ghost">
            กลับหน้าร้าน
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            :to="{ path: '/signin', query: { redirect: '/add_product' } }"
            class="ca-btn ca-btn--notice-primary"
          >
            เข้าสู่ระบบ
          </router-link>
        </template>
      </AlertNotice>

      <form v-else class="detail__grid" novalidate @submit.prevent="handleSubmit">
        <div class="detail__media">
          <SlabImageCropper
            ref="cropperRef"
            :image-url="previewUrl"
            :file-name="form.image ? form.image.name : 'card'"
            :alt="form.name || 'Preview'"
            :grade="form.grade"
            :tone="tone"
            :pop-text="popText"
            :fallback-backdrop="previewBackdrop"
          />

          <div class="add-prod__upload">
            <div class="add-prod__upload-info">
              <span class="add-prod__upload-title">
                {{ form.image ? form.image.name : 'อัปโหลดรูปภาพสินค้า (ระบบจะครอปสัดส่วน 3:5 ให้อัตโนมัติ)' }}
              </span>
              <span class="add-prod__upload-hint">รองรับไฟล์ JPG, PNG, WEBP</span>
            </div>

            <div class="add-prod__upload-btns">
              <label class="add-prod__file-label">
                <span>{{ form.image ? 'เปลี่ยนรูป' : 'เลือกรูปภาพ' }}</span>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  class="add-prod__file-native"
                  @change="onFileChange"
                />
              </label>
              <button
                v-if="form.image"
                type="button"
                class="add-prod__file-clear"
                @click="clearFile"
              >
                ลบรูป
              </button>
            </div>
          </div>
        </div>

        <div class="detail__info">
          <div class="detail__set">
            {{ form.set_name || 'NEW PRODUCT' }} {{ form.card_number }}
          </div>
          <h1 class="detail__name">{{ form.name || 'Add New Product' }}</h1>

          <div class="add-prod__field">
            <label for="add-prod-name" class="kv-label">
              Product Name <span class="add-prod__req">*</span>
            </label>
            <input
              id="add-prod-name"
              v-model.trim="form.name"
              type="text"
              class="add-prod__input"
              placeholder="กรอกชื่อการ์ดหรือสินค้า เช่น Charizard ex (Shiny SIR)"
              required
            />
          </div>

          <div class="detail__specs">
            <label for="add-prod-set" class="add-prod__field--tile">
              <span class="kv-label">Set</span>
              <input
                id="add-prod-set"
                v-model.trim="form.set_name"
                type="text"
                class="add-prod__input"
                placeholder="กรอกชื่อชุดการ์ด เช่น Paldean Fates"
              />
            </label>

            <label for="add-prod-number" class="add-prod__field--tile">
              <span class="kv-label">Card No.</span>
              <input
                id="add-prod-number"
                v-model.trim="form.card_number"
                type="text"
                class="add-prod__input"
                placeholder="กรอกเลขที่การ์ด เช่น #234"
              />
            </label>

            <label for="add-prod-grade" class="add-prod__field--tile">
              <span class="kv-label">Grade</span>
              <input
                id="add-prod-grade"
                v-model.trim="form.grade"
                type="text"
                list="add-grade-presets"
                class="add-prod__input"
                placeholder="กรอกเกรดการ์ด เช่น PSA 10 GEM MT"
              />
              <datalist id="add-grade-presets">
                <option value="PSA 10 GEM MT" />
                <option value="BGS 9.5 GEM" />
                <option value="SEALED VINTAGE" />
              </datalist>
            </label>

            <label for="add-prod-pop" class="add-prod__field--tile">
              <span class="kv-label">Population</span>
              <input
                id="add-prod-pop"
                v-model.trim="form.population"
                type="text"
                class="add-prod__input"
                placeholder="กรอกจำนวนประชากรการ์ด เช่น 512"
              />
            </label>
          </div>

          <div class="add-prod__field">
            <label for="add-prod-desc" class="kv-label">Description</label>
            <textarea
              id="add-prod-desc"
              v-model.trim="form.description"
              class="add-prod__textarea"
              placeholder="กรอกรายละเอียดสินค้า สภาพการ์ด หรือข้อมูลเพิ่มเติมสำหรับนักสะสม..."
            ></textarea>
          </div>

          <div class="detail__priceRow add-prod__price-row">
            <div class="add-prod__field add-prod__price-col">
              <label for="add-prod-price" class="kv-label">
                Price (USD) <span class="add-prod__req">*</span>
              </label>
              <input
                id="add-prod-price"
                v-model="form.price"
                type="number"
                min="0"
                step="1"
                class="add-prod__input"
                placeholder="กรอกราคาขาย (USD) เช่น 280"
                required
              />
            </div>

            <div class="add-prod__field add-prod__stock-col">
              <label for="add-prod-stock" class="kv-label">Stock</label>
              <input
                id="add-prod-stock"
                v-model="form.stock"
                type="number"
                min="0"
                step="1"
                class="add-prod__input"
                placeholder="กรอกจำนวนสินค้า เช่น 1"
              />
            </div>
          </div>

          <AlertBanner
            v-if="errorMsg"
            type="error"
            title="ไม่สามารถเพิ่มสินค้าได้"
            :message="errorMsg"
          />

          <div class="detail__buy">
            <router-link to="/shop" class="kv-btn add-prod__cancel">
              Cancel
            </router-link>
            <button type="submit" class="kv-btn detail__add" :disabled="submitting">
              {{ submitting ? 'CREATING...' : 'CREATE PRODUCT' }}
            </button>
          </div>
        </div>
      </form>
    </section>

    <TornEdge fill="#212121" :seed="25" />
    <footer class="shop-foot">
      <span class="shop-foot__logo">Mor <span>gorn</span></span>
      <span>© 2026 Morgorn. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import SlabImageCropper from '@/components/shop/SlabImageCropper.vue'
import AlertBanner from '@/components/common/AlertBanner.vue'
import AlertNotice from '@/components/common/AlertNotice.vue'
import router from '@/router'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useAlert } from '@/hook/useAlert'
import { createProduct } from '@/services/productService'
import { formatPopulation, gradeBadgeTone } from '@/utils/format'
import {
  MAX_UPLOAD_BYTES,
  PREVIEW_BACKDROP,
  validateImageFile,
  parseProductPayload,
} from '@/utils/productForm'

export default {
  name: 'AddProductView',
  components: { ShopNavbar, TornEdge, SlabImageCropper, AlertBanner, AlertNotice },
  setup() {
    const { count: cartCount } = useCart()
    const { isAuthenticated, isAdmin } = useAuth()
    const { success } = useAlert()

    const cropperRef = ref(null)
    const fileInputRef = ref(null)
    const previewUrl = ref('')
    const submitting = ref(false)
    const errorMsg = ref('')

    const form = reactive({
      name: '',
      set_name: '',
      card_number: '',
      grade: '',
      population: '',
      description: '',
      price: '',
      stock: '1',
      image: null,
    })

    const tone = computed(() => gradeBadgeTone(form.grade))
    const popText = computed(() => formatPopulation(form.population))

    function revokePreview() {
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = ''
      }
    }

    function clearFile() {
      revokePreview()
      form.image = null
      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }
    }

    function onFileChange(event) {
      errorMsg.value = ''
      const file = event.target.files && event.target.files[0]
      if (!file) {
        clearFile()
        return
      }

      const fileError = validateImageFile(file)
      if (fileError) {
        errorMsg.value = fileError
        clearFile()
        return
      }

      revokePreview()
      form.image = file
      previewUrl.value = URL.createObjectURL(file)
    }

    async function handleSubmit() {
      if (submitting.value) return
      errorMsg.value = ''

      const { error, payload } = parseProductPayload(form)
      if (error) {
        errorMsg.value = error
        return
      }

      submitting.value = true
      try {
        let uploadFile = payload.image
        if (uploadFile && cropperRef.value) {
          const cropped = await cropperRef.value.exportCroppedFile()
          if (cropped) uploadFile = cropped
        }

        if (uploadFile && uploadFile.size > MAX_UPLOAD_BYTES) {
          errorMsg.value = 'ไฟล์รูปภาพหลังครอปมีขนาดเกิน 5 MB'
          return
        }

        await createProduct({ ...payload, image: uploadFile })
        success(`เพิ่ม "${payload.name}" เข้าสู่หน้าร้านเรียบร้อยแล้ว`, {
          title: 'เพิ่มสินค้าสำเร็จ!',
        })
        router.push('/shop').catch(() => {})
      } catch (err) {
        errorMsg.value = err.message || 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่'
      } finally {
        submitting.value = false
      }
    }

    onBeforeUnmount(revokePreview)

    return {
      cartCount,
      isAuthenticated,
      isAdmin,
      cropperRef,
      fileInputRef,
      previewUrl,
      previewBackdrop: PREVIEW_BACKDROP,
      submitting,
      errorMsg,
      form,
      tone,
      popText,
      onFileChange,
      clearFile,
      handleSubmit,
    }
  },
}
</script>

<style src="../../assets/style/shop-view.css"></style>
<style src="../../assets/style/shop/product-detail.css"></style>
<style src="../../assets/style/shop/add-product.css"></style>
