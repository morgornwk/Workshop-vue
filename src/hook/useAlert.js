import { ref } from 'vue'
import { ALERT_META, normalizeAlertType } from '@/utils/alertMeta'

const MAX_TOASTS = 4
const LEAVE_MS = 260
const DEFAULT_DURATION = 4500

const toasts = ref([])
const dialog = ref(null)
let nextId = 1

function dismissToast(id) {
  const target = toasts.value.find((item) => item.id === id)
  if (!target || target.leaving) return

  target.leaving = true
  setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }, LEAVE_MS)
}

function showToast(type, message = '', options = {}) {
  const safeType = normalizeAlertType(type)
  const item = {
    id: nextId++,
    type: safeType,
    tag: ALERT_META[safeType].tag,
    title: options.title || ALERT_META[safeType].title,
    message,
    duration: options.duration === undefined ? DEFAULT_DURATION : options.duration,
    leaving: false,
  }

  const next = [...toasts.value, item]
  if (next.length > MAX_TOASTS) next.shift()
  toasts.value = next
}

function closeDialog(result = false) {
  const current = dialog.value
  if (!current) return
  dialog.value = null
  current.resolve(Boolean(result))
}

function openDialog(options, showCancel) {
  if (dialog.value) closeDialog(false)

  const type = normalizeAlertType(options.type)
  return new Promise((resolve) => {
    dialog.value = {
      type,
      title: options.title || ALERT_META[type].title,
      message: options.message || '',
      confirmText: options.confirmText || 'ตกลง',
      cancelText: options.cancelText || 'ยกเลิก',
      showCancel,
      resolve,
    }
  })
}

export function useAlert() {
  return {
    toasts,
    dialog,
    success: (message, options) => showToast('success', message, options),
    warning: (message, options) => showToast('warning', message, options),
    error: (message, options) => showToast('error', message, options),
    info: (message, options) => showToast('info', message, options),
    dismissToast,
    confirm: (options = {}) => openDialog(options, true),
    popup: (options = {}) => openDialog(options, false),
    closeDialog,
  }
}
