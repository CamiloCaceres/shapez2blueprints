<script setup lang="ts">
import { pb, currentUser } from "@/utils/pocketbase";

const route = useRoute();
const routeId = route.params.id.toString();

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
    blueprint.value = await pb.collection("blueprints").getOne(routeId, {
      expand: "author,tags",
    });
    await checkIfBlueprintLiked();
  } catch (error) {
    console.error("Error fetching blueprints:", error);
  }
});

const isBlueprintLiked = ref(false);
const like = ref();

const checkIfBlueprintLiked = async () => {
  if (currentUser.value) {
    const likes = await pb.collection("likes").getFullList({
      filter: `blueprint = "${blueprint.value.id}" && user = "${currentUser.value.id}"`,
    });
    like.value = likes[0];
    isBlueprintLiked.value = likes.length > 0;
  }
};

const removeLike = async () => {
  if (currentUser.value) {
    try {
      await pb.collection("likes").delete(like.value.id);
    } catch (error) {
      console.error("Error removing like:", error);
    }
  }
};
const likeBlueprint = async () => {
  if (currentUser.value) {
    try {
      await pb.collection("likes").create({
        blueprint: blueprint.value.id,
        user: currentUser.value.id,
      });
      isBlueprintLiked.value = true;
    } catch (error) {
      console.error("Error liking blueprint:", error);
    }
  }
};
const handleLike = async () => {
  if (isBlueprintLiked.value) {
    await removeLike();
  } else {
    await likeBlueprint();
  }
};
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

    <div class="flex flex-col gap-8 mt-8">
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
          <h3>{{ blueprint.building_count }}</h3>
        </div>

        <div class="flex justify-between">
          <h2>BP cost:</h2>
          <h3>{{ blueprint.cost }}</h3>
        </div>

        <div class="flex justify-between">
          <h2>{{ blueprint.island_count === 0 ? "Type" : "Islands" }}:</h2>
          <h3>
            {{
              blueprint.island_count === 0
                ? "Buildings"
                : blueprint.island_count
            }}
          </h3>
        </div>

        <div class="flex justify-between">
          <!-- TODO: if logged in, i call likes, filter by this user. if this blueprint id is in likes, i change icon to solid  -->
          <AddToCollection :blueprint-id="blueprint.id" />
          <UButton
            square
            color="rose"
            :icon="isBlueprintLiked ? 'i-heroicons-heart' : 'i-heroicons-heart-solid'"
            variant="ghost"
            class="mt-10 text-right"
            @click="handleLike"
          ></UButton>
        </div>
      </div>
      <div class="bg-slate-800 p-5 shadow-xl rounded">
        <div class="flex justify-between">
          <h2>Tags:</h2>
          <h3 v-for="tag in blueprint.expand.tags">{{ tag.name }}</h3>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!blueprint">
    <div class="flex flex-col md:flex-row gap-8 mt-8">
      <div class="flex-grow">
        <USkeleton class="h-60 w-full mb-4" />
        <div class="space-y-2">
          <USkeleton class="h-6 w-3/4" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-full" />
        </div>
        <USkeleton class="h-40 w-full mt-4" />
      </div>
      <div class="w-60">
        <USkeleton class="h-60 w-60" />
      </div>
    </div>
  </div>
</template>
