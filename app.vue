<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#F87171" />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Configuración global de la aplicación
useHead({
  titleTemplate: '%s | BeautyGo',
  meta: [
    { name: 'description', content: 'Encuentra y reserva servicios de belleza a domicilio' },
    { name: 'theme-color', content: '#F87171' }
  ]
})
</script>

<style>
html, body {
  font-family: 'Poppins', sans-serif;
  @apply antialiased text-gray-800 bg-gray-50;
}
</style>
