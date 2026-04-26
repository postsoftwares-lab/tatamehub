import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api'

export function useStudentDetail() {
  const route = useRoute()
  const router = useRouter()
  const student = ref<any>(null)
  const isLoading = ref(true)
  const isEditing = ref(false)
  const isSaving = ref(false)
  const isTogglingStatus = ref(false)
  const error = ref('')
  const success = ref('')

  const editForm = ref({
    name: '',
    cpf: '',
    phone: '',
    date_of_birth: '',
    belt: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    status: true
  })

  const studentId = route.params.id as string

  const loadStudent = async () => {
    isLoading.value = true
    try {
      const students = await apiService.getStudents()
      const found = (students as any[]).find(s => s.id === studentId)
      if (found) {
        student.value = found
        Object.assign(editForm.value, found)
      } else {
        error.value = 'Aluno não encontrado'
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar aluno'
    } finally {
      isLoading.value = false
    }
  }

  const toggleEdit = () => {
    isEditing.value = !isEditing.value
    if (!isEditing.value) {
      Object.assign(editForm.value, student.value)
    }
  }

  const saveChanges = async () => {
    isSaving.value = true
    error.value = ''
    success.value = ''

    try {
      await apiService.updateStudent(studentId, editForm.value)
      Object.assign(student.value, editForm.value)
      success.value = 'Aluno atualizado com sucesso!'
      isEditing.value = false

      setTimeout(() => {
        success.value = ''
      }, 3000)
    } catch (err: any) {
      error.value = err.message || 'Erro ao salvar alterações'
    } finally {
      isSaving.value = false
    }
  }

  const toggleStatusWithSave = async () => {
    isTogglingStatus.value = true
    error.value = ''
    success.value = ''

    try {
      const newStatus = !editForm.value.status
      await apiService.updateStudent(studentId, { status: newStatus })
      editForm.value.status = newStatus
      student.value.status = newStatus
      success.value = `Aluno ${newStatus ? 'ativado' : 'desativado'} com sucesso!`

      setTimeout(() => {
        success.value = ''
      }, 3000)
    } catch (err: any) {
      error.value = err.message || 'Erro ao alterar status'
    } finally {
      isTogglingStatus.value = false
    }
  }

  const goBack = () => {
    router.push('/dashboard/alunos')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  onMounted(() => {
    loadStudent()
  })

  return {
    student,
    isLoading,
    isEditing,
    isSaving,
    isTogglingStatus,
    error,
    success,
    editForm,
    toggleEdit,
    toggleStatusWithSave,
    saveChanges,
    goBack,
    getInitials
  }
}
