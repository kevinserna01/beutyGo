<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-8">
    <OnboardingSlider />
  </div>
</template>

<script setup lang="ts">
// Configura el layout de onboarding
definePageMeta({
  layout: 'onboarding'
})

// Configura el título de la página
useHead({
  title: 'Bienvenido a BeautyGo'
})
</script> 