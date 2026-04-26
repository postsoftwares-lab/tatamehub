<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="w-full h-screen grid grid-cols-1 min-[960px]:grid-cols-2 bg-[var(--bg-app)] text-[var(--fg-1)] overflow-hidden select-none">

    <!-- Left: Brand Panel (hidden below 960px) -->
    <section
      class="hidden min-[960px]:flex flex-col border-r border-[var(--border-subtle)] overflow-hidden"
      :style="{ background: 'radial-gradient(circle at 40% 60%, rgba(244,245,247,0.07), transparent 65%), var(--bg-inset)' }"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-8 pt-12">
        <svg viewBox="0 0 64 64" class="w-8 h-8 rounded-lg flex-shrink-0">
          <rect width="64" height="64" rx="14" fill="#F4F5F7" />
          <rect x="10" y="18" width="44" height="6" rx="1.5" fill="#0F0F11" />
          <rect x="10" y="29" width="44" height="6" rx="1.5" fill="#3B3E45" />
          <rect x="10" y="40" width="28" height="6" rx="1.5" fill="#0F0F11" />
          <rect x="42" y="40" width="3" height="6" rx="1" fill="#0F0F11" opacity=".55" />
        </svg>
        <span class="text-lg font-medium tracking-tight text-[var(--fg-1)]">
          tatame<strong class="font-bold">hub</strong>
        </span>
      </div>

      <!-- Center brand message -->
      <div class="flex-1 flex flex-col items-center justify-center px-10 text-center gap-5">
        <div class="opacity-20" aria-hidden="true">
          <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
            <rect x="1" y="1" width="36" height="36" rx="5" stroke="currentColor" stroke-width="1.5"/>
            <rect x="43" y="1" width="36" height="36" rx="5" stroke="currentColor" stroke-width="1.5"/>
            <rect x="1" y="43" width="36" height="36" rx="5" stroke="currentColor" stroke-width="1.5"/>
            <rect x="43" y="43" width="36" height="36" rx="5" stroke="currentColor" stroke-width="1.5"/>
            <line x1="19" y1="1" x2="19" y2="37" stroke="currentColor" stroke-width="1"/>
            <line x1="61" y1="43" x2="61" y2="79" stroke="currentColor" stroke-width="1"/>
          </svg>
        </div>
        <p class="text-[30px] font-semibold leading-tight tracking-tight text-[var(--fg-1)]">
          Gestão simples,<br />direto do tatame.
        </p>
        <p class="text-sm text-[var(--fg-3)] max-w-[260px] leading-relaxed">
          Controle alunos, presenças e mensalidades em um só lugar.
        </p>
      </div>

      <!-- Footer -->
      <div class="px-8 py-8 text-center">
        <span class="text-xs text-[var(--fg-3)] opacity-50">tatamehub &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </section>

    <!-- Right: Form Content -->
    <section class="flex flex-col items-center justify-center overflow-y-auto px-8 py-10">
      <div class="w-full max-w-[400px]">
        <div class="mb-6">
          <h1 class="text-[34px] font-bold leading-tight tracking-tight text-[var(--fg-1)] mb-1">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-sm text-[var(--fg-2)]">
            {{ subtitle }}
          </p>
        </div>
        <slot />
      </div>
    </section>

  </div>
</template>
