import { ref } from 'vue'

const toasts = ref([])
const timers = new Map()
let nextId = 1

function dismissToast(id) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function showToast({ type = 'success', title = '', message = '', duration = 4000 } = {}) {
  const id = nextId++
  toasts.value = [...toasts.value, { id, type, title, message, duration }]

  if (duration > 0) {
    const timer = setTimeout(() => dismissToast(id), duration)
    timers.set(id, timer)
  }

  return id
}

function toastSuccess(title, message = '', duration = 4000) {
  return showToast({ type: 'success', title, message, duration })
}

export function useToast() {
  return {
    toasts,
    showToast,
    toastSuccess,
    dismissToast,
  }
}
