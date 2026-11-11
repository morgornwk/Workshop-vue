import { ref, computed, watch, onMounted } from 'vue'
import {
  fetchProducts,
  fetchProductById,
  deleteProduct,
} from '@/services/productService'

const ART_BACKDROPS = [
  'linear-gradient(135deg,#6d28d9,#ec4899 55%,#00D2FF)',
  'linear-gradient(135deg,#334155,#64748b)',
  'linear-gradient(135deg,#0f172a,#1e3a8a 60%,#facc15)',
  'linear-gradient(135deg,#064e3b,#10b981 60%,#00D2FF)',
  'linear-gradient(135deg,#581c87,#be185d 60%,#0f172a)',
  'linear-gradient(135deg,#1e293b,#475569)',
  'linear-gradient(135deg,#1c1917,#78350f 60%,#ef4444)',
]

function pickArtGradient(id) {
  const key = String(id || '')
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % ART_BACKDROPS.length
  }
  return ART_BACKDROPS[hash]
}

function normalizeProduct(raw) {
  if (!raw) return null
  return {
    ...raw,
    set_name: raw.set_name || '',
    card_number: raw.card_number || '',
    grade: raw.grade || '',
    population: raw.population || '',
    description: raw.description || '',
    price: Number(raw.price) || 0,
    stock: Number(raw.stock) || 0,
    art: raw.art || pickArtGradient(raw._id),
  }
}

export const FILTERS = [
  { key: 'all', label: 'All Rarities' },
  { key: 'psa10', label: 'PSA 10 Only' },
  { key: 'vintage', label: 'Vintage Packs' },
  { key: 'alt', label: 'Alt Arts' },
]

/**
 * Manage storefront product list, loading/error states, search keyword, and rarity filter.
 */
export function useProducts() {
  const products = ref([])
  const loading = ref(true)
  const error = ref('')
  const activeFilter = ref('all')
  const keyword = ref('')

  async function loadProducts() {
    loading.value = true
    error.value = ''
    try {
      const list = await fetchProducts()
      products.value = list.map(normalizeProduct).filter(Boolean)
    } catch (err) {
      error.value = err.message || 'Unable to load products from server'
    } finally {
      loading.value = false
    }
  }

  async function removeProduct(id) {
    await deleteProduct(id)
    products.value = products.value.filter((p) => String(p._id) !== String(id))
  }

  onMounted(loadProducts)

  const filtered = computed(() => {
    const q = keyword.value.trim().toLowerCase()
    return products.value.filter((p) => {
      const name = (p.name || '').toLowerCase()
      const setName = (p.set_name || '').toLowerCase()
      const grade = (p.grade || '').toUpperCase()

      const matchText = !q || name.includes(q) || setName.includes(q)
      const matchFilter =
        activeFilter.value === 'all' ||
        (activeFilter.value === 'psa10' && (grade.includes('PSA 10') || (setName.includes('psa') && grade.includes('10')))) ||
        (activeFilter.value === 'vintage' && grade.includes('SEALED')) ||
        (activeFilter.value === 'alt' && name.includes('alt art'))
      return matchText && matchFilter
    })
  })

  return {
    products,
    filtered,
    loading,
    error,
    activeFilter,
    keyword,
    loadProducts,
    removeProduct,
  }
}

/**
 * Fetch and track a single product by ID from the backend.
 * Preserves auth/approval error statuses (401/403) so the UI can prompt sign-in.
 */
export function useProduct(idOrGetter) {
  const product = ref(null)
  const loading = ref(true)
  const error = ref('')
  const errorStatus = ref(0)
  const notFound = computed(() => !loading.value && !error.value && !product.value)

  async function loadProduct(id) {
    if (!id) {
      product.value = null
      loading.value = false
      error.value = ''
      errorStatus.value = 0
      return
    }

    loading.value = true
    error.value = ''
    errorStatus.value = 0
    try {
      const data = await fetchProductById(id)
      product.value = normalizeProduct(data)
    } catch (err) {
      product.value = null
      error.value = err.message || 'Unable to load product details'
      errorStatus.value = err.status || 0
    } finally {
      loading.value = false
    }
  }

  watch(
    () => (typeof idOrGetter === 'function' ? idOrGetter() : idOrGetter),
    (id) => {
      loadProduct(id)
    },
    { immediate: true }
  )

  return { product, loading, error, errorStatus, notFound, loadProduct }
}
