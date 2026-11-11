import { useAuth } from '@/hook/useAuth'

export const API_BASE = process.env.VUE_APP_API_URL || 'http://localhost:3000'
export const API_V1 = `${API_BASE}/api/v1`

export function resolveImageUrl(img) {
  if (!img) return ''
  if (/^https?:\/\//i.test(img)) return img

  const base = API_BASE.replace(/\/+$/, '')
  const path = img.replace(/^\/+/, '')
  return `${base}/${path}`
}

async function parseResponseBody(res) {
  const text = await res.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function request(path, options = {}) {
  const { token, logout } = useAuth()
  const headers = { ...options.headers }
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const authToken = token?.value
  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const endpoint = path.startsWith('/') ? path : `/${path}`
  const res = await fetch(`${API_V1}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await parseResponseBody(res)

  if (!res.ok) {
    if (res.status === 401 && authToken) {
      logout()
    }

    const error = new Error(data.message || data.massage || `Request failed with status ${res.status}`)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}
