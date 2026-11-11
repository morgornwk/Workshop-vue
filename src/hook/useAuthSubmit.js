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
      const displayName = (res.user && (res.user.username || res.user.name)) || ''
      const approveNote = res.user && res.user.approve === false
        ? ' (บัญชีรออนุมัติจากผู้ดูแลระบบก่อนเข้าดูรายละเอียด/สั่งซื้อ)'
        : ''
      successMsg.value = `${successPrefix} ${displayName}${approveNote}`
      redirectTimer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 900)
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
