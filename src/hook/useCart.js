import { ref, computed, watch } from 'vue'

const CART_KEY = 'kv_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

// Shared reactive state so all pages read and update the same cart.
const items = ref(loadCart())

watch(
  items,
  (next) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next))
    } catch {
      /* ignore storage quota errors */
    }
  },
  { deep: true }
)

export function useCart() {
  const count = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))
  const total = computed(() => items.value.reduce((sum, i) => sum + i.price * i.qty, 0))

  function add(product, qty = 1) {
    if (product.stock <= 0) return
    const existing = items.value.find((i) => i.id === product._id)
    if (existing) {
      existing.stock = product.stock
      existing.price = product.price
      existing.image = product.image
      existing.art = product.art
      existing.qty = Math.min(existing.qty + qty, product.stock)
      return
    }

    items.value.push({
      id: product._id,
      name: product.name,
      set_name: product.set_name,
      card_number: product.card_number,
      grade: product.grade,
      price: product.price,
      stock: product.stock,
      image: product.image,
      art: product.art,
      qty: Math.min(qty, product.stock),
    })
  }

  function setQty(id, qty) {
    const existing = items.value.find((i) => i.id === id)
    if (!existing) return
    existing.qty = Math.max(1, Math.min(qty, existing.stock))
  }

  function remove(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, count, total, add, setQty, remove, clear }
}
