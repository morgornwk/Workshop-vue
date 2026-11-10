<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'AppRoot',
}
</script>

<style>
.v-application {
  font-family: 'Inter', 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif !important;
  background-color: #ffffff !important;
}
</style>
