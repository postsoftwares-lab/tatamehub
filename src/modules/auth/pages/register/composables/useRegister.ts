import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'

const isLoading = ref(false)
const errorMessage = ref('')

export function useRegister() {
  const router = useRouter()

  const validateForm = (
    name: string,
    cpf: string,
    email: string,
    password: string
  ): boolean => {
    errorMessage.value = ''

    if (!name.trim()) {
      errorMessage.value = 'Nome é obrigatório'
      return false
    }

    if (!cpf.trim()) {
      errorMessage.value = 'CPF é obrigatório'
      return false
    }

    if (!email.trim()) {
      errorMessage.value = 'Email é obrigatório'
      return false
    }

    if (!password.trim()) {
      errorMessage.value = 'Senha é obrigatória'
      return false
    }

    if (password.length < 6) {
      errorMessage.value = 'Senha deve ter no mínimo 6 caracteres'
      return false
    }

    return true
  }

  const register = async (
    name: string,
    cpf: string,
    email: string,
    password: string
  ) => {
    if (!validateForm(name, cpf, email, password)) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      await apiService.register(name, email, cpf, password)
      router.push('/login')
    } catch (error: any) {
      errorMessage.value = error.message || 'Erro ao criar conta'
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  return {
    register,
    clearError,
    isLoading,
    errorMessage
  }
}
