<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const { setToken } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const loading = ref(false)
const error = ref('')

function formatPhone(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 2) return nums
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
}

function onPhoneInput(e: Event) {
  phone.value = formatPhone((e.target as HTMLInputElement).value)
}

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value.replace(/\D/g, ''),
      }),
    })
    const loginRes = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    setToken(loginRes.data.access_token)
    router.push({ name: 'register-academy' })
  } catch (e: any) {
    error.value = e.message || 'Erro ao criar conta. Tente novamente.'
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
        <h1 class="text-[20px] font-semibold text-foreground tracking-tight mb-1">Criar conta</h1>
        <p class="text-sm text-muted-foreground">Registre-se como professor</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome completo</label>
          <input v-model="name" type="text" placeholder="João Silva" required :class="inputClass" autocomplete="name" />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-mail</label>
          <input v-model="email" type="email" placeholder="professor@academia.com" required :class="inputClass" autocomplete="email" />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telefone</label>
          <input :value="phone" @input="onPhoneInput" type="tel" placeholder="(21) 99999-9999" :class="inputClass" autocomplete="tel" />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            :class="inputClass"
            autocomplete="new-password"
          />
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
            Criando conta...
          </span>
          <span v-else>Criar conta</span>
        </button>
      </form>

      <p class="text-center text-sm text-muted-foreground mt-6">
        Já tem conta?
        <router-link :to="{ name: 'login' }" class="text-primary font-semibold hover:underline ml-1">Entrar</router-link>
      </p>
    </div>
  </AuthLayout>
</template>
