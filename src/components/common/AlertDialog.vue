<template>
  <div
    v-if="dialog"
    class="ca-dialog"
    @mousedown="onBackdropMouseDown"
  >
    <section
      class="ca-dialog__panel"
      :class="`ca-tone--${dialog.type}`"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="ca-dialog-title"
      aria-describedby="ca-dialog-msg"
    >
      <div class="ca-dialog__burst" aria-hidden="true">
        <AlertIcon :type="dialog.type" />
      </div>

      <h3 id="ca-dialog-title" class="ca-dialog__title">{{ dialog.title }}</h3>
      <p id="ca-dialog-msg" class="ca-dialog__msg">{{ dialog.message }}</p>

      <div class="ca-dialog__actions">
        <button
          v-if="dialog.showCancel"
          ref="cancelBtnRef"
          type="button"
          class="ca-btn"
          @click="closeDialog(false)"
        >
          {{ dialog.cancelText }}
        </button>
        <button
          ref="okBtnRef"
          type="button"
          class="ca-btn ca-btn--ok"
          @click="closeDialog(true)"
        >
          {{ dialog.confirmText }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import AlertIcon from '@/components/common/AlertIcon.vue'
import { useAlert } from '@/hook/useAlert'

export default {
  name: 'AlertDialog',
  components: { AlertIcon },
  setup() {
    const { dialog, closeDialog } = useAlert()
    const okBtnRef = ref(null)
    const cancelBtnRef = ref(null)
    let prevFocused = null

    function unlockScroll() {
      document.documentElement.classList.remove('kv-has-dialog')
    }

    function restoreFocus() {
      if (prevFocused && prevFocused.isConnected && typeof prevFocused.focus === 'function') {
        prevFocused.focus()
      }
      prevFocused = null
    }

    watch(dialog, async (next, prev) => {
      if (next) {
        if (!prev) {
          prevFocused = document.activeElement
          document.documentElement.classList.add('kv-has-dialog')
        }
        await nextTick()
        if (okBtnRef.value) okBtnRef.value.focus()
      } else if (prev) {
        unlockScroll()
        restoreFocus()
      }
    })

    function onBackdropMouseDown(event) {
      if (event.target === event.currentTarget) {
        closeDialog(false)
      }
    }

    function onKeyDown(event) {
      if (!dialog.value) return

      if (event.key === 'Escape') {
        closeDialog(false)
        return
      }

      if (event.key === 'Tab') {
        const focusables = []
        if (dialog.value.showCancel && cancelBtnRef.value) focusables.push(cancelBtnRef.value)
        if (okBtnRef.value) focusables.push(okBtnRef.value)
        if (!focusables.length) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    onMounted(() => window.addEventListener('keydown', onKeyDown))
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeyDown)
      closeDialog(false)
      unlockScroll()
    })

    return {
      dialog,
      okBtnRef,
      cancelBtnRef,
      closeDialog,
      onBackdropMouseDown,
    }
  },
}
</script>
