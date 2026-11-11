<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-tag">
          <span class="hero-tag__text">Hi I'm {{ profile.nickname }}</span>
        </div>

        <h1 class="hero-name">{{ profile.fullName }}</h1>
        <h2 class="hero-role">{{ profile.role }}</h2>
        <p v-if="profile.intro" class="hero-intro">{{ profile.intro }}</p>
      </div>

      <div class="hero-visual">
        <div class="hero-glow"></div>
        <img
          v-if="profile.photo"
          :src="profile.photo"
          :alt="profile.fullName"
          class="hero-img"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroFrame',
  props: {
    profile: { type: Object, required: true },
  },
}
</script>

<style scoped src="../../assets/style/components/hero-frame.css"></style>
