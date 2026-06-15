<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const { setToken } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    setToken(res.data.access_token)
    router.push({ name: 'payments' })
  } catch (e: any) {
    error.value = e.message || 'Credenciais inválidas'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <div class="bg-card border border-border rounded-2xl p-6 sm:p-8">
      <div class="mb-6">
        <h1 class="text-[20px] font-semibold text-foreground tracking-tight mb-1">Bem-vindo de volta</h1>
        <p class="text-sm text-muted-foreground">Entre com suas credenciais para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="professor@academia.com"
            required
            autocomplete="email"
            class="w-full h-11 px-3.5 rounded-lg bg-input border border-border text-[15px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            class="w-full h-11 px-3.5 rounded-lg bg-input border border-border text-[15px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
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
            Entrando...
          </span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="text-center text-sm text-muted-foreground mt-6">
        Novo por aqui?
        <router-link :to="{ name: 'register' }" class="text-primary font-semibold hover:underline ml-1">
          Criar conta
        </router-link>
      </p>
    </div>
  </AuthLayout>
</template>
