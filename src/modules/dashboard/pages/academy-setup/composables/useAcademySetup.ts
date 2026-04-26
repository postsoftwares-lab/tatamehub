import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'

const isLoading = ref(false)
const errorMessage = ref('')

export function useAcademySetup() {
  const router = useRouter()

  const academyName = ref('')
  const billingDay = ref(1)
  const monthlyFee = ref(0)
  const selectedImage = ref<File | null>(null)
  const imagePreview = ref<string>('')

  const handleImageSelect = (file: File) => {
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    selectedImage.value = null
    imagePreview.value = ''
  }

  const validateForm = (): boolean => {
    errorMessage.value = ''

    if (!academyName.value.trim()) {
      errorMessage.value = 'Nome da academia é obrigatório'
      return false
    }

    if (billingDay.value < 1 || billingDay.value > 31) {
      errorMessage.value = 'Dia de cobrança deve ser entre 1 e 31'
      return false
    }

    if (monthlyFee.value < 0) {
      errorMessage.value = 'Valor da mensalidade não pode ser negativo'
      return false
    }

    return true
  }

  const createAcademy = async () => {
    if (!validateForm()) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      await apiService.registerAcademy(
        academyName.value,
        billingDay.value,
        monthlyFee.value,
        selectedImage.value || undefined
      )
      router.push('/dashboard')
    } catch (err: any) {
      errorMessage.value = err.message || 'Erro ao criar academia'
    } finally {
      isLoading.value = false
    }
  }

  return {
    academyName,
    billingDay,
    monthlyFee,
    selectedImage,
    imagePreview,
    isLoading,
    errorMessage,
    handleImageSelect,
    removeImage,
    createAcademy
  }
}
