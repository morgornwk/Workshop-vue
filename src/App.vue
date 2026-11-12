<template>
  <v-app>
    <ToastAlert />
    <AlertDialog />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import ToastAlert from '@/components/common/ToastAlert.vue'
import AlertDialog from '@/components/common/AlertDialog.vue'

export default {
  name: 'AppRoot',
  components: { ToastAlert, AlertDialog },
}
</script>

<style>
.v-application {
  font-family: 'Inter', 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif !important;
  background-color: #ffffff !important;
}
</style>
