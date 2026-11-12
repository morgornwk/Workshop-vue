<template>
  <div class="cropper">
    <div
      ref="stageRef"
      class="detail__art cropper__stage"
      :class="{ 'cropper__stage--active': Boolean(imageUrl && cropEnabled), 'cropper__stage--dragging': dragging }"
      :style="{ background: imageUrl ? '#f8fafc' : fallbackBackdrop }"
      @pointerdown="startDrag"
    >
      <img
        v-if="imageUrl"
        ref="imgRef"
        :src="imageUrl"
        :alt="alt"
        class="cropper__img"
        :style="imgStyle"
        draggable="false"
        @load="onImageLoad"
      />

      <div v-else class="add-prod__placeholder">
        <v-icon size="54">mdi-image-plus-outline</v-icon>
        <span>ตัวอย่างรูปการ์ด (สัดส่วน 3:5)</span>
      </div>

      <span v-if="grade" class="detail__badge" :class="`detail__badge--${tone}`">
        {{ grade }}
      </span>
      <span v-if="popText" class="detail__pop">POP {{ popText }}</span>

      <div v-if="imageUrl && cropEnabled" class="cropper__guide" aria-hidden="true">
        <span>ลากเพื่อจัดตำแหน่งรูป</span>
      </div>
    </div>

    <div v-if="imageUrl && cropEnabled" class="cropper__toolbar">
      <div class="cropper__zoom-row">
        <v-icon size="18" color="#6b7280">mdi-magnify-minus-outline</v-icon>
        <input
          v-model.number="zoom"
          type="range"
          :min="minZoom"
          :max="maxZoom"
          step="0.02"
          class="cropper__slider"
          aria-label="ซูมรูปภาพ"
          @input="clampPan"
        />
        <v-icon size="18" color="#6b7280">mdi-magnify-plus-outline</v-icon>
      </div>

      <div class="cropper__presets">
        <button type="button" class="cropper__preset-btn" @click="setFitMode('cover')">
          เต็มกรอบ 3:5
        </button>
        <button type="button" class="cropper__preset-btn" @click="setFitMode('contain')">
          พอดีทั้งรูป
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const OUTPUT_WIDTH = 600
const OUTPUT_HEIGHT = 1000

export default {
  name: 'SlabImageCropper',
  props: {
    imageUrl: { type: String, default: '' },
    cropEnabled: { type: Boolean, default: true},
    fileName: { type: String, default: 'card' },
    alt: { type: String, default: 'Preview' },
    grade: { type: String, default: '' },
    tone: { type: String, default: 'blue' },
    popText: { type: String, default: '' },
    fallbackBackdrop: { type: String, default: 'linear-gradient(135deg,#334155,#64748b)' },
  },
  setup(props) {
    const stageRef = ref(null)
    const imgRef = ref(null)

    const stageW = ref(300)
    const stageH = ref(500)
    const natW = ref(0)
    const natH = ref(0)

    const zoom = ref(1)
    const panX = ref(0)
    const panY = ref(0)
    const dragging = ref(false)

    let dragStartX = 0
    let dragStartY = 0
    let startPanX = 0
    let startPanY = 0
    let observer = null

    const coverScale = computed(() => {
      if (!natW.value || !natH.value) return 1
      return Math.max(stageW.value / natW.value, stageH.value / natH.value)
    })

    const containScale = computed(() => {
      if (!natW.value || !natH.value) return 1
      return Math.min(stageW.value / natW.value, stageH.value / natH.value)
    })

    const minZoom = computed(() => {
      const ratio = containScale.value / (coverScale.value || 1)
      return Number(Math.min(1, ratio).toFixed(2))
    })

    const maxZoom = 3.5

    const imgStyle = computed(() => {
      if (!natW.value || !natH.value) return {}
      const scale = coverScale.value * zoom.value
      const w = natW.value * scale
      const h = natH.value * scale
      return {
        width: `${w}px`,
        height: `${h}px`,
        transform: `translate(${panX.value}px, ${panY.value}px)`,
      }
    })

    function measureStage() {
      const el = stageRef.value
      if (!el) return
      stageW.value = el.clientWidth || 300
      stageH.value = el.clientHeight || 500
    }

    function clampPan() {
      if (!natW.value || !natH.value) return
      const scale = coverScale.value * zoom.value
      const drawW = natW.value * scale
      const drawH = natH.value * scale
      const limitX = Math.abs(drawW - stageW.value) / 2
      const limitY = Math.abs(drawH - stageH.value) / 2
      panX.value = Math.max(-limitX, Math.min(limitX, panX.value))
      panY.value = Math.max(-limitY, Math.min(limitY, panY.value))
    }

    function setFitMode(mode) {
      zoom.value = mode === 'contain' ? minZoom.value : 1
      panX.value = 0
      panY.value = 0
    }

    function onImageLoad() {
      const img = imgRef.value
      if (!img) return
      measureStage()
      natW.value = img.naturalWidth
      natH.value = img.naturalHeight
      setFitMode(props.cropEnabled ? 'cover' : 'contain')
    }

    function startDrag(e) {
      if (!props.cropEnabled || !props.imageUrl || !natW.value) return
      e.preventDefault()
      dragging.value = true
      dragStartX = e.clientX
      dragStartY = e.clientY
      startPanX = panX.value
      startPanY = panY.value
    }

    function onDragMove(e) {
      if (!dragging.value) return
      panX.value = startPanX + (e.clientX - dragStartX)
      panY.value = startPanY + (e.clientY - dragStartY)
      clampPan()
    }

    function stopDrag() {
      dragging.value = false
    }

    // Render the current 3:5 crop viewport onto a 600x1000 canvas and export as a File.
    async function exportCroppedFile() {
      const img = imgRef.value
      if (!props.imageUrl || !img || !natW.value || !natH.value) return null

      measureStage()
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_WIDTH
      canvas.height = OUTPUT_HEIGHT

      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)

      const scale = coverScale.value * zoom.value
      const outRatioX = OUTPUT_WIDTH / stageW.value
      const outRatioY = OUTPUT_HEIGHT / stageH.value
      const drawW = natW.value * scale * outRatioX
      const drawH = natH.value * scale * outRatioY
      const x = OUTPUT_WIDTH / 2 - drawW / 2 + panX.value * outRatioX
      const y = OUTPUT_HEIGHT / 2 - drawH / 2 + panY.value * outRatioY

      ctx.drawImage(img, x, y, drawW, drawH)

      const toFileBlob = (mime) =>
        new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92))

      let blob = await toFileBlob('image/webp')
      if (!blob) blob = await toFileBlob('image/jpeg')
      if (!blob) return null

      const extMap = {
        'image/webp': '.webp',
        'image/jpeg': '.jpg',
        'image/png': '.png',
      }
      const ext = extMap[blob.type] || '.jpg'
      const baseName = (props.fileName || 'card').replace(/\.[^.]+$/, '') || 'card'
      return new File([blob], `${baseName}${ext}`, { type: blob.type || 'image/jpeg' })
    }

    watch(
      () => props.imageUrl,
      (next) => {
        if (!next) {
          natW.value = 0
          natH.value = 0
          zoom.value = 1
          panX.value = 0
          panY.value = 0
        }
      }
    )

    onMounted(() => {
      measureStage()
      window.addEventListener('pointermove', onDragMove)
      window.addEventListener('pointerup', stopDrag)
      window.addEventListener('pointercancel', stopDrag)
      if (typeof ResizeObserver !== 'undefined' && stageRef.value) {
        observer = new ResizeObserver(() => {
          measureStage()
          clampPan()
        })
        observer.observe(stageRef.value)
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('pointermove', onDragMove)
      window.removeEventListener('pointerup', stopDrag)
      window.removeEventListener('pointercancel', stopDrag)
      if (observer) observer.disconnect()
    })

    return {
      stageRef,
      imgRef,
      zoom,
      minZoom,
      maxZoom,
      dragging,
      imgStyle,
      clampPan,
      setFitMode,
      onImageLoad,
      startDrag,
      exportCroppedFile,
    }
  },
}
</script>
