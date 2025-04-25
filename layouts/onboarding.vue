<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-6">
      <div class="absolute top-4 right-4">
        <NuxtLink 
          to="/auth/login" 
          class="px-4 py-2 text-sm font-medium text-red-500 rounded-full hover:bg-red-50 transition-colors"
        >
          Omitir
        </NuxtLink>
      </div>
      
      <div class="flex flex-col justify-center items-center min-h-[80vh]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout para páginas de onboarding
</script> 