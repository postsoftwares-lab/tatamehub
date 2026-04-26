import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'

export function useDashboardLayout() {
  const router = useRouter()
  const academyName = ref('Tatame Hub')

  const loadAcademyData = async () => {
    try {
      const userData = await apiService.getUser()
      if (!userData.academy) {
        router.push('/academy-setup')
        return
      }
      academyName.value = userData.academy.name
    } catch (err) {
      console.error('Erro ao carregar dados da academia:', err)
    }
  }

  const logout = () => {
    apiService.logout()
    router.push('/login')
  }

  onMounted(() => {
    loadAcademyData()
  })

  return { academyName, logout }
}
