import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'

export function useRegisterStudent() {
  const academy = ref<any>(null)
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)

  const studentForm = ref({
    name: '',
    phone: '',
    cpf: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    belt: ''
  })

  const loadAcademy = async () => {
    try {
      const userData = await apiService.getUser()
      academy.value = userData.academy || null
    } catch (err) {
      console.error('Erro ao carregar academia:', err)
    }
  }

  const registerStudent = async () => {
    error.value = ''
    success.value = false

    if (!studentForm.value.name.trim()) {
      error.value = 'Nome é obrigatório'
      return
    }

    if (!studentForm.value.phone.trim()) {
      error.value = 'Telefone é obrigatório'
      return
    }

    if (!academy.value) {
      error.value = 'Academia não encontrada'
      return
    }

    loading.value = true

    try {
      await apiService.registerStudentTeacher(academy.value.id, studentForm.value)
      success.value = true
      studentForm.value = {
        name: '',
        phone: '',
        cpf: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        belt: ''
      }
      setTimeout(() => {
        success.value = false
      }, 3000)
    } catch (err: any) {
      error.value = err.message || 'Erro ao cadastrar aluno'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadAcademy()
  })

  return { studentForm, loading, error, success, registerStudent }
}
