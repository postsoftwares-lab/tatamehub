<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const { token } = useAuth()

interface Student {
  id: string
  name: string
  phone: string
  belt: string
  status: 'PAID' | 'PENDING' | 'OVERDUE'
  payment_id: string | null
  paid_at: string | null
}

interface Summary {
  total: number
  paid: number
  pending: number
  overdue: number
}

const students = ref<Student[]>([])
const summary = ref<Summary>({ total: 0, paid: 0, pending: 0, overdue: 0 })
const loading = ref(true)
const markingId = ref<string | null>(null)

const now = new Date()
const currentMonth = ref({ year: now.getFullYear(), month: now.getMonth() })
const academyCreatedDate = ref<Date | null>(null)
const monthlyFee = ref<number>(0)

const monthLabel = computed(() => {
  const d = new Date(currentMonth.value.year, currentMonth.value.month, 1)
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

const paymentMonthStr = computed(() => {
  const y = currentMonth.value.year
  const m = String(currentMonth.value.month + 1).padStart(2, '0')
  return `${y}-${m}`
})

const canGoPrevious = computed(() => {
  if (!academyCreatedDate.value) return true
  const academyMonth = academyCreatedDate.value.getMonth()
  const academyYear = academyCreatedDate.value.getFullYear()
  return !(currentMonth.value.year === academyYear && currentMonth.value.month === academyMonth)
})

const canGoNext = computed(() => {
  const todayYear = now.getFullYear()
  const todayMonth = now.getMonth()
  return currentMonth.value.year < todayYear || (currentMonth.value.year === todayYear && currentMonth.value.month < todayMonth)
})

function prevMonth() {
  if (currentMonth.value.month === 0) {
    currentMonth.value = { year: currentMonth.value.year - 1, month: 11 }
  } else {
    currentMonth.value = { ...currentMonth.value, month: currentMonth.value.month - 1 }
  }
  fetchPayments()
}

function nextMonth() {
  if (currentMonth.value.month === 11) {
    currentMonth.value = { year: currentMonth.value.year + 1, month: 0 }
  } else {
    currentMonth.value = { ...currentMonth.value, month: currentMonth.value.month + 1 }
  }
  fetchPayments()
}

async function fetchProfile() {
  try {
    const res = await apiFetch('/profile', {}, token.value)
    if (res.data.teacher?.academy) {
      if (res.data.teacher.academy.created_at) {
        academyCreatedDate.value = new Date(res.data.teacher.academy.created_at)
      }
      if (res.data.teacher.academy.monthly_fee) {
        monthlyFee.value = res.data.teacher.academy.monthly_fee
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchPayments() {
  loading.value = true
  try {
    const res = await apiFetch('/pending-payments', {}, token.value)
    students.value = res.data.students
    summary.value = res.data.summary
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function togglePayment(student: Student) {
  markingId.value = student.id
  try {
    if (student.payment_id) {
      await apiFetch('/delete-payment', { method: 'DELETE', body: JSON.stringify({ payment_id: student.payment_id }) }, token.value)
    } else {
      await apiFetch(
        '/mark-payment',
        { method: 'POST', body: JSON.stringify({ student_id: student.id, payment_month: paymentMonthStr.value }) },
        token.value,
      )
    }
    await fetchPayments()
  } catch (e) {
    console.error(e)
  } finally {
    markingId.value = null
  }
}

const beltMap: Record<string, { pill: string; dot: string; label: string }> = {
  gray:   { pill: 'bg-gray-500/10 text-gray-400 border-gray-500/20',     dot: 'bg-gray-400',    label: 'Cinza'   },
  yellow: { pill: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400', label: 'Amarela' },
  orange: { pill: 'bg-orange-500/10 text-orange-400 border-orange-500/20', dot: 'bg-orange-400', label: 'Laranja' },
  green:  { pill: 'bg-green-500/10 text-green-400 border-green-500/20',   dot: 'bg-green-400',   label: 'Verde'   },
  white:  { pill: 'bg-white/8 text-slate-300 border-white/12',         dot: 'bg-slate-300',  label: 'Branca'  },
  blue:   { pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   dot: 'bg-blue-400',   label: 'Azul'    },
  purple: { pill: 'bg-purple-500/10 text-purple-400 border-purple-400/20', dot: 'bg-purple-400', label: 'Roxa' },
  brown:  { pill: 'bg-orange-900/20 text-orange-500 border-orange-700/20', dot: 'bg-orange-600', label: 'Marrom' },
  black:  { pill: 'bg-slate-700/20 text-slate-400 border-slate-600/20', dot: 'bg-slate-400',  label: 'Preta'  },
}

const statusMap = {
  PAID:    { label: 'Pago',     bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  dot: 'bg-green-400' },
  PENDING: { label: 'Pendente', bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   dot: 'bg-blue-400'  },
  OVERDUE: { label: 'Vencido',  bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20',    dot: 'bg-red-400'   },
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

const paidPercent = computed(() =>
  summary.value.total ? Math.round((summary.value.paid / summary.value.total) * 100) : 0,
)

const totalToReceive = computed(() => monthlyFee.value * summary.value.total)
const totalReceived = computed(() => monthlyFee.value * summary.value.paid)

onMounted(() => {
  fetchProfile()
  fetchPayments()
})
</script>

<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto">

      <!-- ── Header ── -->
      <div class="mb-6">
        <h1 class="text-[20px] font-semibold text-foreground tracking-tight">Pagamentos</h1>

        <!-- Month selector below title on mobile, end-aligned on desktop -->
        <div class="flex items-center justify-between mt-3">
          <p class="text-sm text-muted-foreground hidden sm:block">Controle de mensalidades</p>

          <div class="flex items-center gap-1 bg-secondary border border-border rounded-xl p-1 w-full sm:w-auto">
            <button
              @click="prevMonth"
              :disabled="!canGoPrevious"
              class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="flex-1 sm:flex-none text-center text-[13px] font-medium text-foreground capitalize sm:min-w-[148px] select-none">
              {{ monthLabel }}
            </span>
            <button
              @click="nextMonth"
              :disabled="!canGoNext"
              class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ── Summary grid: 3 cols on sm+, 2 on mobile ── -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        <!-- Total -->
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Total</p>
          <p class="text-[28px] font-semibold text-foreground tabular-nums leading-none">{{ summary.total }}</p>
        </div>

        <!-- Pagos -->
        <div class="bg-card border border-green-500/15 rounded-xl p-4">
          <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Pagos</p>
          <p class="text-[28px] font-semibold text-green-400 tabular-nums leading-none">{{ summary.paid }}</p>
        </div>

        <!-- Pendentes -->
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Pendentes</p>
          <p class="text-[28px] font-semibold text-foreground tabular-nums leading-none">{{ summary.pending }}</p>
        </div>

        <!-- Vencidos -->
        <div class="bg-card border border-red-500/15 rounded-xl p-4">
          <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Vencidos</p>
          <p class="text-[28px] font-semibold text-red-400 tabular-nums leading-none">{{ summary.overdue }}</p>
        </div>

        <!-- Total a Receber -->
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">A receber</p>
          <p class="text-[20px] font-semibold text-foreground tabular-nums leading-none">
            R$&nbsp;{{ totalToReceive.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </p>
        </div>

        <!-- Total Recebido -->
        <div class="bg-card border border-green-500/15 rounded-xl p-4">
          <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Recebido</p>
          <p class="text-[20px] font-semibold text-green-400 tabular-nums leading-none">
            R$&nbsp;{{ totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </p>
        </div>
      </div>

      <!-- ── Progress bar ── -->
      <div v-if="summary.total > 0" class="flex items-center gap-3 mb-5 px-1">
        <div class="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
          <div class="h-full bg-green-500 rounded-full transition-all duration-500" :style="{ width: `${paidPercent}%` }" />
        </div>
        <span class="text-[12px] text-muted-foreground tabular-nums shrink-0">{{ paidPercent }}%</span>
      </div>

      <!-- ── Student list ── -->
      <div class="bg-card border border-border rounded-2xl overflow-hidden">
        <!-- Loading -->
        <div v-if="loading" class="py-16 flex items-center justify-center">
          <svg class="animate-spin w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <!-- Empty -->
        <div v-else-if="students.length === 0" class="py-16 flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted-foreground">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div class="text-center px-6">
            <p class="text-sm font-medium text-foreground">Nenhum aluno cadastrado</p>
            <p class="text-xs text-muted-foreground mt-0.5">Compartilhe o link de cadastro no seu perfil</p>
          </div>
        </div>

        <!-- Rows -->
        <div v-else class="divide-y divide-border">
          <div
            v-for="student in students"
            :key="student.id"
            class="grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-3.5 sm:px-5 items-start"
          >
            <!-- Avatar -->
            <div class="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 text-[11px] font-bold text-muted-foreground mt-0.5">
              {{ getInitials(student.name) }}
            </div>

            <!-- Name + Faixa + Status (stacked) -->
            <div class="flex-1 min-w-0 space-y-1">
              <!-- Nome -->
              <p class="text-[14px] font-semibold text-foreground truncate">{{ student.name }}</p>

              <!-- Faixa -->
              <template v-if="beltMap[student.belt]">
                <span
                  class="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border leading-none"
                  :class="beltMap[student.belt]!.pill"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="beltMap[student.belt]!.dot" />
                  {{ beltMap[student.belt]!.label }}
                </span>
              </template>

              <!-- Status -->
              <div>
                <div
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                  :class="[statusMap[student.status].bg, statusMap[student.status].text, statusMap[student.status].border]"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusMap[student.status].dot" />
                  {{ statusMap[student.status].label }}
                </div>
              </div>
            </div>

            <!-- Mark/unmark button -->
            <button
              @click="togglePayment(student)"
              :disabled="markingId === student.id"
              class="h-9 px-3.5 rounded-lg border text-[12px] font-semibold transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5 min-w-[84px] justify-center"
              :class="
                student.payment_id
                  ? 'border-border text-muted-foreground hover:border-red-500/30 hover:text-red-400'
                  : 'border-primary/30 text-primary bg-primary/5 hover:bg-primary/10'
              "
            >
              <template v-if="markingId === student.id">
                <svg class="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </template>
              <template v-else>
                {{ student.payment_id ? 'Desmarcar' : 'Marcar pago' }}
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
