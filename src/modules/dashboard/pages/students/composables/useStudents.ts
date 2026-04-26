import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'

export function useStudents() {
  const allStudents = ref<any[]>([])
  const studentsLoading = ref(false)
  const selectedStudentStatus = ref<string | undefined>(undefined)
  const studentSearchQuery = ref('')

  const filteredStudents = computed(() => {
    const query = studentSearchQuery.value.toLowerCase()
    return allStudents.value.filter(student => {
      const statusMatch =
        selectedStudentStatus.value === undefined ||
        (selectedStudentStatus.value === 'true' ? student.status : !student.status)

      const searchMatch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        (student.cpf && student.cpf.toLowerCase().includes(query))

      return statusMatch && searchMatch
    })
  })

  const loadStudents = async (status?: string) => {
    studentsLoading.value = true
    try {
      const students = await apiService.getStudents(status)
      allStudents.value = students as any[] || []
    } catch (err) {
      console.error('Erro ao carregar alunos:', err)
      allStudents.value = []
    } finally {
      studentsLoading.value = false
    }
  }

  const filterStudents = (status?: string) => {
    selectedStudentStatus.value = status
    loadStudents(status)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  onMounted(() => {
    loadStudents()
  })

  return {
    allStudents,
    filteredStudents,
    studentsLoading,
    selectedStudentStatus,
    studentSearchQuery,
    loadStudents,
    filterStudents,
    getInitials
  }
}
