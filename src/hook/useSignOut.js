import { useAuth } from '@/hook/useAuth'
import { useAlert } from '@/hook/useAlert'

export function useSignOut(onAfterLogout) {
  const { user, logout } = useAuth()
  const { confirm, info } = useAlert()

  async function confirmSignOut() {
    const username = (user.value && user.value.username) || 'Member'
    const ok = await confirm({
      type: 'warning',
      title: 'ออกจากระบบ?',
      message: `ต้องการออกจากระบบบัญชี "${username}" ใช่ไหม`,
      confirmText: 'ออกจากระบบ',
      cancelText: 'อยู่ต่อ',
    })
    if (!ok) return false

    logout()
    info('ออกจากระบบเรียบร้อยแล้ว', { title: 'ออกจากระบบแล้ว' })
    if (onAfterLogout) onAfterLogout()
    return true
  }

  return { confirmSignOut }
}
