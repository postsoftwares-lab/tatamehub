<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { Mail, Lock, User, Phone, FileText, ArrowRight, Eye, EyeOff, AlertCircle, Dumbbell, ArrowLeft } from 'lucide-vue-next'
import { authService } from '@/services/auth.service'
import { validateCPF, validateBirthDate, formatCPF, unformatCPF } from '@/utils/validators'

const router = useRouter()

onMounted(async () => {
  // Verificar se usuário já está logado
  const user = await authService.getCurrentUser()
  if (user) {
    // Redirecionar para dashboard se já está autenticado
    router.push('/dashboard')
  }
})

const formData = ref({
  name: '',
  email: '',
  password: '',
  cpf: '',
  phone: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }
  return value
}

const handleCPFInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.cpf = formatCPF(input.value)
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.phone = formatPhone(input.value)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'Por favor, preencha o nome completo.'
    return false
  }
  if (!formData.value.email.trim()) {
    errorMessage.value = 'Por favor, preencha o email.'
    return false
  }
  if (!formData.value.email.includes('@')) {
    errorMessage.value = 'Por favor, preencha um email válido.'
    return false
  }
  if (!formData.value.password.trim()) {
    errorMessage.value = 'Por favor, preencha a senha.'
    return false
  }
  if (formData.value.password.length < 6) {
    errorMessage.value = 'A senha deve ter no mínimo 6 caracteres.'
    return false
  }
  if (!formData.value.cpf.trim()) {
    errorMessage.value = 'Por favor, preencha o CPF.'
    return false
  }
  if (!validateCPF(formData.value.cpf)) {
    errorMessage.value = 'CPF inválido. Verifique e tente novamente.'
    return false
  }
  if (!formData.value.phone.trim()) {
    errorMessage.value = 'Por favor, preencha o telefone.'
    return false
  }
  return true
}

const handleSignup = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const payload = {
      email: formData.value.email.trim(),
      password: formData.value.password,
      name: formData.value.name.trim(),
      cpf: formData.value.cpf.replace(/\D/g, ''),
      phone: formData.value.phone.replace(/\D/g, '')
    }

    const response = await fetch(
      'https://wczudcwcvocipzxruwth.supabase.co/functions/v1/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      errorMessage.value = errorData.message || 'Erro ao registrar. Tente novamente.'
      return
    }

    successMessage.value = 'Registro realizado com sucesso! Fazendo login...'

    // Aguardar um pouco para mostrar a mensagem de sucesso
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Fazer login automático
    const { user, error } = await authService.login({
      email: formData.value.email,
      password: formData.value.password
    })

    if (error) {
      errorMessage.value = 'Erro ao fazer login automático. Por favor, faça login manualmente.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    if (user) {
      router.push('/academy/signup')
    }
  } catch (error) {
    console.error('Erro ao registrar:', error)
    errorMessage.value = 'Erro inesperado. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const goHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="h-screen w-full flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
    <!-- Back Button -->
    <Button 
      variant="ghost" 
      size="sm" 
      @click="goHome" 
      class="absolute top-3 left-3 gap-2 h-8"
    >
      <ArrowLeft class="h-3 w-3" />
      <span class="hidden sm:inline text-xs">Voltar</span>
    </Button>

    <div class="w-full max-w-md space-y-3 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <!-- Logo/Brand -->
      <div class="text-center space-y-1.5">
        <div class="flex items-center justify-center gap-1.5 mb-1">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Dumbbell class="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            TatameHub
          </h1>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Crie sua conta e comece a organizar seus alunos
        </p>
      </div>

      <!-- Signup Card -->
      <Card class="border-2 shadow-xl">
        <CardContent class="pt-4 pb-4">
          <form @submit.prevent="handleSignup" class="space-y-3">
            <!-- Error Message -->
            <div v-if="errorMessage" class="flex items-start gap-2 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded">
              <AlertCircle class="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="flex items-start gap-2 p-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded dark:bg-green-950 dark:border-green-800 dark:text-green-400">
              <svg class="h-3 w-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Name Field -->
            <div class="space-y-1">
              <Label for="name" class="text-xs font-medium">
                Nome Completo
              </Label>
              <div class="relative">
                <User class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="João Silva"
                  required
                  :disabled="isLoading"
                  class="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <!-- Email Field -->
            <div class="space-y-1">
              <Label for="email" class="text-xs font-medium">
                Email
              </Label>
              <div class="relative">
                <Mail class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  :disabled="isLoading"
                  class="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-1">
              <Label for="password" class="text-xs font-medium">
                Senha
              </Label>
              <div class="relative">
                <Lock class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  :disabled="isLoading"
                  class="pl-9 pr-9 h-9 text-sm"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  :disabled="isLoading"
                  tabindex="-1"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- CPF Field -->
            <div class="space-y-1">
              <Label for="cpf" class="text-xs font-medium">
                CPF
              </Label>
              <div class="relative">
                <FileText class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cpf"
                  :value="formData.cpf"
                  @input="handleCPFInput"
                  type="text"
                  placeholder="000.000.000-00"
                  required
                  :disabled="isLoading"
                  class="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <!-- Phone Field -->
            <div class="space-y-1">
              <Label for="phone" class="text-xs font-medium">
                Telefone
              </Label>
              <div class="relative">
                <Phone class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  :value="formData.phone"
                  @input="handlePhoneInput"
                  type="text"
                  placeholder="(21) 99999-9999"
                  required
                  :disabled="isLoading"
                  class="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <Button 
              type="submit" 
              class="w-full h-9 text-sm font-medium mt-2" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                Criar Conta
                <ArrowRight class="h-4 w-4" />
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              </span>
            </Button>
          </form>

          <!-- Login Link -->
          <div class="mt-2 text-center">
            <p class="text-xs text-muted-foreground">
              Já tem uma conta?
              <button @click="goToLogin" class="text-primary hover:underline font-medium">
                Login aqui
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Footer Text -->
      <p class="text-center text-xs text-muted-foreground px-4">
        Ao continuar, você concorda com nossos
        <router-link to="/terms" class="text-primary hover:underline">Termos</router-link>
        e
        <router-link to="/privacy" class="text-primary hover:underline">Privacidade</router-link>
      </p>
    </div>
  </div>
</template>
