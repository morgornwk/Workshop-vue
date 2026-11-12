<template>
  <AuthLayout
    title="Welcome back"
    subtitle="Enter your username and password to sign in"
    footer-text="Don't have an account?"
    footer-action-text="Sign up"
    footer-route="/signup"
    :alert="alert"
  >
    <SignInForm :loading="loading" @submit="submit" />
  </AuthLayout>
</template>

<script>
import AuthLayout from '@/components/auth/AuthLayout.vue'
import SignInForm from '@/components/auth/SignInForm.vue'
import router from '@/router'
import { signIn } from '@/services/authService'
import { useAuthSubmit } from '@/hook/useAuthSubmit'

export default {
  name: 'SignInView',
  components: { AuthLayout, SignInForm },
  setup() {
    return useAuthSubmit(signIn, {
      successTitle: 'เข้าสู่ระบบสำเร็จ!',
      errorTitle: 'เข้าสู่ระบบไม่สำเร็จ',
      pendingApprovalWarning: true,
      onComplete: () => {
        const redirect = router.currentRoute.query.redirect || '/shop'
        router.push(redirect).catch(() => {})
      },
    })
  },
}
</script>
