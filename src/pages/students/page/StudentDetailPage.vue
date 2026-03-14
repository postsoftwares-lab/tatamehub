<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
import { ArrowLeft, Edit, Save, X, AlertCircle, User } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const studentId = route.params.id as string

const academyId = ref('')
const isLoading = ref(true)
const isLoadingData = ref(true)
const isSaving = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')

// Dados do Supabase
const ageCategories = ref<AgeCategory[]>([])
const genders = ref<Gender[]>([])
const ageCategoryBelts = ref<AgeCategoryBelt[]>([])
const weightCategories = ref<WeightCategory[]>([])

// Dados originais do aluno
const originalStudent = ref({
  id: '',
  name: '',
  cpf: '',
  birth_date: '',
  belt: '',
  gender: '',
  gender_id: 0,
  weight: '',
  category: '',
  phone: '',
  guardian_phone: '',
  active: true,
  created_at: ''
})

// Dados editáveis
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

// Computed para faixas disponíveis
const availableBelts = computed(() => {
  if (!formData.value.birth_date || isLoadingData.value) return []
  
  const ageCategory = categoriesService.calculateAgeCategory(formData.value.birth_date, ageCategories.value)
  if (!ageCategory) return []
  
  return categoriesService.getBeltsForAgeCategory(ageCategory.id, ageCategoryBelts.value)
})

// Computed para categorias disponíveis
const availableCategories = computed(() => {
  if (!formData.value.gender_id || !formData.value.birth_date || isLoadingData.value) return []
  
  return categoriesService.getAvailableCategories(
    formData.value.birth_date,
    formData.value.gender_id,
    ageCategories.value,
    weightCategories.value
  )
})

// Calcular idade
const calculateAge = computed(() => {
  if (!originalStudent.value.birth_date) return 0
  const today = new Date()
  const birth = new Date(originalStudent.value.birth_date)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
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
  if (isEditing.value) {
    calculateCategory()
  }
})

// Watch para resetar faixa se não estiver disponível
watch(() => formData.value.birth_date, () => {
  if (isEditing.value && formData.value.belt && !availableBelts.value.includes(formData.value.belt)) {
    formData.value.belt = ''
  }
})

// Watch para atualizar gender_id quando gender mudar
watch(() => formData.value.gender, (newGender) => {
  if (isEditing.value) {
    const gender = genders.value.find(g => g.name === newGender)
    formData.value.gender_id = gender ? gender.id : 0
  }
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

    originalStudent.value = {
      ...data,
      weight: data.weight?.toString() || '',
      gender_id: genders.value.find(g => g.name === data.gender)?.id || 0
    }

    // Copiar para formData
    formData.value = {
      name: data.name,
      cpf: data.cpf,
      birth_date: data.birth_date,
      belt: data.belt || '',
      gender: data.gender || '',
      gender_id: genders.value.find(g => g.name === data.gender)?.id || 0,
      weight: data.weight?.toString() || '',
      category: data.category || '',
      phone: data.phone || '',
      guardian_phone: data.guardian_phone || ''
    }
  } catch (error) {
    console.error('Erro ao carregar aluno:', error)
    errorMessage.value = 'Erro ao carregar dados do aluno.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/students')
}

const enableEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // Restaurar dados originais
  formData.value = {
    name: originalStudent.value.name,
    cpf: originalStudent.value.cpf,
    birth_date: originalStudent.value.birth_date,
    belt: originalStudent.value.belt,
    gender: originalStudent.value.gender,
    gender_id: originalStudent.value.gender_id,
    weight: originalStudent.value.weight,
    category: originalStudent.value.category,
    phone: originalStudent.value.phone,
    guardian_phone: originalStudent.value.guardian_phone
  }
  errorMessage.value = ''
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
        belt: formData.value.belt.trim() || null,
        gender: formData.value.gender.trim() || null,
        weight: formData.value.weight ? parseFloat(formData.value.weight) : null,
        category: formData.value.category.trim() || null,
        phone: formData.value.phone.trim() || null,
        guardian_phone: formData.value.guardian_phone.trim() || null
      })
      .eq('id', studentId)
      .eq('academy_id', academyId.value)

    if (error) {
      if (error.code === '23505') {
        errorMessage.value = 'Este CPF já está cadastrado.'
      } else {
        errorMessage.value = 'Erro ao atualizar aluno. Tente novamente.'
      }
      return
    }

    // Atualizar dados originais
    await loadStudent()
    isEditing.value = false
  } catch (error) {
    errorMessage.value = 'Erro inesperado. Tente novamente.'
  } finally {
    isSaving.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
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
      <div class="max-w-4xl mx-auto px-4 md:px-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <Card>
            <CardHeader>
              <div class="h-8 w-48 bg-muted animate-pulse rounded"></div>
              <div class="h-4 w-32 bg-muted animate-pulse rounded mt-2"></div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="h-10 bg-muted animate-pulse rounded"></div>
              <div class="h-10 bg-muted animate-pulse rounded"></div>
              <div class="h-10 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>

        <!-- Student Details -->
        <div v-else class="space-y-6">
          <!-- Error Message -->
          <div v-if="errorMessage" class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle class="h-4 w-4 flex-shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Header Card -->
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
                  <User class="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div class="flex-1 min-w-0">
                  <CardTitle class="text-xl md:text-2xl font-bold truncate leading-tight">{{ originalStudent.name }}</CardTitle>
                  <CardDescription class="text-sm md:text-sm mt-1 font-medium">
                    {{ calculateAge }} anos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <!-- Dados Pessoais -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base md:text-lg">Dados Pessoais</CardTitle>
                <Button variant="ghost" size="sm" @click="router.push(`/students/${studentId}/edit/personal`)" class="gap-1">
                  <Edit class="h-3.5 w-3.5" />
                  <span class="text-xs">Editar</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid gap-3 md:gap-4 md:grid-cols-2">
                <div class="space-y-2 md:col-span-2">
                  <Label class="text-xs text-muted-foreground">Nome Completo</Label>
                  <p class="text-base md:text-sm font-semibold">{{ originalStudent.name }}</p>
                </div>

                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">CPF</Label>
                  <p class="text-base md:text-sm font-medium">{{ formatCPF(originalStudent.cpf) }}</p>
                </div>

                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Data de Nascimento</Label>
                  <p class="text-base md:text-sm font-medium">{{ formatDate(originalStudent.birth_date) }}</p>
                </div>

                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Gênero</Label>
                  <p class="text-base md:text-sm font-medium">{{ originalStudent.gender || '-' }}</p>
                </div>

                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Peso</Label>
                  <p class="text-base md:text-sm font-medium">{{ originalStudent.weight ? `${originalStudent.weight} kg` : '-' }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Dados de Treino -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base md:text-lg">Dados de Treino</CardTitle>
                <Button variant="ghost" size="sm" @click="router.push(`/students/${studentId}/edit/category`)" class="gap-1">
                  <Edit class="h-3.5 w-3.5" />
                  <span class="text-xs">Editar</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid gap-3 md:gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Faixa</Label>
                  <p class="text-base md:text-sm font-semibold">{{ originalStudent.belt || '-' }}</p>
                </div>

                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Categoria</Label>
                  <p class="text-base md:text-sm font-semibold">{{ originalStudent.category || '-' }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Contatos -->
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base md:text-lg">Contatos</CardTitle>
                <Button variant="ghost" size="sm" @click="router.push(`/students/${studentId}/edit/contacts`)" class="gap-1">
                  <Edit class="h-3.5 w-3.5" />
                  <span class="text-xs">Editar</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid gap-3 md:gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Telefone</Label>
                  <p class="text-base md:text-sm font-medium">{{ originalStudent.phone || '-' }}</p>
                </div>

                <div class="space-y-2">
                  <Label class="text-xs text-muted-foreground">Telefone do Responsável</Label>
                  <p class="text-base md:text-sm font-medium">{{ originalStudent.guardian_phone || '-' }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
