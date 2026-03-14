<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Dumbbell, ArrowLeft } from 'lucide-vue-next'
import { authService } from '@/services/auth.service'

const router = useRouter()

onMounted(async () => {
  // Verificar se usuário já está logado
  const user = await authService.getCurrentUser()
  if (user) {
    // Redirecionar para dashboard se já está autenticado
    router.push('/dashboard')
  }
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { user, error } = await authService.login({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMessage.value = 'Email ou senha incorretos. Tente novamente.'
      return
    }

    if (user) {
      router.push('/dashboard')
    }
  } catch (error) {
    errorMessage.value = 'Erro ao fazer login. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const goHome = () => {
  router.push('/')
}

const goToSignup = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Back Button -->
    <Button 
      variant="ghost" 
      size="sm" 
      @click="goHome" 
      class="absolute top-4 left-4 gap-2"
    >
      <ArrowLeft class="h-4 w-4" />
      <span class="hidden sm:inline">Voltar</span>
    </Button>

    <div class="w-full max-w-md space-y-8">
      <!-- Logo/Brand -->
      <div class="text-center space-y-3">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Dumbbell class="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            TatameHub
          </h1>
        </div>
        <p class="text-muted-foreground text-base">
          Gestão simples de alunos para academias de artes marciais
        </p>
      </div>

      <!-- Login Card -->
      <Card class="border-2 shadow-xl">
        <CardContent class="pt-6">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Error Message -->
            <div v-if="errorMessage" class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle class="h-4 w-4 flex-shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email" class="text-sm font-medium">
                Email
              </Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  :disabled="isLoading"
                  class="pl-10 h-11 text-base"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <Label for="password" class="text-sm font-medium">
                Senha
              </Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  :disabled="isLoading"
                  class="pl-10 pr-10 h-11 text-base"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  :disabled="isLoading"
                  tabindex="-1"
                >
                  <Eye v-if="!showPassword" class="h-5 w-5" />
                  <EyeOff v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <Button 
              type="submit" 
              class="w-full h-11 text-base font-medium" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                Entrar
                <ArrowRight class="h-4 w-4" />
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            </Button>
          </form>

          <!-- Signup Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-muted-foreground">
              Não tem uma conta?
              <button @click="goToSignup" class="text-primary hover:underline font-medium">
                Crie uma aqui
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Footer Text -->
      <p class="text-center text-sm text-muted-foreground px-8">
        Ao continuar, você concorda com nossos
        <router-link to="/terms" class="text-primary hover:underline font-medium">Termos de Serviço</router-link>
        e
        <router-link to="/privacy" class="text-primary hover:underline font-medium">Política de Privacidade</router-link>
      </p>
    </div>
  </div>
</template>
