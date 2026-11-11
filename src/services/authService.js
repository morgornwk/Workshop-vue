import { request } from './api'
import { useAuth } from '@/hook/useAuth'

export async function signIn({ name, password }) {
  if (!name || !password) {
    throw new Error('กรุณากรอก Username และ Password ให้ครบถ้วน')
  }

  const res = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ username: name, password }),
  })

  useAuth().setAuth(res.data)
  return res.data
}

export async function signUp({ name, password }) {
  if (!name || !password) {
    throw new Error('กรุณากรอก Username และ Password ให้ครบถ้วน')
  }

  const res = await request('/register', {
    method: 'POST',
    body: JSON.stringify({ username: name, password }),
  })

  useAuth().setAuth(res.data)
  return res.data
}