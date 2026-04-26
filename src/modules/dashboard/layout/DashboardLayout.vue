<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useDashboardLayout } from './composables/useDashboardLayout'

const { academyName, logout } = useDashboardLayout()
const route = useRoute()
const mobileMenuOpen = ref(false)

const isActive = (path: string) => route.path === path

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="w-full h-screen bg-[var(--bg-app)] text-[var(--fg-1)] flex flex-col overflow-hidden">

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex md:flex-col w-64 bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] flex-shrink-0 fixed left-0 top-0 h-screen">
      <!-- Logo -->
      <div class="px-6 py-6 border-b border-[var(--border-subtle)]">
        <div class="flex items-center gap-3">
          <svg viewBox="0 0 64 64" class="w-8 h-8 rounded-lg flex-shrink-0">
            <rect width="64" height="64" rx="14" fill="#F4F5F7" />
            <rect x="10" y="18" width="44" height="6" rx="1.5" fill="#0F0F11" />
            <rect x="10" y="29" width="44" height="6" rx="1.5" fill="#3B3E45" />
            <rect x="10" y="40" width="28" height="6" rx="1.5" fill="#0F0F11" />
            <rect x="42" y="40" width="3" height="6" rx="1" fill="#0F0F11" opacity=".55" />
          </svg>
          <div>
            <p class="text-lg font-medium tracking-tight">tatame<strong>hub</strong></p>
            <p class="text-xs text-[var(--fg-3)]">{{ academyName }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <RouterLink
          to="/dashboard"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
          <span class="truncate">Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/alunos"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/alunos') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span class="truncate">Alunos</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/academia"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/academia') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="2" width="18" height="20" rx="2" ry="2"/><line x1="9" y1="2" x2="9" y2="22"/><line x1="15" y1="2" x2="15" y2="22"/><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
          </svg>
          <span class="truncate">Academia</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/cadastro-via-link"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/cadastro-via-link') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span class="truncate">Cadastro via Link</span>
        </RouterLink>

        <RouterLink
          to="/student-registration"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/student-registration') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="16" y1="14" x2="22" y2="14"/>
          </svg>
          <span class="truncate">Registrar Novo Aluno</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/financeiro"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/financeiro') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span class="truncate">Financeiro</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/agendamento"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/agendamento') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>
          </svg>
          <span class="truncate">Agendamento</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/relatorios"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/relatorios') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]']"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
          </svg>
          <span class="truncate">Relatórios</span>
        </RouterLink>
      </nav>

      <!-- Settings & Logout -->
      <div class="border-t border-[var(--border-subtle)] px-4 py-4 space-y-1">
        <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--fg-2)] transition-colors hover:bg-[var(--bg-app)] hover:text-[var(--fg-1)]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <span class="truncate">Configurações</span>
        </button>
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--fg-2)] transition-colors hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span class="truncate">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col overflow-hidden md:ml-64">
      <!-- Header (Mobile only) -->
      <header class="md:hidden sticky top-0 z-50 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] px-4 py-4 flex items-center justify-between">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--bg-app)] transition-colors text-[var(--fg-2)]"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <svg viewBox="0 0 64 64" class="w-6 h-6 rounded flex-shrink-0">
            <rect width="64" height="64" rx="14" fill="#F4F5F7" />
            <rect x="10" y="18" width="44" height="6" rx="1.5" fill="#0F0F11" />
            <rect x="10" y="29" width="44" height="6" rx="1.5" fill="#3B3E45" />
            <rect x="10" y="40" width="28" height="6" rx="1.5" fill="#0F0F11" />
            <rect x="42" y="40" width="3" height="6" rx="1" fill="#0F0F11" opacity=".55" />
          </svg>
          <div class="min-w-0">
            <p class="text-sm font-medium tracking-tight truncate">tatame<strong class="font-bold">hub</strong></p>
            <p class="text-xs text-[var(--fg-3)] truncate">{{ academyName }}</p>
          </div>
        </div>

        <button
          @click="logout"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-app)] text-[var(--fg-2)] transition-all hover:bg-[var(--bg-high)] hover:text-red-400"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </header>

      <!-- Mobile Menu Overlay -->
      <div v-if="mobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" @click="closeMobileMenu"></div>

      <!-- Mobile Sidebar Menu -->
      <nav v-if="mobileMenuOpen" class="absolute left-0 top-16 w-64 bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] z-40 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div class="px-4 py-6 space-y-1">
          <RouterLink
            to="/dashboard"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            Dashboard
          </RouterLink>

          <RouterLink
            to="/dashboard/alunos"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/alunos') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Alunos
          </RouterLink>

          <RouterLink
            to="/dashboard/academia"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/academia') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="2" width="18" height="20" rx="2" ry="2"/><line x1="9" y1="2" x2="9" y2="22"/><line x1="15" y1="2" x2="15" y2="22"/><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
            </svg>
            Academia
          </RouterLink>

          <RouterLink
            to="/dashboard/cadastro-via-link"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/cadastro-via-link') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Cadastro via Link
          </RouterLink>

          <RouterLink
            to="/student-registration"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/student-registration') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="16" y1="14" x2="22" y2="14"/>
            </svg>
            Registrar Novo Aluno
          </RouterLink>

          <RouterLink
            to="/dashboard/financeiro"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/financeiro') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Financeiro
          </RouterLink>

          <RouterLink
            to="/dashboard/agendamento"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/agendamento') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>
            </svg>
            Agendamento
          </RouterLink>

          <RouterLink
            to="/dashboard/relatorios"
            @click="closeMobileMenu"
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors', isActive('/dashboard/relatorios') ? 'bg-blue-500 text-white' : 'text-[var(--fg-2)] hover:bg-[var(--bg-app)]']"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
            </svg>
            Relatórios
          </RouterLink>

          <hr class="my-2 border-[var(--border-subtle)]" />
          <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--fg-2)] transition-colors hover:bg-[var(--bg-app)]">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Configurações
          </button>
        </div>
      </nav>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--border-subtle);
  background-clip: content-box;
}
</style>
