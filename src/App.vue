<template>
  <v-app>
    <ToastAlert />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import ToastAlert from '@/components/common/ToastAlert.vue'

export default {
  name: 'AppRoot',
  components: { ToastAlert },
}
</script>

<style>
.v-application {
  font-family: 'Inter', 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif !important;
  background-color: #ffffff !important;
}
</style>
