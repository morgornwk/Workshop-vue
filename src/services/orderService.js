import { request } from './api'


export async function createProductOrder(productId, quantity) {
  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error('Quantity must be at least 1')
  }

  const res = await request(`/products/${encodeURIComponent(productId)}/orders`, {
    method: 'POST',
    body: JSON.stringify({ quantity: qty }),
  })

  return res.data
}
