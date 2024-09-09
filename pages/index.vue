<script setup lang="ts">
import { ref, onMounted } from "vue";
import { pb } from "@/utils/pocketbase";

const resultList = ref();

onMounted(async () => {
  try {
    // fetch a paginated records list
    resultList.value = await pb.collection("blueprints").getList(1, 50, {
      expand: "author,tags",
    });
  } catch (error) {
    console.error("Error fetching blueprints:", error);
  }
});
</script>

<template>
  <h1 class="text-3xl font-bold mx-auto text-center mt-16">
    Shapez 2 Blueprints
  </h1>
  <h3 class="text-xl font-semibold mx-auto text-center mt-2 mb-16">
    Share your creations with the community!
  </h3>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
    v-if="resultList"
  >
    <BlueprintCard
      v-for="blueprint in resultList.items"
      :key="blueprint.id"
      :blueprint="blueprint"
    />
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
    <div v-for="i in 8" :key="i" class="rounded shadow-xl h-full">
      <USkeleton class="w-full h-48 rounded-t" />
      <div class="p-3 space-y-2">
        <USkeleton class="h-6 w-3/4" />
        <USkeleton class="h-4 w-1/2" />
        <div class="flex items-center space-x-2">
          <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
          <USkeleton class="h-4 w-10" />
        </div>
        <div class="flex flex-wrap gap-2">
          <USkeleton v-for="j in 3" :key="j" class="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>
