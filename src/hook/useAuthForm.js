import { ref, reactive } from 'vue'

export function useAuthForm() {
  const name = ref('')
  const password = ref('')
  const errors = reactive({
    name: '',
    password: '',
  })

  function validate() {
    errors.name = ''
    errors.password = ''

    if (!name.value.trim()) {
      errors.name = 'กรุณากรอก Username'
    }

    if (!password.value) {
      errors.password = 'กรุณากรอก Password'
    }

    return !errors.name && !errors.password
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
    errors,
    submitWith,
  }
}
