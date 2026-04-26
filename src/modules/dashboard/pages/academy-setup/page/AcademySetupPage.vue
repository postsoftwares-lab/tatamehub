<script setup lang="ts">
import AcademySetupForm from '@/modules/dashboard/ui/AcademySetupForm.vue'
import { useAcademySetup } from '../composables/useAcademySetup'

const {
  academyName,
  billingDay,
  monthlyFee,
  imagePreview,
  isLoading,
  errorMessage,
  handleImageSelect,
  removeImage,
  createAcademy
} = useAcademySetup()

const handleSubmit = ({ name, billingDay: bd, monthlyFee: mf }: { name: string; billingDay: number; monthlyFee: number }) => {
  academyName.value = name
  billingDay.value = bd
  monthlyFee.value = mf
  createAcademy()
}

const handleImageSelected = (file: File) => {
  handleImageSelect(file)
}
</script>

<template>
  <div class="w-full h-screen bg-[var(--bg-app)] text-[var(--fg-1)] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <svg viewBox="0 0 64 64" class="w-12 h-12 rounded-lg">
            <rect width="64" height="64" rx="14" fill="#F4F5F7" />
            <rect x="10" y="18" width="44" height="6" rx="1.5" fill="#0F0F11" />
            <rect x="10" y="29" width="44" height="6" rx="1.5" fill="#3B3E45" />
            <rect x="10" y="40" width="28" height="6" rx="1.5" fill="#0F0F11" />
            <rect x="42" y="40" width="3" height="6" rx="1" fill="#0F0F11" opacity=".55" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Criar sua Academia</h1>
        <p class="text-[var(--fg-3)] text-sm">Configure os dados básicos para começar a usar o tatame<strong class="font-bold">hub</strong></p>
      </div>

      <!-- Form -->
      <div class="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] p-8">
        <AcademySetupForm
          :is-loading="isLoading"
          :error-message="errorMessage"
          :academy-name="academyName"
          :billing-day="billingDay"
          :monthly-fee="monthlyFee"
          :image-preview="imagePreview"
          @submit="handleSubmit"
          @image-selected="handleImageSelected"
          @image-removed="removeImage"
        />
      </div>
    </div>
  </div>
</template>
