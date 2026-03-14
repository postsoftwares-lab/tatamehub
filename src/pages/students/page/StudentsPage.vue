<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { ownerService } from '@/services/owner.service'
import { categoriesService, type AgeCategory, type Belt, type Gender, type WeightDivision } from '@/services/categories.service'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { ArrowLeft, Users, UserPlus, Copy, Check } from 'lucide-vue-next'
import Dialog from '@/components/ui/Dialog.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'
import DialogTitle from '@/components/ui/DialogTitle.vue'
import DialogDescription from '@/components/ui/DialogDescription.vue'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'

interface Student {
  id: string
  name: string
  cpf: string
  birth_date: string
  belt: string | null
  gender: string | null
  weight: number | null
  category: string | null
  phone: string | null
  guardian_phone: string | null
  active: boolean
  created_at: string
}

const router = useRouter()
const students = ref<Student[]>([])
const isLoading = ref(true)
const academyId = ref('')

// Dados de categorias
const belts = ref<Belt[]>([])
const genders = ref<Gender[]>([])
const ageCategories = ref<AgeCategory[]>([])
const weightDivisions = ref<WeightDivision[]>([])
const isLoadingFilters = ref(false)

// Search e Filter
const searchQuery = ref('')
const showFilterModal = ref(false)
const selectedGenders = ref<string[]>([])
const selectedAgeCategories = ref<string[]>([])
const selectedWeightDivisions = ref<string[]>([])
const selectedBelts = ref<string[]>([])

// Modal de copiar todos
const showCopyAllModal = ref(false)
const dataCopied = ref(false)
const hasActiveFilter = computed(() => {
  return searchQuery.value.trim() !== '' || selectedGenders.value.length > 0 || selectedAgeCategories.value.length > 0 || selectedWeightDivisions.value.length > 0 || selectedBelts.value.length > 0
})

// Dados filtrados baseado em search e filter
const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    // Filtro por nome (search)
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filtro por gênero
    const matchesGender = selectedGenders.value.length === 0 || selectedGenders.value.includes(student.gender || '')
    
    // Filtro por faixa
    const matchesBelt = selectedBelts.value.length === 0 || selectedBelts.value.includes(student.belt || '')
    
    // Filtro por categoria de idade (extraído da categoria - primeira parte antes do " - ")
    const matchesAgeCategory = selectedAgeCategories.value.length === 0 || selectedAgeCategories.value.some(ac => {
      const studentAgeCategory = student.category?.split(' - ')[0] || ''
      return studentAgeCategory === ac
    })
    
    // Filtro por divisão de peso (extraído da categoria - segunda parte após o " - ")
    const matchesWeightDivision = selectedWeightDivisions.value.length === 0 || selectedWeightDivisions.value.some(wd => {
      const studentWeightDivision = student.category?.split(' - ')[1] || ''
      return studentWeightDivision === wd
    })
    
    return matchesSearch && matchesGender && matchesBelt && matchesAgeCategory && matchesWeightDivision
  })
})

// Obter lista única de gêneros e categorias para o filtro
const availableGenders = computed(() => {
  const genders = new Set(students.value.map(s => s.gender).filter((g): g is string => g !== null && g !== undefined))
  return Array.from(genders).sort()
})

const availableCategories = computed(() => {
  const categories = new Set(students.value.map(s => s.category).filter((c): c is string => c !== null && c !== undefined))
  return Array.from(categories).sort()
})

const selectedFields = ref({
  name: true,
  cpf: false,
  birth_date: true,
  belt: true,
  gender: true,
  weight: true,
  category: true,
  phone: false,
  guardian_phone: false,
  confirmed: true
})

const fieldLabels = {
  name: 'Nome',
  cpf: 'CPF',
  birth_date: 'Data de Nascimento',
  belt: 'Faixa',
  gender: 'Gênero',
  weight: 'Peso',
  category: 'Categoria',
  phone: 'Telefone',
  guardian_phone: 'Telefone do Responsável',
  confirmed: 'Confirmado'
}

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
  
  // Carregar dados de categorias
  try {
    isLoadingFilters.value = true
    const [beltsData, gendersData, ageCatsData, weightDivsData] = await Promise.all([
      categoriesService.getBelts(),
      categoriesService.getGenders(),
      categoriesService.getAgeCategories(),
      categoriesService.getWeightDivisions()
    ])
    
    belts.value = beltsData
    genders.value = gendersData
    ageCategories.value = ageCatsData
    weightDivisions.value = weightDivsData
  } catch (error) {
    console.error('Erro ao carregar dados de categorias:', error)
  } finally {
    isLoadingFilters.value = false
  }
  
  await loadStudents()
})

const loadStudents = async () => {
  isLoading.value = true
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('academy_id', academyId.value)
    .eq('active', true)
    .order('name', { ascending: true })

  if (!error && data) {
    students.value = data
  }
  
  isLoading.value = false
}

const goBack = () => {
  router.push('/dashboard')
}

const calculateAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const openCopyAllModal = () => {
  dataCopied.value = false
  showCopyAllModal.value = true
}

const closeCopyAllModal = () => {
  showCopyAllModal.value = false
  dataCopied.value = false
}

const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '')
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const toggleGender = (gender: string) => {
  const index = selectedGenders.value.indexOf(gender)
  if (index > -1) {
    selectedGenders.value.splice(index, 1)
  } else {
    selectedGenders.value.push(gender)
  }
}

const toggleBelt = (belt: string) => {
  const index = selectedBelts.value.indexOf(belt)
  if (index > -1) {
    selectedBelts.value.splice(index, 1)
  } else {
    selectedBelts.value.push(belt)
  }
}

const toggleAgeCategory = (ageCategory: string) => {
  const index = selectedAgeCategories.value.indexOf(ageCategory)
  if (index > -1) {
    selectedAgeCategories.value.splice(index, 1)
  } else {
    selectedAgeCategories.value.push(ageCategory)
  }
}

const toggleWeightDivision = (weightDivision: string) => {
  const index = selectedWeightDivisions.value.indexOf(weightDivision)
  if (index > -1) {
    selectedWeightDivisions.value.splice(index, 1)
  } else {
    selectedWeightDivisions.value.push(weightDivision)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedGenders.value = []
  selectedAgeCategories.value = []
  selectedWeightDivisions.value = []
  selectedBelts.value = []
}

const copyAllData = async () => {
  const selectedFieldKeys = Object.keys(selectedFields.value).filter(
    (key) => selectedFields.value[key as keyof typeof selectedFields.value]
  )

  if (selectedFieldKeys.length === 0) return

  // Formatar dados dos alunos filtrados com layout legível
  const formattedData = filteredStudents.value.map((student) => {
    const lines: string[] = []
    
    // Adicionar nome como primeira linha
    lines.push(student.name)
    
    // Adicionar outros campos selecionados
    selectedFieldKeys.forEach((field) => {
      if (field === 'name') return // Nome já foi adicionado
      
      let value = ''
      if (field === 'cpf') {
        value = formatCPF(student.cpf)
      } else if (field === 'birth_date') {
        value = formatDate(student.birth_date)
      } else if (field === 'belt') {
        value = student.belt || ''
      } else if (field === 'gender') {
        value = student.gender || ''
      } else if (field === 'weight') {
        value = student.weight ? student.weight.toString() : ''
      } else if (field === 'category') {
        value = student.category || ''
      } else if (field === 'phone') {
        value = student.phone || ''
      } else if (field === 'guardian_phone') {
        value = student.guardian_phone || ''
      } else if (field === 'confirmed') {
        value = 'Confirmado: ❌'
      }
      
      if (value) {
        lines.push(value)
      }
    })
    
    return lines.join('\n')
  })

  // Juntar alunos com espaçamento (duas quebras de linha)
  const textToCopy = formattedData.join('\n\n')

  try {
    await navigator.clipboard.writeText(textToCopy)
    dataCopied.value = true
    // Fechar modal após 1 segundo
    setTimeout(() => {
      closeCopyAllModal()
    }, 1000)
  } catch (err) {
    console.error('Erro ao copiar dados:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Header -->
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="sm" @click="goBack" class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          Voltar
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full py-6 md:py-8">
      <div class="max-w-7xl mx-auto space-y-6 px-4 md:px-6">
        <!-- Empty State -->
        <div v-if="!isLoading && students.length === 0" class="flex flex-col items-center justify-center py-16">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <Users class="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Nenhum aluno cadastrado</h3>
          <p class="text-muted-foreground text-center mb-6 max-w-md">
            Você ainda não possui alunos ativos cadastrados na sua academia.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Button variant="outline" @click="goBack" class="flex-1">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Button @click="router.push('/students/new')" class="flex-1">
              <UserPlus class="h-4 w-4 mr-2" />
              Cadastrar Aluno
            </Button>
          </div>
        </div>

        <!-- Students List Header -->
        <div v-if="!isLoading && students.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Lista de Alunos</h2>
            <div class="flex gap-2">
              <Button size="sm" @click="openCopyAllModal" class="gap-2">
                <Copy class="h-4 w-4" />
                <span class="hidden sm:inline">Copiar Todos</span>
              </Button>
              <Button size="sm" @click="router.push('/students/new')" class="gap-2">
                <UserPlus class="h-4 w-4" />
                <span class="hidden sm:inline">Novo Aluno</span>
              </Button>
            </div>
          </div>

          <!-- Search e Filter -->
          <div class="space-y-3">
            <div class="space-y-2">
              <Label for="search-students">Buscar por Nome</Label>
              <div class="flex gap-2">
                <Input
                  id="search-students"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Ex: João Silva"
                  class="flex-1"
                />
                <Button @click="openFilterModal" variant="outline" class="gap-2 h-10 px-3">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span class="hidden sm:inline">Filtrar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State - No Results with Active Filter -->
        <div v-if="!isLoading && students.length > 0 && filteredStudents.length === 0 && hasActiveFilter" class="flex flex-col items-center justify-center py-16">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <svg class="h-10 w-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Nenhum aluno encontrado</h3>
          <p class="text-muted-foreground text-center mb-6 max-w-md">
            Nenhum aluno corresponde aos filtros selecionados. Tente ajustar os critérios de busca.
          </p>
          <Button @click="clearFilters" class="gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar Filtros
          </Button>
        </div>

        <!-- Mobile Cards View -->
        <div v-if="!isLoading && filteredStudents.length > 0" class="flex flex-col gap-3 md:hidden">
          <Card 
            v-for="student in filteredStudents" 
            :key="student.id"
            class="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] overflow-hidden"
            @click="router.push(`/students/${student.id}`)"
          >
            <CardContent class="p-3">
              <div class="flex items-start justify-between gap-1.5 min-w-0">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-sm truncate leading-tight">{{ student.name }}</h3>
                  
                  <div class="flex flex-col gap-1.5 mt-2">
                    <div class="flex items-center gap-1 text-xs">
                      <svg class="h-3 w-3 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-muted-foreground">{{ calculateAge(student.birth_date) }} anos</span>
                    </div>
                    
                    <div v-if="student.phone || student.guardian_phone" class="flex items-center gap-1 text-xs min-w-0">
                      <svg class="h-3 w-3 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span class="text-muted-foreground truncate">{{ student.phone || student.guardian_phone }}</span>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span v-if="student.belt" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary truncate">
                      {{ student.belt }}
                    </span>
                    <span v-if="student.category" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground truncate">
                      {{ student.category }}
                    </span>
                  </div>
                </div>
                
                <svg class="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Desktop Table View -->
        <Card v-if="!isLoading && filteredStudents.length > 0" class="hidden md:block">
          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b bg-muted/50">
                    <th class="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Nome</th>
                    <th class="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Idade</th>
                    <th class="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Faixa</th>
                    <th class="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Categoria</th>
                    <th class="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="student in filteredStudents" 
                    :key="student.id"
                    class="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    @click="router.push(`/students/${student.id}`)"
                  >
                    <td class="py-3 px-4">
                      <div class="font-medium">{{ student.name }}</div>
                      <div class="text-xs text-muted-foreground">{{ student.cpf }}</div>
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {{ calculateAge(student.birth_date) }} anos
                    </td>
                    <td class="py-3 px-4">
                      <span v-if="student.belt" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {{ student.belt }}
                      </span>
                      <span v-else class="text-sm text-muted-foreground">-</span>
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {{ student.category || '-' }}
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {{ student.phone || student.guardian_phone || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <div class="flex flex-col items-center gap-4">
            <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-muted-foreground">Carregando alunos...</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Overlay Escuro -->
    <div 
      v-if="showCopyAllModal" 
      class="fixed inset-0 bg-black/80 backdrop-blur-sm"
      style="z-index: 9998;"
    ></div>

    <!-- Modal de Copiar Todos -->
    <Dialog :open="showCopyAllModal" @update:open="closeCopyAllModal">
      <DialogContent class="w-[calc(100%-2rem)] sm:max-w-md m-4 sm:m-0 mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Copiar Dados dos Alunos</DialogTitle>
          <DialogDescription>
            Selecione quais dados você deseja copiar
          </DialogDescription>
        </DialogHeader>

        <!-- Alerta de Filtro Ativo -->
        <div v-if="hasActiveFilter" class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3">
          <p class="text-sm text-blue-900 dark:text-blue-100">
            <span class="font-semibold">Filtro ativo:</span> Serão copiados apenas {{ filteredStudents.length }} aluno(s)
          </p>
        </div>

        <div class="space-y-4 py-4">
          <!-- Checkboxes para seleção de campos -->
          <div class="space-y-3">
            <div v-for="(label, field) in fieldLabels" :key="field" class="flex items-center gap-3">
              <input
                type="checkbox"
                :id="`field-${field}`"
                v-model="selectedFields[field as keyof typeof selectedFields]"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <Label :for="`field-${field}`" class="cursor-pointer text-sm">
                {{ label }}
              </Label>
            </div>
          </div>

          <!-- Botão de copiar -->
          <Button 
            @click="copyAllData" 
            :disabled="dataCopied || Object.values(selectedFields).every(v => !v)"
            class="w-full gap-2"
            :variant="dataCopied ? 'secondary' : 'default'"
          >
            <Check v-if="dataCopied" class="h-4 w-4" />
            <Copy v-else class="h-4 w-4" />
            {{ dataCopied ? 'Dados Copiados!' : 'Copiar Dados' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Overlay Escuro para Modal de Filtro -->
    <div 
      v-if="showFilterModal" 
      class="fixed inset-0 bg-black/80 backdrop-blur-sm"
      style="z-index: 9998;"
    ></div>

    <!-- Modal de Filtro -->
    <Dialog :open="showFilterModal" @update:open="closeFilterModal">
      <DialogContent class="w-[calc(100%-2rem)] sm:max-w-md m-4 sm:m-0 mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtrar Alunos</DialogTitle>
          <DialogDescription>
            Selecione os critérios de filtro
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-6 py-4">
          <!-- Filtro por Gênero -->
          <div class="space-y-3">
            <h3 class="font-semibold text-sm">Gênero</h3>
            <div v-if="availableGenders.length === 0" class="text-sm text-muted-foreground">
              Nenhum gênero disponível
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="gender in availableGenders"
                :key="gender"
                @click="toggleGender(gender)"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                  selectedGenders.includes(gender)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                {{ gender }}
              </button>
            </div>
          </div>

          <!-- Filtro por Faixa -->
          <div class="space-y-3">
            <h3 class="font-semibold text-sm">Faixa</h3>
            <div v-if="belts.length === 0" class="text-sm text-muted-foreground">
              Nenhuma faixa disponível
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="belt in belts"
                :key="belt.id"
                @click="toggleBelt(belt.name)"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                  selectedBelts.includes(belt.name)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                {{ belt.name }}
              </button>
            </div>
          </div>

          <!-- Filtro por Categoria de Idade -->
          <div class="space-y-3">
            <h3 class="font-semibold text-sm">Categoria de Idade</h3>
            <div v-if="ageCategories.length === 0" class="text-sm text-muted-foreground">
              Nenhuma categoria de idade disponível
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="ageCategory in ageCategories"
                :key="ageCategory.id"
                @click="toggleAgeCategory(ageCategory.name)"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                  selectedAgeCategories.includes(ageCategory.name)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                {{ ageCategory.name }} ({{ ageCategory.min_age }}-{{ ageCategory.max_age }})
              </button>
            </div>
          </div>

          <!-- Filtro por Divisão de Peso -->
          <div class="space-y-3">
            <h3 class="font-semibold text-sm">Divisão de Peso</h3>
            <div v-if="weightDivisions.length === 0" class="text-sm text-muted-foreground">
              Nenhuma divisão de peso disponível
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="division in weightDivisions"
                :key="division.id"
                @click="toggleWeightDivision(division.name)"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                  selectedWeightDivisions.includes(division.name)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                {{ division.name }}
              </button>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex gap-2 pt-4">
            <Button 
              @click="clearFilters" 
              variant="outline" 
              class="flex-1"
            >
              Limpar Filtros
            </Button>
            <Button 
              @click="closeFilterModal" 
              class="flex-1"
            >
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
