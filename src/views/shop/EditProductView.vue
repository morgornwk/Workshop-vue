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
            ? 'เฉพาะบัญชีผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขสินค้าได้'
            : 'กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบก่อนแก้ไขสินค้า'
        "
      >
        <template #actions>
          <router-link to="/shop" class="ca-btn ca-btn--notice-ghost">
            กลับหน้าร้าน
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            :to="{ path: '/signin', query: { redirect: $route.fullPath } }"
            class="ca-btn ca-btn--notice-primary"
          >
            เข้าสู่ระบบ
          </router-link>
        </template>
      </AlertNotice>

      <p v-else-if="loading" class="shop-vault__msg">กำลังโหลดข้อมูลสินค้า...</p>

      <AlertNotice
        v-else-if="loadError"
        type="error"
        title="ไม่สามารถโหลดข้อมูลสินค้าได้"
        :message="loadError"
      >
        <template #actions>
          <router-link to="/shop" class="ca-btn ca-btn--notice-ghost">
            กลับหน้าร้าน
          </router-link>
          <button
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
        message="ไม่พบข้อมูลสินค้านี้ หรือสินค้าถูกลบไปแล้ว"
        class="detail__status-banner"
      >
        <template #actions>
          <router-link to="/shop" class="ca-btn ca-btn--banner">กลับหน้าร้าน</router-link>
        </template>
      </AlertBanner>

      <form v-else class="detail__grid" novalidate @submit.prevent="handleSubmit">
        <div class="detail__media">
          <SlabImageCropper
            ref="cropperRef"
            :image-url="activePreviewUrl"
            :crop-enabled="Boolean(form.image)"
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
                {{
                  form.image
                    ? form.image.name
                    : existingImageUrl
                      ? 'รูปสินค้าปัจจุบัน (กดเปลี่ยนรูปเพื่อครอปอัปโหลดใหม่)'
                      : 'อัปโหลดรูปภาพสินค้า (ระบบจะครอปสัดส่วน 3:5 ให้อัตโนมัติ)'
                }}
              </span>
              <span class="add-prod__upload-hint">รองรับไฟล์ JPG, PNG, WEBP</span>
            </div>

            <div class="add-prod__upload-btns">
              <label class="add-prod__file-label">
                <span>{{ form.image || existingImageUrl ? 'เปลี่ยนรูป' : 'เลือกรูปภาพ' }}</span>
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
                {{ existingImageUrl ? 'ใช้รูปเดิม' : 'ลบรูป' }}
              </button>
            </div>
          </div>
        </div>

        <div class="detail__info">
          <div class="detail__set">
            {{ form.set_name || 'EDIT PRODUCT' }} {{ form.card_number }}
          </div>
          <h1 class="detail__name">{{ form.name || 'Edit Product' }}</h1>

          <div class="add-prod__field">
            <label for="edit-prod-name" class="kv-label">
              Product Name <span class="add-prod__req">*</span>
            </label>
            <input
              id="edit-prod-name"
              v-model.trim="form.name"
              type="text"
              class="add-prod__input"
              placeholder="กรอกชื่อการ์ดหรือสินค้า เช่น Charizard ex (Shiny SIR)"
              required
            />
          </div>

          <div class="detail__specs">
            <label for="edit-prod-set" class="add-prod__field--tile">
              <span class="kv-label">Set</span>
              <input
                id="edit-prod-set"
                v-model.trim="form.set_name"
                type="text"
                class="add-prod__input"
                placeholder="กรอกชื่อชุดการ์ด เช่น Paldean Fates"
              />
            </label>

            <label for="edit-prod-number" class="add-prod__field--tile">
              <span class="kv-label">Card No.</span>
              <input
                id="edit-prod-number"
                v-model.trim="form.card_number"
                type="text"
                class="add-prod__input"
                placeholder="กรอกเลขที่การ์ด เช่น #234"
              />
            </label>

            <label for="edit-prod-grade" class="add-prod__field--tile">
              <span class="kv-label">Grade</span>
              <input
                id="edit-prod-grade"
                v-model.trim="form.grade"
                type="text"
                list="edit-grade-presets"
                class="add-prod__input"
                placeholder="กรอกเกรดการ์ด เช่น PSA 10 GEM MT"
              />
              <datalist id="edit-grade-presets">
                <option value="PSA 10 GEM MT" />
                <option value="BGS 9.5 GEM" />
                <option value="SEALED VINTAGE" />
              </datalist>
            </label>

            <label for="edit-prod-pop" class="add-prod__field--tile">
              <span class="kv-label">Population</span>
              <input
                id="edit-prod-pop"
                v-model.trim="form.population"
                type="text"
                class="add-prod__input"
                placeholder="กรอกจำนวนประชากรการ์ด เช่น 512"
              />
            </label>
          </div>

          <div class="add-prod__field">
            <label for="edit-prod-desc" class="kv-label">Description</label>
            <textarea
              id="edit-prod-desc"
              v-model.trim="form.description"
              class="add-prod__textarea"
              placeholder="กรอกรายละเอียดสินค้า สภาพการ์ด หรือข้อมูลเพิ่มเติมสำหรับนักสะสม..."
            ></textarea>
          </div>

          <div class="detail__priceRow add-prod__price-row">
            <div class="add-prod__field add-prod__price-col">
              <label for="edit-prod-price" class="kv-label">
                Vault price (USD) <span class="add-prod__req">*</span>
              </label>
              <input
                id="edit-prod-price"
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
              <label for="edit-prod-stock" class="kv-label">Stock</label>
              <input
                id="edit-prod-stock"
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
            title="ไม่สามารถบันทึกการแก้ไขได้"
            :message="errorMsg"
          />

          <div class="detail__buy">
            <router-link to="/shop" class="kv-btn add-prod__cancel">
              Cancel
            </router-link>
            <button type="submit" class="kv-btn detail__add" :disabled="submitting">
              {{ submitting ? 'SAVING...' : 'SAVE CHANGES' }}
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
import { ref, reactive, computed, watch, onBeforeUnmount } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import SlabImageCropper from '@/components/shop/SlabImageCropper.vue'
import AlertBanner from '@/components/common/AlertBanner.vue'
import AlertNotice from '@/components/common/AlertNotice.vue'
import router from '@/router'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useAlert } from '@/hook/useAlert'
import { resolveImageUrl } from '@/services/api'
import { fetchProductById, updateProduct } from '@/services/productService'
import { formatPopulation, gradeBadgeTone } from '@/utils/format'
import {
  MAX_UPLOAD_BYTES,
  PREVIEW_BACKDROP,
  validateImageFile,
  parseProductPayload,
} from '@/utils/productForm'

export default {
  name: 'EditProductView',
  components: { ShopNavbar, TornEdge, SlabImageCropper, AlertBanner, AlertNotice },
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const { count: cartCount } = useCart()
    const { isAuthenticated, isAdmin } = useAuth()
    const { success } = useAlert()

    const cropperRef = ref(null)
    const fileInputRef = ref(null)
    const previewUrl = ref('')
    const existingImageUrl = ref('')
    const loading = ref(false)
    const loadError = ref('')
    const notFound = ref(false)
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
      stock: '0',
      image: null,
    })

    const activePreviewUrl = computed(() => previewUrl.value || existingImageUrl.value)
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

    function applyProduct(data) {
      form.name = data.name || ''
      form.set_name = data.set_name || ''
      form.card_number = data.card_number || ''
      form.grade = data.grade || ''
      form.population = data.population || ''
      form.description = data.description || ''
      form.price = data.price !== undefined && data.price !== null ? String(data.price) : ''
      form.stock = data.stock !== undefined && data.stock !== null ? String(data.stock) : '0'
      existingImageUrl.value = resolveImageUrl(data.image)
      clearFile()
    }

    async function loadProduct(productId) {
      if (!productId || !isAuthenticated.value || !isAdmin.value) return
      loading.value = true
      loadError.value = ''
      notFound.value = false
      errorMsg.value = ''

      try {
        const data = await fetchProductById(productId)
        if (!data) {
          notFound.value = true
          return
        }
        applyProduct(data)
      } catch (err) {
        if (err.status === 404) {
          notFound.value = true
        } else {
          loadError.value = err.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้'
        }
      } finally {
        loading.value = false
      }
    }

    watch(
      () => [props.id, isAuthenticated.value, isAdmin.value],
      ([nextId, authed, admin]) => {
        if (nextId && authed && admin) {
          loadProduct(nextId)
        }
      },
      { immediate: true }
    )

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
        let uploadFile
        if (payload.image instanceof File) {
          uploadFile = payload.image
          if (cropperRef.value) {
            const cropped = await cropperRef.value.exportCroppedFile()
            if (cropped) uploadFile = cropped
          }
          if (uploadFile && uploadFile.size > MAX_UPLOAD_BYTES) {
            errorMsg.value = 'ไฟล์รูปภาพหลังครอปมีขนาดเกิน 5 MB'
            return
          }
        }

        await updateProduct(props.id, { ...payload, image: uploadFile })
        success(`อัปเดตข้อมูล "${payload.name}" เรียบร้อยแล้ว`, {
          title: 'แก้ไขสินค้าสำเร็จ!',
        })
        router.push('/shop').catch(() => {})
      } catch (err) {
        errorMsg.value = err.message || 'ไม่สามารถแก้ไขสินค้าได้ กรุณาลองใหม่'
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
      existingImageUrl,
      activePreviewUrl,
      previewBackdrop: PREVIEW_BACKDROP,
      loading,
      loadError,
      notFound,
      submitting,
      errorMsg,
      form,
      tone,
      popText,
      loadProduct,
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
