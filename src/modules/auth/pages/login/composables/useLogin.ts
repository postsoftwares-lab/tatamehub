import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'

const isLoading = ref(false)
const errorMessage = ref('')

export function useLogin() {
  const router = useRouter()

  const validateForm = (email: string, password: string): boolean => {
    errorMessage.value = ''

    if (!email.trim()) {
      errorMessage.value = 'Email é obrigatório'
      return false
    }

    if (!password.trim()) {
      errorMessage.value = 'Senha é obrigatória'
      return false
    }

    return true
  }

  const login = async (email: string, password: string, rememberMe: boolean) => {
    if (!validateForm(email, password)) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      await apiService.login(email, password)

      if (rememberMe) {
        localStorage.setItem('remember_me', 'true')
      } else {
        localStorage.removeItem('remember_me')
      }

      router.push('/dashboard')
    } catch (error: any) {
      errorMessage.value = error.message || 'Erro ao fazer login'
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  return {
    login,
    clearError,
    isLoading,
    errorMessage
  }
}
