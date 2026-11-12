import { ref, computed, watch } from 'vue'
import { useAlert } from '@/hook/useAlert'

const CART_KEY = 'kv_cart'

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function clampQty(qty, stock) {
  return Math.max(1, Math.min(Number(qty) || 1, stock))
}

function toCartItem(product, qty) {
  return {
    id: product._id,
    name: product.name,
    set_name: product.set_name,
    card_number: product.card_number,
    grade: product.grade,
    price: product.price,
    stock: product.stock,
    image: product.image,
    art: product.art,
    qty: clampQty(qty, product.stock),
  }
}

// Shared reactive cart state synced to localStorage across all views.
const items = ref(loadCart())
const count = computed(() => items.value.length)
const totalQty = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))
const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.qty, 0))

watch(
  items,
  (next) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next))
    } catch {
      // Ignore storage errors when localStorage is full or restricted.
    }
  },
  { deep: true }
)

export function useCart() {
  const { success, warning } = useAlert()

  function add(product, qty = 1) {
    if (!product || product.stock <= 0) return

    const label = product.grade ? `${product.name} · ${product.grade}` : product.name
    const existing = items.value.find((item) => item.id === product._id)
    if (existing) {
      const prevQty = existing.qty
      const nextItem = toCartItem(product, prevQty + qty)
      Object.assign(existing, nextItem)

      if (nextItem.qty === prevQty) {
        warning(`${product.name} มีในตะกร้าครบ ${product.stock} ชิ้นแล้ว`, {
          title: 'ครบจำนวนสต็อกแล้ว',
        })
        return
      }

      success(`${label} (+${nextItem.qty - prevQty} ชิ้น)`, { title: 'เพิ่มลงตะกร้าแล้ว' })
      return
    }

    const newItem = toCartItem(product, qty)
    items.value.push(newItem)
    success(`${label} (${newItem.qty} ชิ้น)`, { title: 'เพิ่มลงตะกร้าแล้ว' })
  }

  function setQty(id, qty) {
    const existing = items.value.find((item) => item.id === id)
    if (!existing) return
    existing.qty = clampQty(qty, existing.stock)
  }

  function remove(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, count, totalQty, total, add, setQty, remove, clear }
}
