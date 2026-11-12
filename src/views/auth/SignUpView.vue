<template>
  <AuthLayout
    title="Create an account"
    subtitle="Start your journey with us today"
    footer-text="Already have an account?"
    footer-action-text="Sign in"
    footer-route="/signin"
    :alert="alert"
  >
    <SignUpForm :loading="loading" @submit="submit" />
  </AuthLayout>
</template>

<script>
import AuthLayout from '@/components/auth/AuthLayout.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'
import router from '@/router'
import { signUp } from '@/services/authService'
import { useAuthSubmit } from '@/hook/useAuthSubmit'

export default {
  name: 'SignUpView',
  components: { AuthLayout, SignUpForm },
  setup() {
    return useAuthSubmit(signUp, {
      successTitle: 'สมัครสมาชิกสำเร็จ!',
      errorTitle: 'สมัครสมาชิกไม่สำเร็จ',
      pendingApprovalWarning: false,
      onComplete: () => {
        const redirect = router.currentRoute.query.redirect || '/shop'
        router.push(redirect).catch(() => {})
      },
    })
  },
}
</script>
