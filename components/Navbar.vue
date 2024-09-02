<template>
    <nav class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-50 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex space-x-16 items-center">

            <div class="ml-4">
              <NuxtLink
                class="text-gray-800 dark:text-gray-200 text-2xl font-bold"
                to="/"
              >
                🔹 Shapez2Blueprints
              </NuxtLink>
            </div>

          </div>
          <div class="flex items-center space-x-4">
            <UButton variant="link" to="/collections/">Collections</UButton>
            <ToggleDark />
            <User v-if="currentUser" />
            <UButton  v-else to="/login">Login</UButton>
  
            
          </div>
        </div>
      </div>

    </nav>
  </template>
  
  <script setup lang="ts">

  </script>