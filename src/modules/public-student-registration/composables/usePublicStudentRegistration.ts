import { ref } from 'vue'
import { apiService } from '@/services/api'

export function usePublicStudentRegistration() {
  const studentForm = ref({
    name: '',
    phone: '',
    cpf: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    belt: ''
  })

  const isLoading = ref(false)
  const error = ref('')
  const success = ref(false)
  const academyId = ref<string | null>(null)
  const invalidAcademy = ref(false)

  const setAcademyId = (id: string | null) => {
    academyId.value = id
  }

  const resetForm = () => {
    studentForm.value = {
      name: '',
      phone: '',
      cpf: '',
      date_of_birth: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      belt: ''
    }
    error.value = ''
    success.value = false
  }

  const validate = (): boolean => {
    error.value = ''

    if (!studentForm.value.name.trim()) {
      error.value = 'Nome é obrigatório'
      return false
    }

    if (!studentForm.value.phone.trim()) {
      error.value = 'Telefone é obrigatório'
      return false
    }

    if (!academyId.value) {
      error.value = 'Academia não identificada'
      return false
    }

    return true
  }

  const registerStudent = async () => {
    if (!validate()) {
      return
    }

    isLoading.value = true
    success.value = false

    try {
      await apiService.registerStudentPublic(academyId.value!, studentForm.value)
      success.value = true
      resetForm()

      // Clear success message after 3 seconds
      setTimeout(() => {
        success.value = false
      }, 3000)
    } catch (err: any) {
      error.value = err.message || 'Erro ao cadastrar. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    studentForm,
    isLoading,
    error,
    success,
    academyId,
    invalidAcademy,
    setAcademyId,
    resetForm,
    registerStudent,
    validate
  }
}
