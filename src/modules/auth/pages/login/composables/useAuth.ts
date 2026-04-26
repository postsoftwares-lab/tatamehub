import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const isLoading = ref(false)
  const errorMessage = ref('')

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      errorMessage.value = 'Preencha email e senha'
      return false
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      // TODO: Integrar com API real
      await new Promise(r => setTimeout(r, 800))
      router.push('/dashboard')
      return true
    } catch {
      errorMessage.value = 'Não foi possível entrar. Tente de novo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  return {
    isLoading,
    errorMessage,
    login,
    clearError
  }
}
