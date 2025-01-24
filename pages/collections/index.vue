<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const collections = ref();
const loading = ref(true);

onMounted(async () => {
  try {
    collections.value = await pb.collection("collections").getList(1, 50, {
      expand: "author",
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <UContainer>
    <h1 class="text-2xl font-bold mb-6">Blueprint Collections</h1>

    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <USkeleton v-for="i in 6" :key="i" class="h-48">
        <div class="space-y-2">
          <USkeleton class="h-4 w-2/3" />
          <USkeleton class="h-3 w-full" />
          <USkeleton class="h-3 w-full" />
          <USkeleton class="h-3 w-1/2" />
          <USkeleton class="h-8 w-full mt-4" />
        </div>
      </USkeleton>
    </div>

    <div
      v-else-if="collections?.items"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <UCard
        v-for="collection in collections?.items"
        :key="collection.id"
        class="flex flex-col"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon class="w-5 h-5" name="i-heroicons-folder" />
            <h3 class="text-lg font-semibold">{{ collection.name }}</h3>
          </div>
          <p class="text-sm text-gray-500 mb-4 flex-grow truncate">
            {{ collection.expand.author.username }}
          </p>
        </template>

        <p class="text-sm text-gray-500 mb-4 flex-grow truncate">
          {{ collection.description || "No description" }}
        </p>

        <p class="text-sm mb-4">
          <strong>Blueprints:</strong> {{ collection.blueprints.length }}
        </p>

        <template #footer>
          <UButton
            :to="`/collections/${collection.id}`"
            color="primary"
            variant="soft"
            class="w-full"
          >
            View Collection
          </UButton>
        </template>
      </UCard>
    </div>

    <div v-else>
      <p>Page error. Please reload or contact the administrator at shapez2blueprints@gmail.com</p>
    </div>
  </UContainer>
</template>
