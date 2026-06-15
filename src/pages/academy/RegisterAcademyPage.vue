<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const { token } = useAuth()

const name = ref('')
const monthlyFee = ref('')
const paymentDay = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await apiFetch(
      '/register-academy',
      {
        method: 'POST',
        body: JSON.stringify({
          name: name.value,
          monthly_fee: parseFloat(monthlyFee.value),
          payment_day: parseInt(paymentDay.value),
        }),
      },
      token.value,
    )
    router.push({ name: 'payments' })
  } catch (e: any) {
    error.value = e.message || 'Erro ao cadastrar academia'
  } finally {
    loading.value = false
  }
}

const inputClass =
  'w-full h-11 px-3.5 rounded-lg bg-input border border-border text-[15px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors'
</script>

<template>
  <AuthLayout>
    <div class="bg-card border border-border rounded-2xl p-6 sm:p-8">
      <div class="mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-primary">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 class="text-[20px] font-semibold text-foreground tracking-tight mb-1">Configure sua academia</h1>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Estas informações serão usadas para gerenciar os pagamentos dos alunos
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome da academia</label>
          <input v-model="name" type="text" placeholder="Academia Tatame" required :class="inputClass" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mensalidade (R$)</label>
            <input v-model="monthlyFee" type="number" min="0" step="0.01" placeholder="150,00" required :class="inputClass" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dia do venc.</label>
            <input v-model="paymentDay" type="number" min="1" max="31" placeholder="10" required :class="inputClass" />
          </div>
        </div>

        <div v-if="error" class="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/25">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-destructive shrink-0 mt-px">
            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p class="text-sm text-destructive">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 bg-primary text-white rounded-lg text-[15px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Salvando...
          </span>
          <span v-else>Continuar</span>
        </button>
      </form>
    </div>
  </AuthLayout>
</template>
