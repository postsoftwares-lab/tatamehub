import { ref, computed } from 'vue'

const _token = ref<string | null>(localStorage.getItem('th_token'))

export function useAuth() {
  const token = computed(() => _token.value)
  const isAuthenticated = computed(() => !!_token.value)

  function setToken(access: string) {
    _token.value = access
    localStorage.setItem('th_token', access)
  }

  function clearToken() {
    _token.value = null
    localStorage.removeItem('th_token')
  }

  return { token, isAuthenticated, setToken, clearToken }
}
