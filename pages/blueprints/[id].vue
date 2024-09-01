<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const route = useRoute();
const router = useRouter();

const blueprint = ref();

const isBlueprintVisible = ref(false);
function toggleBlueprintVisible() {
  isBlueprintVisible.value = !isBlueprintVisible.value;
}

const getImageUrl = (item: any) => {
  if (item && item.image) {
    return pb.files.getUrl(item, item.image, { thumb: "800x0" });
  }
  return "";
};

onMounted(async () => {
  try {
    // fetch a paginated records list
    blueprint.value = await pb
      .collection("blueprints")
      .getOne(route.params.id, {
        expand: "author,tags",
      });
  } catch (error) {
    console.error("Error fetching blueprints:", error);
  }
});
</script>

<template>
  <div v-if="blueprint" class="w-full mt-6 flex justify-around">
    <div class="dark:bg-slate-900 max-w-4xl shadow-xl rounded">
      <img
        class="w-full rounded"
        :src="getImageUrl(blueprint)"
        :alt="blueprint.image"
      />

      <div class="flex justify-between items-center p-5">
        <h1 class="font-semibold text-xl capitalize">{{ blueprint.title }}</h1>
        <div class="flex items-center space-x-4">
          <Download
            :blueprint="blueprint.blueprint_string"
            :filename="blueprint.title"
          />
          <UButton color="amber" icon="i-heroicons-clipboard"
            >Copy to clipboard</UButton
          >
        </div>
      </div>

      <div class="dark:bg-slate-800 p-5">
        <h3 class="font-semibold text-lg">Details:</h3>
        <p class="text-sm mt-2">{{ blueprint.description }}</p>
      </div>

      <div class="dark:bg-slate-800 p-5 border-t border-slate-700">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-lg">Blueprint:</h2>
          <UButton
            @click="toggleBlueprintVisible()"
            variant="ghost"
            :icon="
              isBlueprintVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
            "
            >{{
              isBlueprintVisible ? "Hide Blueprint" : "Show Blueprint"
            }}</UButton
          >
        </div>
        <p
          v-if="isBlueprintVisible"
          class="text-wrap break-all text-xs mt-4 mx-4 max-w-2xl transition"
        >
          {{ blueprint.blueprint_string }}
        </p>
      </div>
    </div>

    <div
      class="dark:bg-slate-800 w-60 h-60 flex flex-col p-5 shadow-xl rounded"
    >
      <div class="flex justify-between">
        <h2>Author:</h2>
        <NuxtLink
          class="underline text-amber-500 underline-offset-2"
          :to="`/users/${blueprint.author}`"
          >{{ blueprint.expand.author.username }}</NuxtLink
        >
      </div>

      <div class="flex justify-between">
        <h2>Machines:</h2>
        <h3>12.000</h3>
      </div>

      <div class="flex justify-between">
        <h2>BP cost:</h2>
        <h3>12.000</h3>
      </div>

      <div class="flex justify-between">
        <h2>Likes:</h2>
        <h3>{{ blueprint.like_count }}</h3>
      </div>
      <div class="flex justify-between">
        <h2>tags:</h2>
        <h3 v-for="tag in blueprint.expand.tags">{{ tag.name }}</h3>
      </div>
      <div class="flex justify-between">
        <!-- if logged in, i call likes, filter by this user. if this blueprint id is in likes, i change icon to solid  -->
        <UButton icon="i-heroicons-plus" class="mt-10 text-right"
          >Add to collection</UButton
        >
        <UButton
          square
          color="rose"
          icon="i-heroicons-heart"
          variant="ghost"
          class="mt-10 text-right"
        ></UButton>
      </div>
    </div>
  </div>
</template>
