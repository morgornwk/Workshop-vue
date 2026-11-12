import { ref, reactive } from 'vue'

export function useAuthForm() {
  const name = ref('')
  const password = ref('')
  const errors = reactive({
    name: '',
    password: '',
  })

  function validate() {
    errors.name = name.value.trim() ? '' : 'กรุณากรอก Username'
    errors.password = password.value ? '' : 'กรุณากรอก Password'
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
