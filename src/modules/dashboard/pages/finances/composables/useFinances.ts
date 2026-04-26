import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'

export function useFinances() {
  const allFinanceStudents = ref<any[]>([])
  const pendingPayments = ref<any[]>([])
  const paymentsLoading = ref(false)
  const paymentFilter = ref<'pending' | 'paid'>('pending')
  const showPaymentModal = ref(false)
  const paymentModalAction = ref<'mark' | 'unmark'>('mark')
  const selectedPayment = ref<any>(null)
  const paymentActionLoading = ref(false)
  const paymentActionError = ref('')

  const filteredPaymentsList = computed(() => {
    if (paymentFilter.value === 'pending') {
      return pendingPayments.value
    } else {
      const pendingIds = new Set(pendingPayments.value.map(p => p.id))
      return allFinanceStudents.value.filter(student => !pendingIds.has(student.id))
    }
  })

  const getCurrentMonthName = () => {
    const month = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return month.charAt(0).toUpperCase() + month.slice(1)
  }

  const loadPayments = async () => {
    paymentsLoading.value = true
    try {
      const pending = await apiService.getPendingPayments(true)
      pendingPayments.value = pending as any[] || []

      const paid = await apiService.getPendingPayments(false)
      allFinanceStudents.value = paid as any[] || []
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err)
      allFinanceStudents.value = []
      pendingPayments.value = []
    } finally {
      paymentsLoading.value = false
    }
  }

  const filterPayments = (status: 'pending' | 'paid') => {
    paymentFilter.value = status
  }

  const openPaymentModal = (action: 'mark' | 'unmark', payment: any) => {
    paymentModalAction.value = action
    selectedPayment.value = payment
    paymentActionError.value = ''
    showPaymentModal.value = true
  }

  const closePaymentModal = () => {
    showPaymentModal.value = false
    selectedPayment.value = null
    paymentActionError.value = ''
  }

  const confirmPaymentAction = async () => {
    if (!selectedPayment.value) return

    paymentActionLoading.value = true
    paymentActionError.value = ''

    try {
      if (paymentModalAction.value === 'mark') {
        const today = new Date().toISOString().split('T')[0]
        await apiService.markPaymentPaid(selectedPayment.value.id, today)
      } else {
        const paidStudent = allFinanceStudents.value.find(s => s.id === selectedPayment.value.id)
        if (paidStudent && paidStudent.payment_id) {
          await apiService.deletePayment(paidStudent.payment_id)
        } else {
          throw new Error('Não foi possível encontrar o registro de pagamento')
        }
      }

      await loadPayments()
      closePaymentModal()
    } catch (err: any) {
      paymentActionError.value = err.message || 'Erro ao processar pagamento'
    } finally {
      paymentActionLoading.value = false
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  onMounted(() => {
    loadPayments()
  })

  return {
    filteredPaymentsList,
    paymentsLoading,
    paymentFilter,
    showPaymentModal,
    paymentModalAction,
    selectedPayment,
    paymentActionLoading,
    paymentActionError,
    getCurrentMonthName,
    filterPayments,
    openPaymentModal,
    closePaymentModal,
    confirmPaymentAction,
    getInitials
  }
}
