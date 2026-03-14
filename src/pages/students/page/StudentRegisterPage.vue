<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { ownerService } from '@/services/owner.service'
import { categoriesService, type AgeCategory, type Gender, type AgeCategoryBelt, type WeightCategory } from '@/services/categories.service'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { UserPlus, AlertCircle } from 'lucide-vue-next'
import { validateBirthDate, validateCPF } from '@/utils/validators'

const router = useRouter()
const academyId = ref('')
const isLoading = ref(false)
const isLoadingData = ref(true)
const errorMessage = ref('')
const isStudentRegistering = ref(false)

// Dados do Supabase
const ageCategories = ref<AgeCategory[]>([])
const genders = ref<Gender[]>([])
const ageCategoryBelts = ref<AgeCategoryBelt[]>([])
const weightCategories = ref<WeightCategory[]>([])

const formData = ref({
  name: '',
  cpf: '',
  birth_date: '',
  belt: '',
  gender: '',
  gender_id: 0,
  weight: '',
  category: '',
  phone: '',
  guardian_phone: ''
})

// Computed para faixas disponíveis baseado na categoria de idade
const availableBelts = computed(() => {
  if (!formData.value.birth_date || isLoadingData.value) return []
  
  const ageCategory = categoriesService.calculateAgeCategory(formData.value.birth_date, ageCategories.value)
  if (!ageCategory) return []
  
  return categoriesService.getBeltsForAgeCategory(ageCategory.id, ageCategoryBelts.value)
})

// Computed para categorias disponíveis baseadas no gênero e idade
const availableCategories = computed(() => {
  if (!formData.value.gender_id || !formData.value.birth_date || isLoadingData.value) return []
  
  return categoriesService.getAvailableCategories(
    formData.value.birth_date,
    formData.value.gender_id,
    ageCategories.value,
    weightCategories.value
  )
})

const calculateCategory = () => {
  if (!formData.value.birth_date || !formData.value.weight || !formData.value.gender_id || isLoadingData.value) {
    formData.value.category = ''
    return
  }

  const weight = parseFloat(formData.value.weight)
  const ageCategory = categoriesService.calculateAgeCategory(formData.value.birth_date, ageCategories.value)
  
  if (!ageCategory) {
    formData.value.category = ''
    return
  }

  // Para categorias de base (até 15 anos), não há divisão de peso
  if (ageCategory.max_age < 16) {
    formData.value.category = ageCategory.name
    return
  }

  // Calcular categoria de peso
  const weightCategoryName = categoriesService.calculateWeightCategory(
    weight,
    ageCategory.id,
    formData.value.gender_id,
    weightCategories.value
  )

  if (weightCategoryName) {
    formData.value.category = `${ageCategory.name} - ${weightCategoryName}`
  } else {
    formData.value.category = ageCategory.name
  }
}

// Watch para recalcular categoria automaticamente
watch([() => formData.value.birth_date, () => formData.value.weight, () => formData.value.gender_id], () => {
  calculateCategory()
})

// Watch para resetar faixa se não estiver disponível na nova categoria
watch(() => formData.value.birth_date, () => {
  if (formData.value.belt && !availableBelts.value.includes(formData.value.belt)) {
    formData.value.belt = ''
  }
})

// Watch para atualizar gender_id quando gender mudar
watch(() => formData.value.gender, (newGender) => {
  const gender = genders.value.find(g => g.name === newGender)
  formData.value.gender_id = gender ? gender.id : 0
})

onMounted(async () => {
  // Verificar se é aluno vindo do link de boas-vindas
  const route = router.currentRoute.value
  const academyIdFromQuery = route.query.academy_id as string
  
  if (academyIdFromQuery) {
    // Aluno se cadastrando via link
    isStudentRegistering.value = true
    academyId.value = academyIdFromQuery
  } else {
    // Professor cadastrando aluno
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
  }

  // Carregar dados do Supabase
  try {
    isLoadingData.value = true
    const [ageCats, gends, ageCatBelts, weightCats] = await Promise.all([
      categoriesService.getAgeCategories(),
      categoriesService.getGenders(),
      categoriesService.getAgeCategoryBelts(),
      categoriesService.getWeightCategories()
    ])

    ageCategories.value = ageCats
    genders.value = gends
    ageCategoryBelts.value = ageCatBelts
    weightCategories.value = weightCats
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    errorMessage.value = 'Erro ao carregar dados do formulário. Tente novamente.'
  } finally {
    isLoadingData.value = false
  }
})

const goBack = () => {
  if (isStudentRegistering.value) {
    // Aluno volta para a página de boas-vindas
    router.back()
  } else {
    // Professor volta para a lista de alunos
    router.push('/students')
  }
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

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'Por favor, preencha o nome do aluno.'
    return
  }

  if (!formData.value.cpf.trim()) {
    errorMessage.value = 'Por favor, preencha o CPF.'
    return
  }

  if (!validateCPF(formData.value.cpf)) {
    errorMessage.value = 'CPF inválido. Verifique e tente novamente.'
    return
  }

  if (!formData.value.birth_date) {
    errorMessage.value = 'Por favor, preencha a data de nascimento.'
    return
  }

  if (!validateBirthDate(formData.value.birth_date)) {
    errorMessage.value = 'Data de nascimento inválida. O aluno deve ter no mínimo 4 anos.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase
      .from('students')
      .insert({
        academy_id: academyId.value,
        name: formData.value.name.trim(),
        cpf: formData.value.cpf.replace(/\D/g, ''),
        birth_date: formData.value.birth_date,
        belt: formData.value.belt.trim() || null,
        gender: formData.value.gender.trim() || null,
        weight: formData.value.weight ? parseFloat(formData.value.weight) : null,
        category: formData.value.category.trim() || null,
        phone: formData.value.phone.trim() || null,
        guardian_phone: formData.value.guardian_phone.trim() || null,
        active: true
      })

    if (error) {
      if (error.code === '23505') {
        errorMessage.value = 'Este CPF já está cadastrado.'
      } else {
        errorMessage.value = 'Erro ao cadastrar aluno. Tente novamente.'
      }
      return
    }

    // Redirecionar conforme o tipo de usuário
    if (isStudentRegistering.value) {
      // Aluno vai para página de conclusão
      router.push({
        name: 'student-finish',
        query: {
          name: formData.value.name,
          academy: academyId.value
        }
      })
    } else {
      // Professor volta para lista de alunos
      router.push('/students')
    }
  } catch (error) {
    errorMessage.value = 'Erro inesperado. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Main Content -->
    <main class="w-full py-4 pb-24 md:py-8 md:pb-8">
      <div class="max-w-3xl mx-auto space-y-6 px-4 md:px-6">
        <Card>
          <CardHeader class="pb-4">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
                <UserPlus class="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <CardTitle class="text-xl md:text-2xl">Cadastrar Novo Aluno</CardTitle>
                <CardDescription class="text-xs md:text-sm">
                  {{ isStudentRegistering ? 'Preencha seus dados abaixo' : 'Preencha os dados do aluno abaixo' }}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Error Message -->
              <div v-if="errorMessage" class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle class="h-4 w-4 flex-shrink-0" />
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Dados Pessoais -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-base md:text-lg font-semibold">Dados Pessoais</h3>
                
                <div class="grid gap-4 md:grid-cols-2">
                  <!-- Nome -->
                  <div class="space-y-2 md:col-span-2">
                    <Label for="name">Nome Completo <span class="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      v-model="formData.name"
                      type="text"
                      placeholder="Ex: João Silva Santos"
                      required
                      :disabled="isLoading"
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
                      :disabled="isLoading"
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
                      :disabled="isLoading"
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
                      :disabled="isLoading"
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
                      :disabled="isLoading"
                    />
                  </div>
                </div>
              </div>

              <!-- Dados de Treino -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-base md:text-lg font-semibold">Dados de Treino</h3>
                
                <div class="grid gap-4 md:grid-cols-2">
                  <!-- Faixa -->
                  <div class="space-y-2">
                    <Label for="belt">Faixa</Label>
                    <div v-if="isLoadingData" class="h-10 bg-muted animate-pulse rounded-md"></div>
                    <select
                      v-else
                      id="belt"
                      v-model="formData.belt"
                      class="flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="isLoading || availableBelts.length === 0"
                    >
                      <option value="">{{ availableBelts.length === 0 ? 'Informe a data de nascimento' : 'Selecione...' }}</option>
                      <option v-for="belt in availableBelts" :key="belt" :value="belt">
                        {{ belt }}
                      </option>
                    </select>
                  </div>

                  <!-- Categoria (sugerida automaticamente, editável) -->
                  <div class="space-y-2">
                    <Label for="category">Categoria</Label>
                    <div v-if="isLoadingData" class="h-10 bg-muted animate-pulse rounded-md"></div>
                    <select
                      v-else
                      id="category"
                      v-model="formData.category"
                      class="flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="isLoading || availableCategories.length === 0"
                    >
                      <option value="">{{ availableCategories.length === 0 ? 'Informe gênero e data de nascimento' : 'Selecione...' }}</option>
                      <option v-for="category in availableCategories" :key="category" :value="category">
                        {{ category }}
                      </option>
                    </select>
                    <p v-if="!isLoadingData" class="text-xs text-muted-foreground">
                      Sugerida automaticamente, mas pode ser alterada
                    </p>
                  </div>
                </div>
              </div>

              <!-- Contatos -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-base md:text-lg font-semibold">Contatos</h3>
                
                <div class="grid gap-4 md:grid-cols-2">
                  <!-- Telefone -->
                  <div class="space-y-2">
                    <Label for="phone">Telefone</Label>
                    <Input
                      id="phone"
                      v-model="formData.phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      :disabled="isLoading"
                    />
                  </div>

                  <!-- Telefone do Responsável -->
                  <div class="space-y-2">
                    <Label for="guardian_phone">Telefone do Responsável</Label>
                    <Input
                      id="guardian_phone"
                      v-model="formData.guardian_phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      :disabled="isLoading"
                    />
                  </div>
                </div>
              </div>

            </form>
          </CardContent>
        </Card>

        <!-- Desktop Buttons -->
        <Card class="hidden md:block">
          <CardContent class="pt-6">
            <div class="flex gap-3">
              <Button type="button" variant="outline" @click="goBack" class="flex-1" :disabled="isLoading">
                {{ isStudentRegistering ? 'Voltar' : 'Cancelar' }}
              </Button>
              <Button @click="handleSubmit" class="flex-1" :disabled="isLoading">
                <span v-if="!isLoading" class="flex items-center gap-2">
                  <UserPlus class="h-4 w-4" />
                  {{ isStudentRegistering ? 'Finalizar Cadastro' : 'Cadastrar Aluno' }}
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isStudentRegistering ? 'Finalizando...' : 'Cadastrando...' }}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>

    <!-- Fixed Bottom Buttons (Mobile) -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-10">
      <div class="flex gap-2">
        <Button type="button" variant="outline" @click="goBack" class="flex-1" :disabled="isLoading">
          {{ isStudentRegistering ? 'Voltar' : 'Cancelar' }}
        </Button>
        <Button @click="handleSubmit" class="flex-1" :disabled="isLoading">
          <span v-if="!isLoading" class="flex items-center justify-center gap-2">
            <UserPlus class="h-4 w-4" />
            {{ isStudentRegistering ? 'Finalizar' : 'Cadastrar' }}
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
