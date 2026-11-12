<template>
  <header class="navbar">
    <div class="navbar__inner">
      <router-link to="/" class="navbar__logo">
        Mor<span>gorn</span>
      </router-link>

      <div class="navbar__actions">
        <template v-if="isAuthenticated">
          <router-link to="/shop" class="navbar__btn navbar__btn--signin">
            Shop
          </router-link>
          <span class="navbar__user">{{ username }}</span>
          <button type="button" class="navbar__btn navbar__btn--signup" @click="handleLogout">
            Sign Out
          </button>
        </template>
        <template v-else>
          <router-link to="/signin" class="navbar__btn navbar__btn--signin">
            Sign In
          </router-link>
          <router-link to="/signup" class="navbar__btn navbar__btn--signup">
            Sign Up
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useAuth } from '@/hook/useAuth'
import { useSignOut } from '@/hook/useSignOut'

export default {
  name: 'AppNavbar',
  setup() {
    const { user, isAuthenticated } = useAuth()
    const { confirmSignOut } = useSignOut()
    const username = computed(() => (user.value && user.value.username) || 'Member')
    return { isAuthenticated, username, handleLogout: confirmSignOut }
  },
}
</script>

<style scoped src="../../assets/style/cards/navbar.css"></style>
