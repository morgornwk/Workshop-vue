<template>
  <form class="auth-form" novalidate @submit.prevent="handleSubmit">
    <AuthInput
      id="signin-name"
      v-model.trim="name"
      label="Username"
      type="text"
      placeholder="กรอกชื่อผู้ใช้"
      autocomplete="username"
      :error="errors.name"
    />

    <AuthInput
      id="signin-password"
      v-model="password"
      label="Password"
      type="password"
      placeholder="••••••••"
      autocomplete="current-password"
      :error="errors.password"
    />

    <button type="submit" class="auth-submit-btn" :disabled="loading">
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="18"
        width="2"
        color="white"
      />
      <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
    </button>
  </form>
</template>

<script>
import AuthInput from './AuthInput.vue'
import { useAuthForm } from '@/hook/useAuthForm'

export default {
  name: 'SignInForm',
  components: { AuthInput },
  props: {
    loading: { type: Boolean, default: false },
  },
  setup(_, { emit }) {
    const { name, password, errors, submitWith } = useAuthForm()
    const handleSubmit = () => submitWith((payload) => emit('submit', payload))
    return { name, password, errors, handleSubmit }
  },
}
</script>

<style scoped src="../../assets/style/auth/auth-form.css"></style>
