import { request } from './api'

function buildProductFormData(payload) {
  const formData = new FormData()
  formData.append('name', String(payload.name || '').trim())
  formData.append('price', String(payload.price))

  if (payload.stock !== undefined && payload.stock !== '') {
    formData.append('stock', String(payload.stock))
  }

  const optionalTextFields = ['set_name', 'card_number', 'grade', 'population', 'description']
  for (const field of optionalTextFields) {
    if (payload[field] !== undefined && payload[field] !== null) {
      formData.append(field, String(payload[field]).trim())
    }
  }

  if (payload.image instanceof File) {
    formData.append('image', payload.image)
  }

  return formData
}


export async function fetchProducts() {
  const res = await request('/products')
  return Array.isArray(res.data) ? res.data : []
}

export async function fetchProductById(id) {
  const res = await request(`/products/${encodeURIComponent(id)}`)
  return res.data || null
}

export async function createProduct(payload) {
  const res = await request('/products', {
    method: 'POST',
    body: buildProductFormData(payload),
  })
  return res.data || null
}

export async function deleteProduct(id) {
  const res = await request(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return res.data || null
}
