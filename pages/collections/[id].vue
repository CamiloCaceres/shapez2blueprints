<script setup lang="ts">
import { pb } from "@/utils/pocketbase";
import BlueprintCard from "~/components/BlueprintCard.vue";

const route = useRoute();
const routeId = route.params.id.toString();

const collection = ref();
const isLoading = ref(true);

onMounted(async () => {
  try {
    collection.value = await pb.collection("collections").getOne(routeId, {
      expand: "blueprints, blueprints.tags, blueprints.author, author",
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <UContainer class="mt-6">
    <USkeleton v-if="isLoading" class="h-96" />
    <UCard v-else-if="collection">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon class="w-5 h-5" name="i-heroicons-folder-open" />
          <h3 class="text-lg font-semibold capitalize">
            {{ collection.name }}
          </h3>
        </div>
      </template>

      <p class="mb-4">{{ collection.description }}</p>

      <div class="mb-4 capitalize">
        <strong>Author: </strong>
        <NuxtLink
          class="underline text-amber-500 underline-offset-2"
          :to="`/users/${collection.expand.author.id}`"
          >{{ collection.expand.author.username }}</NuxtLink
        >
      </div>

      <div class="mb-4">
        <strong>Blueprints:</strong>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <BlueprintCard
            v-for="blueprint in collection.expand.blueprints"
            :key="blueprint.id"
            :blueprint="blueprint"
          />
        </div>
      </div>

      <template #footer>
        <div class="text-sm text-gray-500">
          Created: {{ new Date(collection.created).toLocaleString() }}
          <br />
          Updated: {{ new Date(collection.updated).toLocaleString() }}
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
