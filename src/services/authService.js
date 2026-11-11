export async function signIn({ name, password }) {
  if (!name || !password) {
    throw new Error('กรุณากรอก Name และ Password ให้ครบถ้วน')
  }
  return { user: { name } }
}

export async function signUp({ name, password }) {
  if (!name || !password) {
    throw new Error('กรุณากรอก Name และ Password ให้ครบถ้วน')
  }
  return { user: { name } }
}

