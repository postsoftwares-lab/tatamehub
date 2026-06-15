<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const { token } = useAuth()
const router = useRouter()

interface Student {
  id: string
  name: string
  phone: string
  cpf: string
  date_of_birth: string
  category: string
  address: string
  neighborhood: string
  enrollment_date: string
  emergency_contact_name: string
  emergency_contact_phone: string
  belt: string
  graduation_date: string
  status: boolean
  created_at: string
}

interface CopyModalState {
  open: boolean
  type: 'all' | 'single'
  studentId?: string
}

const students = ref<Student[]>([])
const total = ref(0)
const loading = ref(true)
const expandedId = ref<string | null>(null)
const academyId = ref<string | null>(null)

const copyModal = ref<CopyModalState>({ open: false, type: 'all' })
const copyFields = ref({
  name: true,
  phone: false,
  cpf: false,
  date_of_birth: false,
  category: false,
  address: false,
  neighborhood: false,
  enrollment_date: false,
  belt: false,
  graduation_date: false,
  confirmado: true,
})
const copyToastShow = ref(false)

async function fetchProfile() {
  try {
    const res = await apiFetch('/profile', {}, token.value)
    if (res.data.teacher?.academy?.id) {
      academyId.value = res.data.teacher.academy.id
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchStudents() {
  loading.value = true
  try {
    const res = await apiFetch('/list-students', {}, token.value)
    students.value = res.data.students
    total.value = res.data.total
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToRegisterStudent() {
  if (academyId.value) {
    router.push({
      name: 'register-student',
      params: { academy_id: academyId.value },
      query: { internal: 'true' },
    })
  }
}

const beltMap: Record<string, { pill: string; dot: string; label: string }> = {
  gray:   { pill: 'bg-gray-500/10 text-gray-400 border-gray-500/20',     dot: 'bg-gray-400',    label: 'Cinza'   },
  yellow: { pill: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400', label: 'Amarela' },
  orange: { pill: 'bg-orange-500/10 text-orange-400 border-orange-500/20', dot: 'bg-orange-400', label: 'Laranja' },
  green:  { pill: 'bg-green-500/10 text-green-400 border-green-500/20',   dot: 'bg-green-400',   label: 'Verde'   },
  white:  { pill: 'bg-white/8 text-slate-300 border-white/12',         dot: 'bg-slate-300',  label: 'Branca'  },
  blue:   { pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   dot: 'bg-blue-400',   label: 'Azul'    },
  purple: { pill: 'bg-purple-500/10 text-purple-400 border-purple-400/20', dot: 'bg-purple-400', label: 'Roxa' },
  brown:  { pill: 'bg-orange-900/20 text-orange-500 border-orange-700/20', dot: 'bg-orange-600', label: 'Marrom' },
  black:  { pill: 'bg-slate-700/20 text-slate-400 border-slate-600/20', dot: 'bg-slate-400',  label: 'Preta'  },
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function formatPhone(phone: string) {
  const n = phone.replace(/\D/g, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return phone
}

function formatCpf(cpf: string) {
  const n = cpf.replace(/\D/g, '')
  if (n.length === 11) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`
  return cpf
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function openCopyModal(type: 'all' | 'single' = 'all', studentId?: string) {
  copyModal.value = { open: true, type, studentId }
}

function closeCopyModal() {
  copyModal.value = { open: false, type: 'all' }
}

function getFieldLabel(field: keyof typeof copyFields.value): string {
  const labels: Record<string, string> = {
    name: 'Nome',
    phone: 'Telefone',
    cpf: 'CPF',
    date_of_birth: 'Data de nascimento',
    category: 'Categoria',
    address: 'Endereço',
    neighborhood: 'Bairro',
    enrollment_date: 'Data de ingresso',
    belt: 'Faixa',
    graduation_date: 'Data de graduação',
    confirmado: 'Confirmado',
  }
  return labels[field] || field
}

function getFieldEmoji(field: string): string {
  const emojis: Record<string, string> = {
    name: '',
    phone: '',
    cpf: '',
    date_of_birth: '',
    belt: '',
    confirmado: '',
  }
  return emojis[field] || ''
}

function getFieldDisplayValue(field: string, student: Student, value: any): string {
  if (field === 'confirmado') {
    return value === true ? 'Confirmado: ✅' : 'Confirmado: ❌'
  }
  if (field === 'date_of_birth' || field === 'enrollment_date' || field === 'graduation_date') {
    return value ? formatDate(value) : '-'
  }
  if (field === 'phone') {
    return formatPhone(value)
  }
  if (field === 'cpf') {
    return formatCpf(value)
  }
  if (field === 'belt') {
    return beltMap[value]?.label || value
  }
  return value || '-'
}

function buildCopyText(): string {
  const selectedFields = Object.entries(copyFields.value)
    .filter(([, checked]) => checked)
    .map(([field]) => field)

  if (selectedFields.length === 0) return ''

  if (copyModal.value.type === 'single' && copyModal.value.studentId) {
    const student = students.value.find((s) => s.id === copyModal.value.studentId)
    if (!student) return ''

    let text = ''
    selectedFields.forEach((field) => {
      const displayValue = getFieldDisplayValue(
        field,
        student,
        field === 'confirmado' ? true : student[field as keyof Student],
      )

      if (field === 'confirmado') {
        text += `\n${displayValue}\n`
      } else {
        text += `${displayValue}\n`
      }
    })
    return text.trim()
  }

  // All students
  let text = ''
  students.value.forEach((student, idx) => {
    selectedFields.forEach((field) => {
      const displayValue = getFieldDisplayValue(
        field,
        student,
        field === 'confirmado' ? true : student[field as keyof Student],
      )

      if (field === 'confirmado') {
        text += `\n${displayValue}\n`
      } else {
        text += `${displayValue}\n`
      }
    })
    if (idx < students.value.length - 1) {
      text += '\n' // Blank line between students
    }
  })
  return text.trim()
}

async function copyToClipboard() {
  const text = buildCopyText()
  if (!text) return

  await navigator.clipboard.writeText(text)
  copyToastShow.value = true
  setTimeout(() => (copyToastShow.value = false), 2000)
  closeCopyModal()
}

onMounted(() => {
  fetchProfile()
  fetchStudents()
})
</script>

<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 class="text-[20px] font-semibold text-foreground tracking-tight">Alunos</h1>
          <p class="text-sm text-muted-foreground mt-0.5">
            Total: <span class="font-semibold text-foreground">{{ total }}</span>
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Register student button -->
          <button
            @click="goToRegisterStudent"
            class="h-9 px-4 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-2 text-[13px] font-medium"
            title="Cadastrar aluno manualmente"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            <span class="hidden sm:inline">Cadastrar</span>
          </button>

          <!-- Copy all button -->
          <button
            @click="openCopyModal('all')"
            class="shrink-0 h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center"
            title="Copiar dados de todos os alunos"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-16 flex items-center justify-center">
        <svg class="animate-spin w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="students.length === 0" class="py-16 flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted-foreground">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-foreground">Nenhum aluno cadastrado</p>
          <p class="text-xs text-muted-foreground mt-0.5">Compartilhe o link de cadastro no perfil</p>
        </div>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="student in students"
          :key="student.id"
          class="bg-card border border-border rounded-xl overflow-hidden transition-all"
        >
          <!-- Collapsed header (always visible) -->
          <button
            @click="toggleExpand(student.id)"
            class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left"
          >
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-[12px] font-bold text-muted-foreground">
              {{ getInitials(student.name) }}
            </div>

            <!-- Name + belt -->
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-medium text-foreground truncate">{{ student.name }}</p>
              <template v-if="beltMap[student.belt]">
                <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-1" :class="beltMap[student.belt]!.pill">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="beltMap[student.belt]!.dot" />
                  {{ beltMap[student.belt]!.label }}
                </span>
              </template>
            </div>

            <!-- Expand icon -->
            <div class="shrink-0 text-muted-foreground">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="{ 'rotate-180': expandedId === student.id }"
                class="transition-transform"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          <!-- Expanded details -->
          <div
            v-show="expandedId === student.id"
            class="border-t border-border px-4 py-3.5 bg-secondary/20 space-y-3"
          >
            <!-- Dados pessoais -->
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Dados pessoais</p>
              <div class="space-y-2">
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Telefone</span>
                  <span class="text-[12px] text-foreground font-medium">{{ formatPhone(student.phone) }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">CPF</span>
                  <span class="text-[12px] text-foreground font-medium">{{ formatCpf(student.cpf) }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Data de nascimento</span>
                  <span class="text-[12px] text-foreground font-medium">{{ formatDate(student.date_of_birth) }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Categoria</span>
                  <span class="text-[12px] text-foreground font-medium">{{ student.category || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Endereço -->
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Endereço</p>
              <div class="space-y-2">
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Rua</span>
                  <span class="text-[12px] text-foreground font-medium">{{ student.address || '-' }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Bairro</span>
                  <span class="text-[12px] text-foreground font-medium">{{ student.neighborhood || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Datas -->
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Datas</p>
              <div class="space-y-2">
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Ingresso</span>
                  <span class="text-[12px] text-foreground font-medium">{{ student.enrollment_date ? formatDate(student.enrollment_date) : '-' }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Graduação</span>
                  <span class="text-[12px] text-foreground font-medium">{{ student.graduation_date ? formatDate(student.graduation_date) : '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Contato de emergência -->
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Contato de emergência</p>
              <div class="space-y-2">
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Nome</span>
                  <span class="text-[12px] text-foreground font-medium">{{ student.emergency_contact_name }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-[12px] text-muted-foreground">Telefone</span>
                  <span class="text-[12px] text-foreground font-medium">{{ formatPhone(student.emergency_contact_phone) }}</span>
                </div>
              </div>
            </div>

            <!-- Copy button -->
            <button
              @click="openCopyModal('single', student.id)"
              class="mt-4 w-full h-9 flex items-center justify-center gap-2 text-[13px] font-medium rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              Copiar dados
            </button>
          </div>
        </div>
      </div>

      <!-- ── Copy Modal ── -->
      <div
        v-if="copyModal.open"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
        @click.self="closeCopyModal"
      >
        <div class="bg-card border border-border rounded-2xl w-full max-w-sm my-auto">
          <!-- Header -->
          <div class="border-b border-border px-5 py-4 flex items-center justify-between">
            <h2 class="text-[16px] font-semibold text-foreground">
              Selecione os campos para copiar
            </h2>
            <button
              @click="closeCopyModal"
              class="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Checkboxes -->
          <div class="px-5 py-4 space-y-3 max-h-[40vh] overflow-y-auto">
            <label
              v-for="(_, field) in copyFields"
              :key="field"
              class="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 px-2 py-1.5 rounded-lg transition-colors"
            >
              <input
                v-model="copyFields[field as keyof typeof copyFields]"
                type="checkbox"
                class="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span class="text-[13px] text-foreground">{{ getFieldLabel(field as keyof typeof copyFields) }}</span>
            </label>
          </div>

          <!-- Footer -->
          <div class="border-t border-border px-5 py-4 flex gap-2">
            <button
              @click="closeCopyModal"
              class="flex-1 h-9 rounded-lg border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="copyToClipboard"
              class="flex-1 h-9 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              Copiar
            </button>
          </div>
        </div>
      </div>

      <!-- ── Toast ── -->
      <div
        v-if="copyToastShow"
        class="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 bg-green-500/10 border border-green-500/25 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 text-[13px] font-medium animate-in fade-in slide-in-from-bottom-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Copiado para a área de transferência!
      </div>
    </div>
  </AppLayout>
</template>
