<script setup lang="ts">
import { currentUser } from "@/utils/pocketbase";

function signOut() {
  pb.authStore.clear();
}
</script>

<template>
  <UPopover>
    <UButton variant="ghost" square size="xl" icon="i-heroicons-user" />

    <template #panel>
      <div class="py-6 px-10 flex flex-col space-y-4 items-start">
        <div class="flex flex-col">
          <h2 class="text-lg font-semibold">{{ currentUser.username }}</h2>
          <h3 class="text-sm dark:text-gray-400">{{ currentUser.email }}</h3>
          <div class="w-full h-1 border-t mt-2"></div>
        </div>
        <div class="flex flex-col space-y-1">
          <NuxtLink :to="`/users/${currentUser.id}`" class="text-sm underline text-primary underline-offset-2"
            >My blueprints</NuxtLink
          >
          <NuxtLink class="text-sm underline text-primary underline-offset-2"
            >My collections</NuxtLink
          >
        </div>
        <UButton
          variant="outline"
          color="amber"
          @click="signOut"
          v-if="currentUser"
          size="lg"
          >Logout</UButton
        >
      </div>
    </template>
  </UPopover>
</template>
