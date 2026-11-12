import { ref, onBeforeUnmount } from 'vue'
import { useAlert } from '@/hook/useAlert'

const AUTH_ERROR_TH = {
  'Invalid username or password': 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
  'Username already exists': 'ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว กรุณาใช้ชื่ออื่น',
  'Username and Password are required': 'กรุณากรอก Username และ Password ให้ครบถ้วน',
  'Password must be at least 8 characters': 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
  'Internal server error': 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
}

// Manage async auth submission state, inline card alerts, and post-success toast + redirect.
export function useAuthSubmit(
  actionFn,
  { successTitle = 'สำเร็จ!', errorTitle = 'ดำเนินการไม่สำเร็จ', pendingApprovalWarning = false, onComplete } = {}
) {
  const { success, warning } = useAlert()
  const loading = ref(false)
  const alert = ref(null)
  let redirectTimer = null
  let unmounted = false

  async function submit(payload) {
    if (loading.value) return
    loading.value = true
    alert.value = null

    try {
      const res = await actionFn(payload)
      if (unmounted) return

      const displayName = (res && res.user && res.user.username) || (payload && payload.name) || ''
      const isPending = Boolean(res && res.user && res.user.approve === false)

      if (isPending && pendingApprovalWarning) {
        const msg = `ยินดีต้อนรับคุณ ${displayName} — บัญชีอยู่ระหว่างรออนุมัติจากผู้ดูแลระบบ`
        alert.value = { type: 'warning', title: 'เข้าสู่ระบบสำเร็จ (รออนุมัติ)', message: msg }
        warning(msg, { title: 'เข้าสู่ระบบสำเร็จ (รออนุมัติ)' })
      } else {
        const msg = isPending
          ? `สร้างบัญชี ${displayName} แล้ว (บัญชีรออนุมัติจากผู้ดูแลระบบ)`
          : `ยินดีต้อนรับคุณ ${displayName}`
        alert.value = { type: 'success', title: successTitle, message: msg }
        success(msg, { title: successTitle })
      }

      if (onComplete) {
        clearTimeout(redirectTimer)
        redirectTimer = setTimeout(onComplete, 900)
      }
    } catch (err) {
      if (unmounted) return
      const raw = (err && err.message) || ''
      alert.value = {
        type: 'error',
        title: errorTitle,
        message: AUTH_ERROR_TH[raw] || raw || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      }
    } finally {
      if (!unmounted) loading.value = false
    }
  }

  onBeforeUnmount(() => {
    unmounted = true
    clearTimeout(redirectTimer)
  })

  return { loading, alert, submit }
}
