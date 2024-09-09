<template>
    <nav class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-50 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <NuxtLink
              class="text-gray-800 dark:text-gray-200 text-xl font-bold"
              to="/"
            >
              🔹 Shapez2Blueprints
            </NuxtLink>
          </div>
          
          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button
              @click="isOpen = !isOpen"
              type="button"
              class="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <UIcon v-if="!isOpen" name="i-heroicons-bars-3" class="h-6 w-6" />
              <UIcon v-else name="i-heroicons-x-mark" class="h-6 w-6" />
            </button>
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:flex items-center space-x-4">
            <UButton color="amber" icon="i-heroicons-plus" to="/add-blueprint">Add blueprint</UButton>
            <UButton variant="link" to="/collections">Collections</UButton>
            <User v-if="currentUser" />
            <UButton variant="link" v-else to="/login">Login</UButton>
            <ToggleDark />
          </div>
        </div>
      </div>


      <!-- Mobile menu, show/hide based on menu state -->
      <div
        v-show="isOpen"
        class="md:hidden"
        id="mobile-menu"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col justify-center items-center">
          <UButton block variant="ghost" to="/collections">Collections</UButton>
          <User v-if="currentUser" />
          <UButton block variant="ghost" v-else to="/login">Login</UButton>
            <ToggleDark />
        </div>
      </div>
    </nav>

    <!-- Floating Action Button for mobile -->
    <UButton
      v-if="$device.isMobile"
      color="amber"
      icon="i-heroicons-plus"
      to="/add-blueprint"
      class="fixed right-4 bottom-4 rounded-full shadow-lg z-50"
      size="xl"
    />
  </template>
  
  <script setup lang="ts">
    import { ref } from 'vue'
    import { currentUser } from '@/utils/pocketbase'

    const isOpen = ref(false)
  </script>