<script setup lang="ts">
// Mobile-first auth layout — no gradients, solid dark bg
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col sm:items-center sm:justify-center px-4 pt-12 pb-8 sm:p-4">
    <!-- Logo -->
    <div class="flex items-center gap-2.5 mb-8 sm:mb-10">
      <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" fill="white" fill-opacity="0.8" />
          <path d="M10 7L13.5 9.25V12.75L10 15L6.5 12.75V9.25L10 7Z" fill="white" />
        </svg>
      </div>
      <span class="text-[16px] font-semibold tracking-tight text-foreground">Tatame Hub</span>
    </div>

    <!-- Card -->
    <div class="w-full sm:max-w-[400px]">
      <slot />
    </div>
  </div>
</template>
