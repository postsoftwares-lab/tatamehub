<script setup lang="ts">
import { useFinances } from '../composables/useFinances'

const {
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
} = useFinances()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 py-8">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold">Financeiro</h1>
        <span class="text-sm font-medium bg-blue-500 bg-opacity-10 text-blue-400 px-3 py-1 rounded-full">
          {{ getCurrentMonthName() }}
        </span>
      </div>
      <p class="text-sm text-[var(--fg-3)]">Gerencie os pagamentos dos seus alunos</p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button
        @click="filterPayments('pending')"
        :class="['px-4 py-2 rounded-lg font-medium transition-colors', paymentFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] hover:border-[var(--border)]']"
      >Falta Pagar</button>
      <button
        @click="filterPayments('paid')"
        :class="['px-4 py-2 rounded-lg font-medium transition-colors', paymentFilter === 'paid' ? 'bg-green-500 text-white' : 'bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] hover:border-[var(--border)]']"
      >Já Pagou</button>
    </div>

    <!-- Loading -->
    <div v-if="paymentsLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-[var(--fg-3)]">Carregando pagamentos...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPaymentsList.length === 0" class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--fg-3)] mx-auto mb-4">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <p class="text-lg font-medium text-[var(--fg-2)] mb-2">{{ paymentFilter === 'pending' ? 'Nenhum pagamento pendente' : 'Nenhum pagamento realizado' }}</p>
        <p class="text-sm text-[var(--fg-3)]">{{ paymentFilter === 'pending' ? 'Todos os alunos estão com os pagamentos em dia' : 'Nenhum aluno realizou pagamento ainda' }}</p>
      </div>
    </div>

    <!-- Payments List -->
    <div v-else class="grid grid-cols-1 gap-3">
      <div
        v-for="payment in filteredPaymentsList"
        :key="payment.id"
        class="bg-[var(--bg-elevated)] rounded-lg p-4 border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                {{ getInitials(payment.name) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-[var(--fg-1)] truncate">{{ payment.name }}</h3>
              <p class="text-xs text-[var(--fg-3)] truncate">{{ payment.phone }}</p>
            </div>
          </div>
          <button
            @click="openPaymentModal(paymentFilter === 'pending' ? 'mark' : 'unmark', payment)"
            :class="['px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0', paymentFilter === 'pending' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white']"
          >
            {{ paymentFilter === 'pending' ? 'Marcar Pago' : 'Desfazer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] max-w-md w-full p-6 space-y-4">
        <div class="flex items-center justify-center">
          <div :class="['p-3 rounded-full', paymentModalAction === 'mark' ? 'bg-green-500 bg-opacity-10' : 'bg-red-500 bg-opacity-10']">
            <svg v-if="paymentModalAction === 'mark'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-400">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-400">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-semibold text-[var(--fg-1)] mb-2">
            {{ paymentModalAction === 'mark' ? 'Marcar como Pago?' : 'Desfazer Pagamento?' }}
          </h3>
          <p class="text-sm text-[var(--fg-3)]">
            {{ paymentModalAction === 'mark'
              ? `Confirmar pagamento de ${selectedPayment?.name}?`
              : `Remover registro de pagamento de ${selectedPayment?.name}?` }}
          </p>
        </div>

        <div v-if="paymentActionError" class="rounded-lg px-3 py-2 text-sm text-red-400 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20">
          {{ paymentActionError }}
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="closePaymentModal"
            :disabled="paymentActionLoading"
            class="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] font-medium transition-colors hover:border-[var(--border)] disabled:opacity-50"
          >Cancelar</button>
          <button
            @click="confirmPaymentAction"
            :disabled="paymentActionLoading"
            :class="['flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-white disabled:opacity-50', paymentModalAction === 'mark' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600']"
          >
            {{ paymentActionLoading ? 'Processando...' : (paymentModalAction === 'mark' ? 'Marcar Pago' : 'Desfazer') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
