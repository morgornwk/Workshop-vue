<template>
  <footer id="contact" class="sec sec--dark footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <h3 class="footer-logo">Mor<span>gorn</span></h3>
        </div>

        <div class="footer-socials">
          <a
            v-if="profile.contacts && profile.contacts.github"
            :href="profile.contacts.github"
            target="_blank"
            rel="noopener"
            class="footer-social-btn"
            title="GitHub"
            aria-label="GitHub"
          >
            <v-icon size="20" color="white">mdi-github</v-icon>
          </a>
          <a
            v-if="profile.contacts && profile.contacts.instagram"
            :href="profile.contacts.instagram"
            target="_blank"
            rel="noopener"
            class="footer-social-btn"
            title="Instagram"
            aria-label="Instagram"
          >
            <v-icon size="20" color="white">mdi-instagram</v-icon>
          </a>
          <a
            v-if="profile.contacts && profile.contacts.email"
            :href="`mailto:${profile.contacts.email}`"
            class="footer-social-btn"
            title="Email"
            aria-label="Email"
          >
            <v-icon size="20" color="white">mdi-email-outline</v-icon>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">© {{ new Date().getFullYear() }} {{ profile.fullName }} ({{ profile.nickname }}). All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped src="../../assets/style/components/AppFooter.css">
