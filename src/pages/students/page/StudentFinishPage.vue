<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const studentName = ref('')

onMounted(async () => {
  // Obter dados da rota
  const name = route.query.name as string

  if (!name) {
    router.push('/')
    return
  }

  studentName.value = name
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4 py-8">
    <div class="w-full max-w-sm space-y-8 animate-in fade-in duration-300">
      <!-- Success Icon -->
      <div class="flex justify-center">
        <div class="h-24 w-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center animate-bounce" style="animation-duration: 2s;">
          <CheckCircle2 class="h-12 w-12 text-primary" />
        </div>
      </div>

      <!-- Success Message -->
      <div class="space-y-4 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Cadastro Concluído!
        </h1>
        
        <p class="text-lg text-slate-700 dark:text-slate-300">
          Bem-vindo(a), <span class="font-bold text-primary">{{ studentName }}</span>!
        </p>
      </div>

      <!-- Motivational Message -->
      <div class="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20 dark:border-primary/30 space-y-3 text-center">
        <p class="text-lg font-semibold text-slate-900 dark:text-white">
          Bora treinar! 🥋
        </p>
        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Você está pronto(a) para esta jornada. No tatame, deixe tudo e evolua a cada treino!
        </p>
      </div>
    </div>
  </div>
</template>
