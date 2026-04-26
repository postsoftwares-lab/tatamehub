import { ref, onMounted, computed } from 'vue'
import { apiService } from '@/services/api'

export function useStudentLink() {
  const academyId = ref<string | null>(null)
  const academyName = ref<string | null>(null)
  const registrationLink = computed(() => {
    if (!academyId.value) return ''
    return `${window.location.origin}/student-registration?academy=${academyId.value}`
  })
  const isLoading = ref(false)
  const error = ref('')
  const copied = ref(false)

  onMounted(async () => {
    isLoading.value = true
    try {
      const user = await apiService.getUser()
      if (user.academy?.id) {
        academyId.value = user.academy.id
        academyName.value = user.academy.name
      } else {
        error.value = 'Você não possui uma academia cadastrada.'
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar dados da academia.'
    } finally {
      isLoading.value = false
    }
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(registrationLink.value)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      error.value = 'Erro ao copiar link'
    }
  }

  return {
    academyId,
    academyName,
    registrationLink,
    isLoading,
    error,
    copied,
    copyToClipboard
  }
}
