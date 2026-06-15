<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api/client'

const route = useRoute()
const router = useRouter()
const academyId = computed(() => route.params.academy_id as string)
const isInternal = computed(() => route.query.internal === 'true')

function getTodayDate(): string {
  const today = new Date()
  return today.toISOString().split('T')[0] ?? ''
}

const form = ref({
  name: '',
  phone: '',
  cpf: '',
  date_of_birth: '',
  category: '',
  address: '',
  neighborhood: '',
  enrollment_date: getTodayDate(),
  emergency_contact_name: '',
  emergency_contact_phone: '',
  belt: 'white',
  graduation_date: '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const categories = [
  { value: 'Mirim', label: 'Mirim (4-7 anos)' },
  { value: 'Infantil', label: 'Infantil (8-11 anos)' },
  { value: 'Infanto-Juvenil', label: 'Infanto-Juvenil (12-15 anos)' },
  { value: 'Juvenil', label: 'Juvenil (16-17 anos)' },
  { value: 'Adulto', label: 'Adulto (18-29 anos)' },
  { value: 'Master', label: 'Master (30+ anos)' },
]

function calculateCategory(dateOfBirth: string): string {
  if (!dateOfBirth) return ''
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  if (age >= 4 && age <= 7) return 'Mirim'
  if (age >= 8 && age <= 11) return 'Infantil'
  if (age >= 12 && age <= 15) return 'Infanto-Juvenil'
  if (age >= 16 && age <= 17) return 'Juvenil'
  if (age >= 18 && age <= 29) return 'Adulto'
  if (age >= 30) return 'Master'
  return ''
}

const belts = [
  { value: 'white',  label: 'Branca',  color: '#f8fafc', border: '#94a3b8' },
  { value: 'gray',   label: 'Cinza',   color: '#9ca3af', border: '#9ca3af' },
  { value: 'yellow', label: 'Amarela', color: '#eab308', border: '#eab308' },
  { value: 'orange', label: 'Laranja', color: '#f97316', border: '#f97316' },
  { value: 'green',  label: 'Verde',   color: '#22c55e', border: '#22c55e' },
  { value: 'blue',   label: 'Azul',    color: '#3b82f6', border: '#3b82f6' },
  { value: 'purple', label: 'Roxa',    color: '#a855f7', border: '#a855f7' },
  { value: 'brown',  label: 'Marrom',  color: '#92400e', border: '#b45309' },
  { value: 'black',  label: 'Preta',   color: '#1e293b', border: '#475569' },
]

function formatPhone(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 2) return nums
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`
}

function formatCpf(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9, 11)}`
}

function onPhoneInput(e: Event, field: 'phone' | 'emergency_contact_phone') {
  const input = (e.target as HTMLInputElement).value
  const nums = input.replace(/\D/g, '')

  // Rejeita se tiver mais de 11 dígitos
  if (nums.length > 11) {
    form.value[field] = formatPhone(nums.slice(0, 11))
    return
  }

  form.value[field] = formatPhone(input)
}

function onCpfInput(e: Event) {
  const input = (e.target as HTMLInputElement).value
  const nums = input.replace(/\D/g, '')

  // Rejeita se tiver mais de 11 dígitos
  if (nums.length > 11) {
    form.value.cpf = formatCpf(nums.slice(0, 11))
    return
  }

  form.value.cpf = formatCpf(input)
}

function onDateOfBirthChange() {
  form.value.category = calculateCategory(form.value.date_of_birth)
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  const phone = form.value.phone.replace(/\D/g, '')
  const cpf = form.value.cpf.replace(/\D/g, '')
  const emergencyPhone = form.value.emergency_contact_phone.replace(/\D/g, '')

  if (!form.value.name || form.value.name.length > 150) {
    error.value = 'Nome inválido (máx 150 caracteres)'
    loading.value = false
    return
  }
  if (phone.length !== 11) {
    error.value = 'Telefone deve ter 11 dígitos'
    loading.value = false
    return
  }
  if (form.value.cpf && cpf.length !== 11) {
    error.value = 'CPF deve ter 11 dígitos'
    loading.value = false
    return
  }
  if (form.value.address && form.value.address.length > 200) {
    error.value = 'Endereço muito longo (máx 200 caracteres)'
    loading.value = false
    return
  }
  if (form.value.neighborhood && form.value.neighborhood.length > 100) {
    error.value = 'Bairro muito longo (máx 100 caracteres)'
    loading.value = false
    return
  }
  if (form.value.emergency_contact_name && form.value.emergency_contact_name.length > 150) {
    error.value = 'Nome do contato muito longo (máx 150 caracteres)'
    loading.value = false
    return
  }
  if (form.value.emergency_contact_phone && emergencyPhone.length !== 11) {
    error.value = 'Telefone do contato deve ter 11 dígitos'
    loading.value = false
    return
  }

  try {
    const payload: any = {
      academy_id: academyId.value,
      name: form.value.name,
      phone,
      cpf,
      date_of_birth: form.value.date_of_birth,
      category: form.value.category,
      address: form.value.address,
      neighborhood: form.value.neighborhood,
      enrollment_date: form.value.enrollment_date,
      emergency_contact_name: form.value.emergency_contact_name,
      emergency_contact_phone: emergencyPhone,
      belt: form.value.belt,
    }

    // Omit graduation_date if empty
    if (form.value.graduation_date) {
      payload.graduation_date = form.value.graduation_date
    }

    await apiFetch('/register-student', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    // Se foi cadastro interno (professor), volta para alunos
    if (isInternal.value) {
      router.push({ name: 'students' })
    } else {
      // Caso contrário, mostra tela de sucesso
      success.value = true
    }
  } catch (e: any) {
    error.value = e.message || 'Erro ao cadastrar. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const inputClass =
  'w-full h-11 px-3.5 rounded-lg bg-input border border-border text-[15px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors'

const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Sticky header -->
    <header class="sticky top-0 z-10 bg-background border-b border-border px-4 py-3.5 flex items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5">
        <div v-if="isInternal" class="flex-shrink-0">
          <button
            @click="router.back()"
            class="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Voltar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" x2="5" y1="12" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </div>
        <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" fill="white" fill-opacity="0.8" />
            <path d="M10 7L13.5 9.25V12.75L10 15L6.5 12.75V9.25L10 7Z" fill="white" />
          </svg>
        </div>
        <div>
          <span class="text-[13px] font-semibold text-foreground leading-none block">Tatame Hub</span>
          <span class="text-[11px] text-muted-foreground leading-none">Cadastro de aluno</span>
        </div>
      </div>
    </header>

    <div class="px-4 py-6 max-w-lg mx-auto pb-12">
      <!-- ── Success ── -->
      <div v-if="success" class="mt-8 bg-card border border-green-500/20 rounded-2xl p-8 text-center">
        <div class="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-green-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 class="text-[20px] font-semibold text-foreground mb-2">Cadastro realizado!</h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Seus dados foram enviados com sucesso.<br>Aguarde a confirmação do seu professor.
        </p>
      </div>

      <!-- ── Form ── -->
      <div v-else>
        <div class="mb-6">
          <h1 class="text-[20px] font-semibold text-foreground tracking-tight mb-1">Cadastro de aluno</h1>
          <p class="text-sm text-muted-foreground">Preencha seus dados para se cadastrar na academia</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-7">
          <!-- Dados pessoais -->
          <section>
            <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Dados pessoais</p>
            <div class="space-y-4">
              <div>
                <label :class="labelClass">Nome completo</label>
                <input v-model="form.name" type="text" placeholder="João Silva" required maxlength="150" :class="inputClass" autocomplete="name" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label :class="labelClass">Telefone</label>
                  <input
                    :value="form.phone"
                    @input="(e) => onPhoneInput(e, 'phone')"
                    type="tel"
                    placeholder="(21) 99999-9999"
                    maxlength="15"
                    :class="inputClass"
                    autocomplete="tel"
                  />
                </div>
                <div>
                  <label :class="labelClass">CPF</label>
                  <input :value="form.cpf" @input="onCpfInput" type="text" placeholder="000.000.000-00" maxlength="14" :class="inputClass" />
                </div>
              </div>

              <div>
                <label :class="labelClass">Data de nascimento</label>
                <input v-model="form.date_of_birth" @change="onDateOfBirthChange" type="date" required :class="inputClass" />
              </div>

              <div>
                <label :class="labelClass">Categoria</label>
                <div :class="[inputClass, 'flex items-center']">
                  {{ form.category || 'Selecione uma data de nascimento' }}
                </div>
              </div>
            </div>
          </section>

          <!-- Divisor -->
          <div class="border-t border-border" />

          <!-- Endereço -->
          <section>
            <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Endereço</p>
            <div class="space-y-4">
              <div>
                <label :class="labelClass">Rua</label>
                <input v-model="form.address" type="text" placeholder="Rua das Flores, 123" maxlength="200" :class="inputClass" />
              </div>

              <div>
                <label :class="labelClass">Bairro</label>
                <input v-model="form.neighborhood" type="text" placeholder="Centro" maxlength="100" :class="inputClass" />
              </div>
            </div>
          </section>

          <!-- Divisor -->
          <div class="border-t border-border" />

          <!-- Datas -->
          <section>
            <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Datas</p>
            <div class="space-y-4">
              <div>
                <label :class="labelClass">Data de ingresso</label>
                <input v-model="form.enrollment_date" type="date" :class="inputClass" />
              </div>
              <div>
                <label :class="labelClass">Data de graduação</label>
                <input v-model="form.graduation_date" type="date" :class="inputClass" />
              </div>
            </div>
          </section>

          <!-- Divisor -->
          <div class="border-t border-border" />

          <!-- Contato de emergência -->
          <section>
            <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Contato de emergência</p>
            <div class="space-y-4">
              <div>
                <label :class="labelClass">Nome</label>
                <input v-model="form.emergency_contact_name" type="text" placeholder="Maria Silva" maxlength="150" :class="inputClass" />
              </div>
              <div>
                <label :class="labelClass">Telefone</label>
                <input
                  :value="form.emergency_contact_phone"
                  @input="(e) => onPhoneInput(e, 'emergency_contact_phone')"
                  type="tel"
                  placeholder="(21) 99999-9999"
                  maxlength="15"
                  :class="inputClass"
                />
              </div>
            </div>
          </section>

          <!-- Divisor -->
          <div class="border-t border-border" />

          <!-- Faixa -->
          <section>
            <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Faixa</p>
            <!-- 2-col grid on mobile for easier tapping -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                v-for="belt in belts"
                :key="belt.value"
                type="button"
                @click="form.belt = belt.value"
                class="flex items-center gap-2.5 h-11 px-3.5 rounded-xl border text-[13px] font-medium transition-all"
                :class="
                  form.belt === belt.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground bg-secondary/50 hover:border-border hover:text-foreground'
                "
              >
                <span
                  class="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2"
                  :style="{ backgroundColor: belt.color, borderColor: belt.border }"
                />
                {{ belt.label }}
              </button>
            </div>
          </section>

          <!-- Error -->
          <div v-if="error" class="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/25">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-destructive shrink-0 mt-px">
              <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <p class="text-sm text-destructive">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 bg-primary text-white rounded-xl text-[15px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </span>
            <span v-else>Concluir cadastro</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
