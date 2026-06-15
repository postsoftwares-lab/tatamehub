<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { apiFetch } from '@/api/client'

const router = useRouter()
const route = useRoute()
const { token, clearToken } = useAuth()

const teacher = ref<{ name: string; email: string } | null>(null)

onMounted(async () => {
  try {
    const res = await apiFetch('/profile', {}, token.value)
    teacher.value = res.data.teacher
  } catch {
    // non-critical
  }
})

function logout() {
  clearToken()
  router.push({ name: 'login' })
}

function isActive(name: string) {
  return route.name === name
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <!-- ─── Desktop sidebar (md+) ─── -->
    <aside class="hidden md:flex w-56 border-r border-border flex-col bg-card shrink-0">
      <!-- Logo -->
      <div class="px-4 py-4 border-b border-border">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" fill="white" fill-opacity="0.8" />
              <path d="M10 7L13.5 9.25V12.75L10 15L6.5 12.75V9.25L10 7Z" fill="white" />
            </svg>
          </div>
          <span class="text-[13px] font-semibold tracking-tight text-foreground">Tatame Hub</span>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 p-2 space-y-0.5 pt-3">
        <router-link
          :to="{ name: 'payments' }"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors"
          :class="isActive('payments') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          Pagamentos
        </router-link>

        <router-link
          :to="{ name: 'students' }"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors"
          :class="isActive('students') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Alunos
        </router-link>

        <router-link
          :to="{ name: 'profile' }"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors"
          :class="isActive('profile') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          Perfil
        </router-link>
      </nav>

      <!-- User + logout -->
      <div class="p-2 border-t border-border space-y-0.5">
        <div v-if="teacher" class="flex items-center gap-2.5 px-3 py-2">
          <div class="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
            {{ getInitials(teacher.name) }}
          </div>
          <div class="min-w-0">
            <p class="text-[12px] font-medium text-foreground truncate leading-tight">{{ teacher.name.split(' ')[0] }}</p>
            <p class="text-[11px] text-muted-foreground truncate leading-tight">{{ teacher.email }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </aside>

    <!-- ─── Main content ─── -->
    <!-- pb-20 reserves space for the mobile bottom nav -->
    <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
      <slot />
    </main>

    <!-- ─── Mobile bottom nav (hidden on md+) ─── -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border">
      <div class="flex items-stretch bottom-nav-safe overflow-x-auto">
        <!-- Pagamentos -->
        <router-link
          :to="{ name: 'payments' }"
          class="flex-1 min-w-min flex flex-col items-center justify-center gap-1 py-3 transition-colors px-2"
          :class="isActive('payments') ? 'text-primary' : 'text-muted-foreground'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide whitespace-nowrap">Pagamentos</span>
        </router-link>

        <!-- Alunos -->
        <router-link
          :to="{ name: 'students' }"
          class="flex-1 min-w-min flex flex-col items-center justify-center gap-1 py-3 transition-colors px-2"
          :class="isActive('students') ? 'text-primary' : 'text-muted-foreground'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide whitespace-nowrap">Alunos</span>
        </router-link>

        <!-- Perfil -->
        <router-link
          :to="{ name: 'profile' }"
          class="flex-1 min-w-min flex flex-col items-center justify-center gap-1 py-3 transition-colors px-2"
          :class="isActive('profile') ? 'text-primary' : 'text-muted-foreground'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide whitespace-nowrap">Perfil</span>
        </router-link>

        <!-- Sair -->
        <button
          @click="logout"
          class="flex-1 min-w-min flex flex-col items-center justify-center gap-1 py-3 text-muted-foreground transition-colors active:text-destructive px-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide whitespace-nowrap">Sair</span>
        </button>
      </div>
    </nav>
  </div>
</template>
