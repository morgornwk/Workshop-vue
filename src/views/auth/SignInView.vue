<template>
  <AuthLayout
    title="Welcome back"
    subtitle="Enter your name and password to sign in"
    footer-text="Don't have an account?"
    footer-action-text="Sign up"
    footer-route="/signup"
    :error="error"
    :success-msg="successMsg"
  >
    <SignInForm :loading="loading" @submit="submit" />
  </AuthLayout>
</template>

<script>
import AuthLayout from '@/components/auth/AuthLayout.vue'
import SignInForm from '@/components/auth/SignInForm.vue'
import { signIn } from '@/services/authService'
import { useAuthSubmit } from '@/hook/useAuthSubmit'

export default {
  name: 'SignInView',
  components: { AuthLayout, SignInForm },
  setup(_, { root }) {
    return useAuthSubmit(signIn, {
      successPrefix: 'เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ',
      onComplete: () => root.$router.push('/'),
    })
  },
}
</script>
