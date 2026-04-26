import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'

interface Student {
  id: string
  name: string
  belt: string
  joinDate: string
  status: string
}

interface Payment {
  id: string
  studentName: string
  amount: number
  daysOverdue: number
  lastPayment: string
}

interface ChartData {
  month: string
  revenue: number
}

interface DashboardData {
  total_students: number
  active_students: number
  active_percentage: number
  inactive_students: number
  pending_payment_students: number
  paid_students: number
  received_revenue: string
  missing_revenue: string
  late_payments: LatePayment[]
  recent_students: RecentStudent[]
  chart_data?: ChartData[]
}

interface LatePayment {
  id: string
  name: string
  amount?: number
  created_at?: string
}

interface RecentStudent {
  id: string
  name: string
  belt?: string
  created_at?: string
}

export function useHomeDashboard() {
  const isLoading = ref(true)
  const error = ref('')

  const stats = ref({
    totalStudents: 0,
    activeStudents: 0,
    activePercentage: 0,
    receivedRevenue: 0,
    pendingRevenue: 0
  })

  const monthlyRevenueData = ref<Array<{ month: string; amount: number }>>([
    { month: 'Jan', amount: 0 },
    { month: 'Fev', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Abr', amount: 0 },
    { month: 'Mai', amount: 0 },
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 },
    { month: 'Ago', amount: 0 },
    { month: 'Set', amount: 0 },
    { month: 'Out', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dez', amount: 0 }
  ])

  const recentStudents = ref<Student[]>([])
  const overduePayments = ref<Payment[]>([])
  const visibleOverduePayments = ref(3)

  const loadData = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const dashboardData = await apiService.getHomeDashboard() as DashboardData

      stats.value = {
        totalStudents: dashboardData.total_students || 0,
        activeStudents: dashboardData.active_students || 0,
        activePercentage: dashboardData.active_percentage || 0,
        receivedRevenue: parseFloat(dashboardData.received_revenue) || 0,
        pendingRevenue: parseFloat(dashboardData.missing_revenue) || 0
      }

      overduePayments.value = (dashboardData.late_payments || []).map((payment) => ({
        id: payment.id,
        studentName: payment.name,
        amount: payment.amount || 0,
        daysOverdue: 0,
        lastPayment: payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR') : ''
      }))

      recentStudents.value = (dashboardData.recent_students || []).slice(0, 3).map((student) => ({
        id: student.id,
        name: student.name,
        belt: student.belt || '',
        joinDate: student.created_at ? new Date(student.created_at).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' }) : '',
        status: 'ativo'
      }))

      if (dashboardData.chart_data && Array.isArray(dashboardData.chart_data)) {
        const monthMap: { [key: string]: string } = {
          'Jan': 'Jan', 'Feb': 'Fev', 'Mar': 'Mar', 'Apr': 'Abr',
          'May': 'Mai', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
          'Sep': 'Set', 'Oct': 'Out', 'Nov': 'Nov', 'Dec': 'Dez'
        }
        monthlyRevenueData.value = dashboardData.chart_data.map((item) => ({
          month: monthMap[item.month] || item.month,
          amount: item.revenue || 0
        }))
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar dashboard'
      console.error('Dashboard error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const formatRevenue = (amount: number) => {
    if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'k'
    }
    return amount.toFixed(2)
  }

  onMounted(() => {
    loadData()
  })

  return {
    isLoading,
    error,
    stats,
    monthlyRevenueData,
    recentStudents,
    overduePayments,
    visibleOverduePayments,
    getInitials,
    formatRevenue
  }
}
