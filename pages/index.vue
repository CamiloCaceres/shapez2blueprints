<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

useHead({
  title: 'Shapez 2 Blueprints - Share Your Creations',
  meta: [
    { name: 'description', content: 'Discover and share Shapez 2 blueprints with the community. Browse user-created designs and contribute your own creations.' },
    { name: 'keywords', content: 'Shapez 2, blueprints, game designs, community creations, puzzle game' },
    { property: 'og:title', content: 'Shapez 2 Blueprints - Community Creations' },
    { property: 'og:description', content: 'Explore and share Shapez 2 blueprints. Join our community of creators!' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://shapez2blueprints.com' }, // Replace with your actual URL
    { property: 'og:image', content: 'https://shapez2blueprints.com/og-image.jpg' }, // Replace with your actual image URL
  ],
  link: [
    { rel: 'canonical', href: 'https://shapez2blueprints.com' } // Replace with your actual URL
  ]
})
const resultList = ref();
const isLoading = ref(true);

onMounted(async () => {
  await fetchBlueprints();
});

const fetchBlueprints = async () => {
  isLoading.value = true;
  try {
    resultList.value = await pb.collection("blueprints").getList(page.value, perPage.value, {
      expand: "author,tags",
    });
  } catch (error) {
    console.error("Error fetching blueprints:", error);
  } finally {
    isLoading.value = false;
  }
}

const page = ref(1)
const perPage = ref(8)

watch(page, () => {
  fetchBlueprints()
})

</script>

<template>
  <h1 class="text-3xl font-bold mx-auto text-center mt-16">
    Shapez 2 Blueprints
  </h1>
  
  <h3 class="text-xl font-semibold mx-auto text-center mt-2 mb-16">
    Share your creations with the community!
  </h3>
  <div
    v-if="!isLoading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
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

  <div class="flex justify-center my-8">
    <UPagination
      v-if="!isLoading && resultList"
      v-model="page"
      :page-count="resultList.pageCount"
      :total="resultList.totalItems"
      show-first
      show-last
    />
  </div>
</template>
