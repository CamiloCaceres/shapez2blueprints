<script setup lang="ts">
import { ref, onMounted } from "vue";
import { pb } from "@/utils/pocketbase";
// import { DateTime } from "luxon";

const router = useRouter();

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

const getImageUrl = (item: any) => {
  if (item && item.image) {
    return pb.files.getUrl(item, item.image, { thumb: "200x150" });
  }
  return "";
};

/* const getDate = (date: any) => {
  return DateTime.fromISO(date);
};
 */
// TODO: add likes, copy button
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
    <div v-for="item in resultList.items" :key="item.id">
      <div class="rounded cursor-pointer dark:bg-gray-800 shadow-xl h-full">
        <img
          @click="router.push(`blueprints/${item.id}`)"
          class="w-full rounded"
          :src="getImageUrl(item)"
          :alt="item.title"
        />

        <div class="p-3 space-y-2">
          <div class="flex flex-col">
            <h2
              @click="router.push(`blueprints/${item.id}`)"
              class="text-xl font-semibold capitalize"
            >
              {{ item.title }}
            </h2>
            <div class="text-sm">
              <span>by: </span>
              <NuxtLink
                class="underline text-amber-500 underline-offset-2"
                :to="`/users/${item.author}`"
                >{{ item.expand.author.username }}</NuxtLink
              >
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-heart" class="text-red-500" />
            <h4>{{ item.likes_count }}</h4>
          </div>
          <div class="flex flex-wrap">
            <Tag v-for="tag in item.expand.tags" :tag_name="tag.name" />
          </div>
        </div>
      </div>
    </div>
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
