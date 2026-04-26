<script setup lang="ts">
import { computed } from 'vue'
import { useHomeDashboard } from '../composables/useHomeDashboard'
import RevenueChart from '@/components/charts/RevenueChart.vue'

const {
  isLoading,
  stats,
  monthlyRevenueData,
  recentStudents,
  overduePayments,
  visibleOverduePayments,
  getInitials,
  formatRevenue
} = useHomeDashboard()

const hasMorePayments = computed(() => overduePayments.value.length > 3)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-[var(--fg-3)]">Carregando dashboard...</p>
      </div>
    </div>

    <template v-else>
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Total de Alunos -->
        <div class="bg-[var(--bg-elevated)] rounded-lg p-5 border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors">
          <p class="text-xs font-medium text-[var(--fg-3)] mb-3 truncate">Total de Alunos</p>
          <div class="flex items-center justify-between gap-2">
            <p class="text-2xl font-bold text-[var(--fg-1)]">{{ stats.totalStudents }}</p>
            <div class="flex-shrink-0 p-2 rounded-lg bg-blue-500 bg-opacity-10 text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Alunos Ativos -->
        <div class="bg-[var(--bg-elevated)] rounded-lg p-5 border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors">
          <p class="text-xs font-medium text-[var(--fg-3)] mb-3 truncate">Alunos Ativos</p>
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-2xl font-bold text-green-400">{{ stats.activeStudents }}</p>
              <p class="text-xs text-[var(--fg-3)]">{{ Math.round(stats.activePercentage) }}%</p>
            </div>
            <div class="flex-shrink-0 p-2 rounded-lg bg-green-500 bg-opacity-10 text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Receita Recebida -->
        <div class="bg-[var(--bg-elevated)] rounded-lg p-5 border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors">
          <p class="text-xs font-medium text-[var(--fg-3)] mb-3 truncate">Receita Recebida</p>
          <div class="flex items-center justify-between gap-2">
            <p class="text-2xl font-bold text-green-400">R$ {{ formatRevenue(stats.receivedRevenue) }}</p>
            <div class="flex-shrink-0 p-2 rounded-lg bg-green-500 bg-opacity-10 text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Falta Receber -->
        <div class="bg-[var(--bg-elevated)] rounded-lg p-5 border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors">
          <p class="text-xs font-medium text-[var(--fg-3)] mb-3 truncate">Falta Receber</p>
          <div class="flex items-center justify-between gap-2">
            <p class="text-2xl font-bold text-amber-400">R$ {{ formatRevenue(stats.pendingRevenue) }}</p>
            <div class="flex-shrink-0 p-2 rounded-lg bg-amber-500 bg-opacity-10 text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>
        </div>

      </div>

      <!-- Revenue Chart -->
      <div class="bg-[var(--bg-elevated)] rounded-lg p-6 border border-[var(--border-subtle)]">
        <h2 class="text-lg font-semibold mb-6">Receita por Mês</h2>
        <RevenueChart :data="monthlyRevenueData" />
        <div class="mt-4 text-center">
          <p class="text-xs text-[var(--fg-3)]">Total Anual: R$ {{ monthlyRevenueData.reduce((sum, d) => sum + d.amount, 0).toLocaleString('pt-BR') }}</p>
        </div>
      </div>

      <!-- Two Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Students -->
        <div class="bg-[var(--bg-elevated)] rounded-lg p-6 border border-[var(--border-subtle)]">
          <h2 class="text-lg font-semibold mb-4">Cadastros Recentes</h2>
          <div v-if="recentStudents.length > 0" class="space-y-3">
            <div v-for="student in recentStudents" :key="student.id" class="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg-app)] transition-colors cursor-pointer min-w-0">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-sm font-semibold text-white">
                  {{ getInitials(student.name) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm text-[var(--fg-1)] truncate">{{ student.name }}</h3>
                <p class="text-xs text-[var(--fg-3)] truncate">{{ student.joinDate }}</p>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--fg-3)] mb-3">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p class="text-sm font-medium text-[var(--fg-2)] mb-1">Nenhum aluno registrado</p>
            <p class="text-xs text-[var(--fg-3)]">Os novos cadastros aparecerão aqui</p>
          </div>
        </div>

        <!-- Overdue Payments -->
        <div class="bg-[var(--bg-elevated)] rounded-lg p-6" :class="overduePayments.length > 0 ? 'border border-red-500 border-opacity-20' : 'border border-[var(--border-subtle)]'">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2" :class="overduePayments.length > 0 ? 'text-red-400' : 'text-[var(--fg-1)]'">
            <svg v-if="overduePayments.length > 0" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 text-green-400">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Pagamentos em Atraso
          </h2>
          <div v-if="overduePayments.length > 0" class="space-y-3">
            <div v-for="payment in overduePayments.slice(0, visibleOverduePayments)" :key="payment.id" class="flex items-center gap-4 p-3 rounded-lg hover:bg-red-500 hover:bg-opacity-5 transition-colors cursor-pointer min-w-0">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-sm font-semibold text-white">
                  {{ getInitials(payment.studentName) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm text-[var(--fg-1)] truncate">{{ payment.studentName }}</h3>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-400 mb-3">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p class="text-sm font-medium text-[var(--fg-2)] mb-1">Todos os pagamentos em dia!</p>
            <p class="text-xs text-[var(--fg-3)]">Nenhum aluno com pagamento pendente</p>
          </div>
          <button v-if="hasMorePayments && visibleOverduePayments < overduePayments.length" @click="visibleOverduePayments = overduePayments.length" class="mt-4 w-full flex items-center justify-center gap-1 text-sm text-red-400 hover:text-red-300 font-medium py-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors">
            Ver mais
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </template>

  </div>
</template>
