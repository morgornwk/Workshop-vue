<template>
  <header class="navbar">
    <div class="navbar__inner">
      <router-link to="/" class="navbar__logo">
        Mor<span>gorn</span>
      </router-link>

      <div class="navbar__actions">
        <router-link to="/signin" class="navbar__btn navbar__btn--signin">
          Sign In
        </router-link>
        <router-link to="/signup" class="navbar__btn navbar__btn--signup">
          Sign Up
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppNavbar',
}
</script>

<style scoped src="../../assets/style/components/navbar.css"></style>
