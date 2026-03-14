<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth.service'
import { ownerService } from '@/services/owner.service'
import { categoriesService, type Gender } from '@/services/categories.service'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { ArrowLeft, Save, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const studentId = route.params.id as string

const academyId = ref('')
const isLoading = ref(true)
const isLoadingData = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const genders = ref<Gender[]>([])

const formData = ref({
  name: '',
  cpf: '',
  birth_date: '',
  gender: '',
  weight: ''
})

onMounted(async () => {
  const user = await authService.getCurrentUser()
  if (!user) {
    router.push('/login')
    return
  }

  const { owner, academy } = await ownerService.getOwnerWithAcademy(user.id)
  
  if (!academy) {
    router.push('/dashboard')
    return
  }

  academyId.value = academy.id

  // Carregar gêneros
  try {
    isLoadingData.value = true
    const gends = await categoriesService.getGenders()
    genders.value = gends
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    errorMessage.value = 'Erro ao carregar dados do formulário.'
  } finally {
    isLoadingData.value = false
  }

  // Carregar dados do aluno
  await loadStudent()
})

const loadStudent = async () => {
  isLoading.value = true
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .eq('academy_id', academyId.value)
      .single()

    if (error || !data) {
      errorMessage.value = 'Aluno não encontrado.'
      setTimeout(() => router.push('/students'), 2000)
      return
    }

    formData.value = {
      name: data.name,
      cpf: data.cpf,
      birth_date: data.birth_date,
      gender: data.gender || '',
      weight: data.weight?.toString() || ''
    }
  } catch (error) {
    console.error('Erro ao carregar aluno:', error)
    errorMessage.value = 'Erro ao carregar dados do aluno.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push(`/students/${studentId}`)
}

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

const handleSave = async () => {
  if (!formData.value.name.trim() || !formData.value.cpf.trim() || !formData.value.birth_date) {
    errorMessage.value = 'Por favor, preencha os campos obrigatórios: Nome, CPF e Data de Nascimento.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase
      .from('students')
      .update({
        name: formData.value.name.trim(),
        cpf: formData.value.cpf.replace(/\D/g, ''),
        birth_date: formData.value.birth_date,
        gender: formData.value.gender.trim() || null,
        weight: formData.value.weight ? parseFloat(formData.value.weight) : null
      })
      .eq('id', studentId)
      .eq('academy_id', academyId.value)

    if (error) {
      if (error.code === '23505') {
        errorMessage.value = 'Este CPF já está cadastrado.'
      } else {
        errorMessage.value = 'Erro ao atualizar dados. Tente novamente.'
      }
      return
    }

    router.push(`/students/${studentId}`)
  } catch (error) {
    errorMessage.value = 'Erro inesperado. Tente novamente.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Header -->
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="goBack" class="gap-1 md:gap-2">
            <ArrowLeft class="h-4 w-4" />
            <span class="hidden sm:inline">Voltar</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full py-4 pb-24 md:py-8 md:pb-8">
      <div class="max-w-2xl mx-auto space-y-6 px-4 md:px-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <Card>
            <CardHeader>
              <div class="h-6 w-48 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="h-10 bg-muted animate-pulse rounded"></div>
              <div class="h-10 bg-muted animate-pulse rounded"></div>
              <div class="h-10 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>

        <!-- Edit Form -->
        <div v-else>
          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle class="h-4 w-4 flex-shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg md:text-xl">Editar Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Nome -->
                <div class="space-y-2">
                  <Label for="name">Nome Completo <span class="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    placeholder="Ex: João Silva Santos"
                    required
                    :disabled="isSaving"
                  />
                </div>

                <!-- CPF -->
                <div class="space-y-2">
                  <Label for="cpf">CPF <span class="text-destructive">*</span></Label>
                  <Input
                    id="cpf"
                    :model-value="formData.cpf"
                    @input="handleCPFInput"
                    type="text"
                    placeholder="000.000.000-00"
                    maxlength="14"
                    required
                    :disabled="isSaving"
                  />
                </div>

                <!-- Data de Nascimento -->
                <div class="space-y-2">
                  <Label for="birth_date">Data de Nascimento <span class="text-destructive">*</span></Label>
                  <Input
                    id="birth_date"
                    v-model="formData.birth_date"
                    type="date"
                    required
                    :disabled="isSaving"
                  />
                </div>

                <!-- Gênero -->
                <div class="space-y-2">
                  <Label for="gender">Gênero</Label>
                  <div v-if="isLoadingData" class="h-10 bg-muted animate-pulse rounded-md"></div>
                  <select
                    v-else
                    id="gender"
                    v-model="formData.gender"
                    class="flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="isSaving"
                  >
                    <option value="">Selecione...</option>
                    <option v-for="gender in genders" :key="gender.id" :value="gender.name">
                      {{ gender.name }}
                    </option>
                  </select>
                </div>

                <!-- Peso -->
                <div class="space-y-2">
                  <Label for="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    v-model="formData.weight"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 75.5"
                    :disabled="isSaving"
                  />
                </div>
            </CardContent>
          </Card>

          <!-- Desktop Buttons -->
          <Card class="hidden md:block">
            <CardContent class="pt-6">
              <div class="flex gap-3">
                <Button type="button" variant="outline" @click="goBack" class="flex-1" :disabled="isSaving">
                  Cancelar
                </Button>
                <Button @click="handleSave" class="flex-1" :disabled="isSaving || isLoading">
                  <span v-if="!isSaving" class="flex items-center gap-2">
                    <Save class="h-4 w-4" />
                    Salvar Alterações
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>

    <!-- Fixed Bottom Buttons (Mobile) -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-10">
      <div class="flex gap-2">
        <Button type="button" variant="outline" @click="goBack" class="flex-1" :disabled="isSaving">
          Cancelar
        </Button>
        <Button @click="handleSave" class="flex-1" :disabled="isSaving || isLoading">
          <span v-if="!isSaving" class="flex items-center justify-center gap-2">
            <Save class="h-4 w-4" />
            Salvar
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Salvando...
          </span>
        </Button>
      </div>
    </div>

  </div>
</template>
