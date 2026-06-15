<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const { token } = useAuth()

interface Academy {
  id: string
  name: string
  monthly_fee: number
  payment_day: number
  created_at: string
}

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  academy: Academy | null
}

const teacher = ref<Teacher | null>(null)
const loading = ref(true)
const copied = ref(false)

const studentLink = computed(() => {
  if (!teacher.value?.academy) return null
  return `${window.location.origin}/register-student/${teacher.value.academy.id}`
})

async function fetchProfile() {
  try {
    const res = await apiFetch('/profile', {}, token.value)
    teacher.value = res.data.teacher
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function copyLink() {
  if (!studentLink.value) return
  await navigator.clipboard.writeText(studentLink.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2200)
}

async function shareLink() {
  if (!studentLink.value) return
  if ('share' in navigator) {
    await navigator.share({ url: studentLink.value })
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatPhone(phone: string) {
  const n = phone.replace(/\D/g, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return phone
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

onMounted(fetchProfile)
</script>

<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-[20px] font-semibold text-foreground tracking-tight">Perfil</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Conta e academia</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <svg class="animate-spin w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <template v-else-if="teacher">
        <!-- ── Teacher ── -->
        <div class="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-3">
          <div class="flex items-center gap-4 mb-5 pb-5 border-b border-border">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span class="text-primary font-bold text-lg">{{ getInitials(teacher.name) }}</span>
            </div>
            <div>
              <p class="font-semibold text-foreground text-[16px]">{{ teacher.name }}</p>
              <span class="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/15 px-2 py-0.5 rounded-full">
                Professor
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">E-mail</p>
              <p class="text-[14px] text-foreground break-all">{{ teacher.email }}</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Telefone</p>
              <p class="text-[14px] text-foreground">{{ teacher.phone ? formatPhone(teacher.phone) : '—' }}</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Membro desde</p>
              <p class="text-[14px] text-foreground">{{ formatDate(teacher.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- ── Academy ── -->
        <div v-if="teacher.academy" class="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-3">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 class="font-semibold text-foreground">Academia</h3>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nome</p>
              <p class="text-[14px] font-medium text-foreground">{{ teacher.academy.name }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mensalidade</p>
                <p class="text-[14px] text-foreground">
                  R$&nbsp;{{ teacher.academy.monthly_fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </p>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Vencimento</p>
                <p class="text-[14px] text-foreground">Dia {{ teacher.academy.payment_day }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No academy -->
        <div v-else class="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-3">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-medium text-foreground text-[14px]">Academia não cadastrada</p>
              <p class="text-sm text-muted-foreground mt-0.5">Configure para gerenciar pagamentos</p>
            </div>
            <router-link
              :to="{ name: 'register-academy' }"
              class="shrink-0 h-9 px-4 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-colors flex items-center"
            >
              Configurar
            </router-link>
          </div>
        </div>

        <!-- ── Student link ── -->
        <div v-if="teacher.academy" class="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-foreground text-[14px]">Link de cadastro</p>
              <p class="text-[12px] text-muted-foreground mt-0.5">Envie para seus alunos se cadastrarem</p>
            </div>
          </div>

          <!-- Link row -->
          <div class="flex items-center gap-2 p-3 rounded-xl bg-secondary border border-border">
            <p class="text-[11px] text-muted-foreground flex-1 truncate font-mono min-w-0">{{ studentLink }}</p>
            <button
              @click="copyLink"
              class="shrink-0 h-8 px-3 rounded-lg text-[12px] font-semibold transition-all border"
              :class="
                copied
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-card text-foreground border-border hover:border-primary/30 hover:text-primary'
              "
            >
              <span v-if="copied" class="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copiado!
              </span>
              <span v-else>Copiar</span>
            </button>
          </div>

          <!-- Share button on mobile -->
          <button
            class="mt-2.5 w-full h-10 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors flex items-center justify-center gap-2 sm:hidden"
            @click="shareLink"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" />
            </svg>
            Compartilhar link
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>
