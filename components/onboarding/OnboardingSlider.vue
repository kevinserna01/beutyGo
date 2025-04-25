<template>
  <div class="flex flex-col items-center justify-between h-full">
    <div class="w-full max-w-sm">
      <div class="mb-8">
        <img 
          :src="currentSlide.image" 
          :alt="currentSlide.title" 
          class="w-64 h-64 mx-auto object-contain"
        />
      </div>
      
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {{ currentSlide.title }}
        </h2>
        <p class="text-gray-600">
          {{ currentSlide.description }}
        </p>
      </div>
      
      <!-- Indicadores -->
      <div class="flex justify-center space-x-2 mb-8">
        <button 
          v-for="(slide, index) in slides" 
          :key="slide.id"
          :class="[
            'w-2.5 h-2.5 rounded-full transition-all',
            index === currentSlideIndex ? 'bg-red-500 w-6' : 'bg-gray-300'
          ]"
          @click="goToSlide(index)"
          :aria-label="`Ir a diapositiva ${index + 1}`"
        ></button>
      </div>
    </div>
    
    <div class="flex w-full justify-between px-4">
      <button 
        v-if="currentSlideIndex > 0"
        @click="previousSlide" 
        class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Anterior
      </button>
      <div v-else></div>
      
      <UiButton 
        :variant="isLastSlide ? 'primary' : 'outline'"
        @click="nextSlide"
      >
        {{ isLastSlide ? 'Comenzar' : 'Siguiente' }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '~/stores/onboarding'

// Obteniendo el store
const onboardingStore = useOnboardingStore()

// Desestructurando las propiedades del store
const {
  slides,
  currentSlideIndex,
  currentSlide,
  isLastSlide,
  hasCompletedOnboarding
} = storeToRefs(onboardingStore)

// Usando las acciones directamente del store
const nextSlide = () => {
  onboardingStore.nextSlide()
}

const previousSlide = () => {
  onboardingStore.previousSlide()
}

const goToSlide = (index: number) => {
  onboardingStore.goToSlide(index)
}

// Si el usuario llega al último slide y hace clic en Comenzar
const handleComplete = () => {
  onboardingStore.completeOnboarding()
  navigateTo('/auth/login')
}
</script> 