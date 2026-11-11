import { ref, computed } from 'vue'

const TOKEN_KEY = 'kv_token'
const USER_KEY = 'kv_user'

const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value))
      } else {
        localStorage.removeItem(key)
      }
    } catch {
      /* ignore storage errors */
    }
  },
}

// Shared reactive state so Navbar, Storefront, and Checkout read the same session.
const token = ref(storage.get(TOKEN_KEY, ''))
const user = ref(storage.get(USER_KEY, null))

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(token.value))
  const isApproved = computed(() => Boolean(user.value?.approve))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setAuth({ token: newToken = '', user: newUser = null } = {}) {
    token.value = newToken
    user.value = newUser
    storage.set(TOKEN_KEY, newToken)
    storage.set(USER_KEY, newUser)
  }

  function logout() {
    setAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    isApproved,
    isAdmin,
    setAuth,
    logout,
  }
}
