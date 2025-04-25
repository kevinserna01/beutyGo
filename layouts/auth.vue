<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-center mb-8">
        <NuxtLink to="/" class="font-bold text-2xl text-red-500">
          BeautyGo
        </NuxtLink>
      </div>
      
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <slot />
      </div>

      <div class="mt-8 text-center text-sm text-gray-500">
        © {{ new Date().getFullYear() }} BeautyGo. Todos los derechos reservados.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout para páginas de autenticación
</script> 