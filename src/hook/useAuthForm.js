import { ref, reactive, computed } from 'vue'


export function useAuthForm({ requireConfirm = false } = {}) {
  const name = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const errors = reactive({
    name: '',
    password: '',
    confirmPassword: '',
  })

  const strength = computed(() => {
    const pw = password.value
    if (!pw) return { score: 0, label: '' }

    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 10) score++
    if (/[A-Z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const clamped = Math.max(1, score)
    return { score: clamped, label: labels[clamped] }
  })

  function validate() {
    errors.name = ''
    errors.password = ''
    errors.confirmPassword = ''

    const trimmedName = name.value.trim()
    if (!trimmedName) {
      errors.name = 'กรุณากรอก Name'
    } else if (trimmedName.length < 2) {
      errors.name = 'Name ต้องมีอย่างน้อย 2 ตัวอักษร'
    }

    if (!password.value) {
      errors.password = 'กรุณากรอก Password'
    } else if (password.value.length < 6) {
      errors.password = 'Password ต้องมีอย่างน้อย 6 ตัวอักษร'
    }

    if (requireConfirm) {
      if (!confirmPassword.value) {
        errors.confirmPassword = 'กรุณายืนยัน Password'
      } else if (confirmPassword.value !== password.value) {
        errors.confirmPassword = 'Password ไม่ตรงกัน'
      }
    }

    return !errors.name && !errors.password && !errors.confirmPassword
  }

  function submitWith(onValid) {
    if (!validate()) return
    onValid({
      name: name.value.trim(),
      password: password.value,
    })
  }

  return {
    name,
    password,
    confirmPassword,
    errors,
    strength,
    submitWith,
  }
}
