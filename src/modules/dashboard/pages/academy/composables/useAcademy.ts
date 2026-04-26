import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'

export function useAcademy() {
  const academy = ref<any>(null)
  const isLoading = ref(true)

  const loadAcademy = async () => {
    isLoading.value = true
    try {
      const userData = await apiService.getUser()
      academy.value = userData.academy || null
    } catch (err) {
      console.error('Erro ao carregar academia:', err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadAcademy()
  })

  return { academy, isLoading }
}
