import { ref, computed } from 'vue'
import { apiService } from '@/services/api'

const isAuthenticated = ref(false)
const isCheckingAuth = ref(true)

export function useAuth() {
  const checkAuth = async () => {
    isCheckingAuth.value = true
    try {
      if (apiService.isAuthenticated()) {
        await apiService.getUser()
        isAuthenticated.value = true
      }
    } catch {
      apiService.logout()
      isAuthenticated.value = false
    } finally {
      isCheckingAuth.value = false
    }
  }

  const initializeAuth = async () => {
    const rememberMe = localStorage.getItem('remember_me') === 'true'

    if (rememberMe && apiService.getAccessToken()) {
      await checkAuth()
    } else {
      apiService.logout()
      isAuthenticated.value = false
      isCheckingAuth.value = false
    }
  }

  const logout = () => {
    apiService.logout()
    localStorage.removeItem('remember_me')
    isAuthenticated.value = false
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    isCheckingAuth: computed(() => isCheckingAuth.value),
    checkAuth,
    initializeAuth,
    logout
  }
}
