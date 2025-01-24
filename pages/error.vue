<template>
  <UContainer class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-heroicons-face-frown" class="w-16 h-16 mx-auto text-gray-400" />
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
      <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <UButton
          to="/"
          label="Go back home"
          color="primary"
        />
        <UButton
          to="/contact"
          label="Contact support"
          color="gray"
          variant="ghost"
        />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{
  error: Error
}>()
</script>
