import { ref, computed } from 'vue'

const TOKEN_KEY = 'kv_token'
const USER_KEY = 'kv_user'

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage errors when localStorage is unavailable.
  }
}

// Shared reactive session state across Navbar, Storefront, API calls, and Checkout.
const token = ref(readStorage(TOKEN_KEY, ''))
const user = ref(readStorage(USER_KEY, null))
const isAuthenticated = computed(() => Boolean(token.value))
const isAdmin = computed(() => user.value?.role === 'admin')

export function useAuth() {
  function setAuth({ token: newToken = '', user: newUser = null } = {}) {
    token.value = newToken
    user.value = newUser
    writeStorage(TOKEN_KEY, newToken)
    writeStorage(USER_KEY, newUser)
  }

  function logout() {
    setAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setAuth,
    logout,
  }
}
