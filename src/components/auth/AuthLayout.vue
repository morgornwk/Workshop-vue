<template>
  <main class="auth-page">
    <!-- Back to Home Pill -->
    <router-link to="/" class="auth-back">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Back to Home</span>
    </router-link>

    <section class="auth-showcase">
      <div class="auth-orb auth-orb--top" aria-hidden="true"></div>
      <div class="auth-orb auth-orb--bottom" aria-hidden="true"></div>
      <div class="auth-grid-bg" aria-hidden="true"></div>

      <CoderScene3D />
    </section>

    <!-- Right Form Panel -->
    <section class="auth-panel">
      <div class="auth-panel__inner">
        <!-- Mobile Header -->
        <div class="auth-mobile-brand">
          <router-link to="/" class="auth-mobile-badge">
            <v-icon size="24" color="white">mdi-code-tags</v-icon>
          </router-link>
          <h2 class="auth-mobile-title">
            Mor<span>gorn</span> Portfolio
          </h2>
        </div>

        <!-- Form Card -->
        <div class="auth-card">
          <div class="auth-card__top-line" aria-hidden="true"></div>

          <div class="auth-card__head">
            <h2 class="auth-card__title">{{ title }}</h2>
            <p class="auth-card__sub">{{ subtitle }}</p>
          </div>

          <div v-if="error" class="auth-alert auth-alert--error">
            <v-icon size="18" color="#b91c1c">mdi-alert-circle</v-icon>
            <span>{{ error }}</span>
          </div>

          <div v-if="successMsg" class="auth-alert auth-alert--success">
            <v-icon size="18" color="#15803d">mdi-check-circle</v-icon>
            <span>{{ successMsg }}</span>
          </div>

          <slot />

          <div class="auth-card__footer">
            <span>{{ footerText }}</span>
            <router-link :to="footerRoute" class="auth-card__link">
              {{ footerActionText }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AuthLayout',
  components: {
    CoderScene3D: () => import('@/components/auth/CoderScene3D.vue'),
  },
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    footerText: { type: String, required: true },
    footerActionText: { type: String, required: true },
    footerRoute: { type: String, required: true },
    error: { type: String, default: '' },
    successMsg: { type: String, default: '' },
  },
}
</script>

<style scoped src="../../assets/style/auth/auth-layout.css"></style>
