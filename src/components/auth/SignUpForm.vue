<template>
  <form class="auth-form" novalidate @submit.prevent="handleSubmit">
    <AuthInput
      id="signup-name"
      v-model.trim="name"
      label="Username"
      type="text"
      placeholder="ตั้งชื่อผู้ใช้"
      autocomplete="username"
      :error="errors.name"
    />

    <div>
      <AuthInput
        id="signup-password"
        v-model="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.password"
      />

      <div v-if="password" class="pw-strength">
        <div class="pw-strength__bars">
          <div
            v-for="n in 5"
            :key="n"
            class="pw-strength__bar"
            :class="n <= strength.score ? `pw-strength__bar--${strength.score}` : ''"
          />
        </div>
        <p class="pw-strength__label" :class="`pw-strength__label--${strength.score}`">
          {{ strength.label }}
        </p>
      </div>
    </div>

    <AuthInput
      id="signup-confirm"
      v-model="confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="••••••••"
      autocomplete="new-password"
      :error="errors.confirmPassword"
    />

    <button type="submit" class="auth-submit-btn" :disabled="loading">
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="18"
        width="2"
        color="white"
      />
      <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
    </button>
  </form>
</template>

<script>
import AuthInput from './AuthInput.vue'
import { useAuthForm } from '@/hook/useAuthForm'

export default {
  name: 'SignUpForm',
  components: { AuthInput },
  props: {
    loading: { type: Boolean, default: false },
  },
  setup(_, { emit }) {
    const { name, password, confirmPassword, errors, strength, submitWith } = useAuthForm({
      requireConfirm: true,
    })
    const handleSubmit = () => submitWith((payload) => emit('submit', payload))
    return { name, password, confirmPassword, errors, strength, handleSubmit }
  },
}
</script>

<style scoped src="../../assets/style/auth/auth-form.css"></style>
