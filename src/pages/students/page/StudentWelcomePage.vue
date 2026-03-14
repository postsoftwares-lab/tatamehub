<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import { Building2, AlertCircle, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const academyName = ref('')
const isLoading = ref(true)
const error = ref('')
const academyId = ref('')

onMounted(async () => {
  const academyUid = route.params.academy_id as string

  if (!academyUid) {
    error.value = 'ID da academia não fornecido'
    isLoading.value = false
    return
  }

  academyId.value = academyUid

  try {
    const { data, error: supabaseError } = await supabase
      .from('academies')
      .select('name')
      .eq('id', academyUid)
      .single()

    if (supabaseError || !data) {
      error.value = 'Academia não encontrada. Verifique o link e tente novamente.'
      return
    }

    academyName.value = data.name
  } catch (err) {
    console.error('Erro ao buscar academia:', err)
    error.value = 'Erro ao carregar dados da academia'
  } finally {
    isLoading.value = false
  }
})

const proceedToRegister = () => {
  router.push(`/students/new?academy_id=${academyId.value}`)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="w-full max-w-sm space-y-8 animate-in fade-in duration-300">
      <div class="space-y-6 text-center">
        <div class="flex justify-center">
          <div class="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse"></div>
        </div>
        <div class="space-y-3">
          <div class="h-8 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mx-auto"></div>
          <div class="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mx-auto"></div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="h-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
        <div class="h-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="w-full max-w-sm space-y-6 animate-in fade-in duration-300">
      <div class="space-y-6 text-center">
        <div class="flex justify-center">
          <div class="h-20 w-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle class="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Oops!</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400">{{ error }}</p>
        </div>
      </div>
      <Button @click="goBack" variant="outline" class="w-full h-12 text-base">
        Voltar
      </Button>
    </div>

    <!-- Success State -->
    <div v-else class="w-full max-w-sm space-y-8 animate-in fade-in duration-300">
      <!-- Header Section -->
      <div class="space-y-6 text-center">
        <!-- Icon -->
        <div class="flex justify-center">
          <div class="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center animate-bounce" style="animation-duration: 2s;">
            <Building2 class="h-10 w-10 text-primary" />
          </div>
        </div>

        <!-- Welcome Message with Academy Name -->
        <div class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            Bem-vindo(a)! à academia <span class="text-primary">{{ academyName }}</span> 👋
          </h1>
        </div>
      </div>

      <!-- Alert Message -->
      <div class="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-900/50 text-center">
        <p class="text-sm text-amber-900 dark:text-amber-100">
          <span class="font-semibold">Não é a academia correta?</span><br/>
          Entre em contato com o professor responsável para solicitar um novo link.
        </p>
      </div>

      <!-- Action Button -->
      <Button 
        @click="proceedToRegister" 
        class="w-full h-12 text-base font-semibold gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Continuar Cadastro
      </Button>

      <!-- Footer Info -->
      <p class="text-xs text-slate-500 dark:text-slate-500 text-center">
        Você será redirecionado para o formulário de cadastro
      </p>
    </div>
  </div>
</template>
