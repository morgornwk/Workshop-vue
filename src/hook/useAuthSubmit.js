import { ref, onBeforeUnmount } from 'vue'


export function useAuthSubmit(actionFn, { successPrefix, onComplete }) {
  const loading = ref(false)
  const error = ref('')
  const successMsg = ref('')
  let redirectTimer = null

  async function submit(payload) {
    loading.value = true
    error.value = ''
    successMsg.value = ''

    try {
      const res = await actionFn(payload)
      successMsg.value = `${successPrefix} ${res.user.name}`
      redirectTimer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 700)
    } catch (err) {
      error.value = err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
    } finally {
      loading.value = false
    }
  }

  onBeforeUnmount(() => {
    if (redirectTimer) clearTimeout(redirectTimer)
  })

  return {
    loading,
    error,
    successMsg,
    submit,
  }
}
