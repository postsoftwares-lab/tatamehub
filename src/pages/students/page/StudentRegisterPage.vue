<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showSuccessScreen = ref(false)

const formData = ref({
  name: '',
  phone: '',
  cpf: '',
  date_of_birth: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  belt: 'branca'
})

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return value
}

const handleCPFInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.cpf = formatCPF(input.value)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!formData.value.name.trim()) {
    errorMessage.value = 'Por favor, preencha o nome.'
    return
  }

  if (!formData.value.cpf.trim()) {
    errorMessage.value = 'Por favor, preencha o CPF.'
    return
  }

  if (!formData.value.phone.trim()) {
    errorMessage.value = 'Por favor, preencha o telefone.'
    return
  }

  if (!formData.value.date_of_birth) {
    errorMessage.value = 'Por favor, preencha a data de nascimento.'
    return
  }

  if (!formData.value.emergency_contact_name.trim()) {
    errorMessage.value = 'Por favor, preencha o nome do contato de emergência.'
    return
  }

  if (!formData.value.emergency_contact_phone.trim()) {
    errorMessage.value = 'Por favor, preencha o telefone do contato de emergência.'
    return
  }

  isLoading.value = true

  try {
    let academyId = route.query.academy_id as string
    
    if (!academyId) {
      academyId = route.params.academy_id as string
    }

    if (!academyId) {
      errorMessage.value = 'ID da academia não fornecido.'
      return
    }

    const payload = {
      academy_id: academyId,
      name: formData.value.name.trim(),
      phone: formData.value.phone.trim(),
      cpf: formData.value.cpf.replace(/\D/g, ''),
      date_of_birth: formData.value.date_of_birth,
      emergency_contact_name: formData.value.emergency_contact_name.trim(),
      emergency_contact_phone: formData.value.emergency_contact_phone.trim(),
      belt: formData.value.belt
    }

    const response = await fetch(
      'https://tcnqzaciroovlqdkgyes.supabase.co/functions/v1/register-student-public',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Erro ao registrar aluno.'
      return
    }

    successMessage.value = 'Aluno registrado com sucesso!'
    showSuccessScreen.value = true
    setTimeout(() => {
      router.push({
        name: 'student-finish',
        query: {
          name: formData.value.name,
          academy: academyId
        }
      })
    }, 3000)
  } catch (error) {
    console.error('Erro:', error)
    errorMessage.value = 'Erro ao registrar aluno. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Tela de Sucesso -->
  <div v-if="showSuccessScreen" class="min-h-screen bg-white flex items-center justify-center px-4">
    <div class="text-center max-w-md mx-auto">
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 mb-4">
          <CheckCircle class="h-12 w-12 sm:h-14 sm:w-14 text-green-600" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Cadastro Realizado!
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">
          Seu cadastro foi realizado com sucesso. Você será redirecionado em instantes...
        </p>
      </div>
      
      <div class="flex justify-center">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
          <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
          <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Formulário Original -->
  <div v-else class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <main class="w-full py-6 pb-28 sm:py-8 sm:pb-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6">
        <Card class="shadow-sm">
          <CardHeader class="pb-3 sm:pb-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex-shrink-0">
                <UserPlus class="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div class="min-w-0">
                <CardTitle class="text-lg sm:text-xl">Cadastro de Aluno</CardTitle>
                <CardDescription class="text-xs sm:text-sm">
                  Preencha seus dados para se registrar
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent class="pt-0">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Success Message -->
              <div v-if="successMessage && !showSuccessScreen" class="flex items-center gap-2 p-2.5 text-xs sm:text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle class="h-4 w-4 flex-shrink-0" />
                <span>{{ successMessage }}</span>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="flex items-start gap-2 p-2.5 text-xs sm:text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle class="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Nome -->
              <div class="space-y-1.5">
                <Label for="name" class="text-xs sm:text-sm">Nome Completo <span class="text-destructive">*</span></Label>
                <Input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="João Silva Santos"
                  :disabled="isLoading"
                  class="h-9 sm:h-10 text-sm focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <!-- CPF -->
              <div class="space-y-1.5">
                <Label for="cpf" class="text-xs sm:text-sm">CPF <span class="text-destructive">*</span></Label>
                <Input
                  id="cpf"
                  :model-value="formData.cpf"
                  @input="handleCPFInput"
                  type="text"
                  placeholder="000.000.000-00"
                  maxlength="14"
                  :disabled="isLoading"
                  class="h-9 sm:h-10 text-sm focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <!-- Data de Nascimento -->
              <div class="space-y-1.5">
                <Label for="date_of_birth" class="text-xs sm:text-sm">Data de Nascimento <span class="text-destructive">*</span></Label>
                <Input
                  id="date_of_birth"
                  v-model="formData.date_of_birth"
                  type="date"
                  :disabled="isLoading"
                  class="h-9 sm:h-10 text-sm focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <!-- Telefone -->
              <div class="space-y-1.5">
                <Label for="phone" class="text-xs sm:text-sm">Telefone <span class="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  :disabled="isLoading"
                  class="h-9 sm:h-10 text-sm focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <!-- Faixa -->
              <div class="space-y-1.5">
                <Label for="belt" class="text-xs sm:text-sm">Faixa <span class="text-destructive">*</span></Label>
                <select
                  id="belt"
                  v-model="formData.belt"
                  class="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background pl-3 pr-8 py-2 text-xs sm:text-sm ring-offset-background appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="isLoading"
                >
                  <option value="branca">Branca</option>
                  <option value="cinza">Cinza</option>
                  <option value="amarela">Amarela</option>
                  <option value="laranja">Laranja</option>
                  <option value="verde">Verde</option>
                  <option value="azul">Azul</option>
                  <option value="roxa">Roxa</option>
                  <option value="marrom">Marrom</option>
                  <option value="preta">Preta</option>
                </select>
              </div>

              <!-- Contato de Emergência - Nome -->
              <div class="space-y-1.5">
                <Label for="emergency_contact_name" class="text-xs sm:text-sm">Contato de Emergência <span class="text-destructive">*</span></Label>
                <Input
                  id="emergency_contact_name"
                  v-model="formData.emergency_contact_name"
                  type="text"
                  placeholder="Maria Silva Santos"
                  :disabled="isLoading"
                  class="h-9 sm:h-10 text-sm focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <!-- Contato de Emergência - Telefone -->
              <div class="space-y-1.5">
                <Label for="emergency_contact_phone" class="text-xs sm:text-sm">Telefone do Contato <span class="text-destructive">*</span></Label>
                <Input
                  id="emergency_contact_phone"
                  v-model="formData.emergency_contact_phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  :disabled="isLoading"
                  class="h-9 sm:h-10 text-sm focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <!-- Buttons -->
              <div class="flex gap-2 pt-2 sm:pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  @click="$router.back()" 
                  class="flex-1 h-9 sm:h-10 text-xs sm:text-sm" 
                  :disabled="isLoading"
                >
                  Voltar
                </Button>
                <Button 
                  @click="handleSubmit" 
                  class="flex-1 h-9 sm:h-10 text-xs sm:text-sm" 
                  :disabled="isLoading"
                >
                  <span v-if="!isLoading" class="flex items-center justify-center gap-1.5">
                    <UserPlus class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span class="hidden xs:inline">Registrar</span>
                    <span class="inline xs:hidden">OK</span>
                  </span>
                  <span v-else class="flex items-center justify-center gap-1.5">
                    <svg class="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="hidden xs:inline">Registrando...</span>
                    <span class="inline xs:hidden">...</span>
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
