<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const props = defineProps<{
  blueprint: any;
}>();

const router = useRouter();

const getImageUrl = (blueprint: any) => {
  if (blueprint && blueprint.image) {
    return pb.files.getUrl(blueprint, blueprint.image, { thumb: "200x150" });
  }
  return "";
};
</script>

<template>
  <div class="rounded cursor-pointer dark:bg-gray-800 shadow-xl h-full">
    <img
      @click="router.push(`blueprints/${props.blueprint.id}`)"
      class="w-full rounded"
      :src="getImageUrl(props.blueprint)"
      :alt="props.blueprint.title"
    />

    <div class="p-3 space-y-2">
      <div class="flex flex-col">
        <h2
          @click="router.push(`blueprints/${props.blueprint.id}`)"
          class="text-xl font-semibold capitalize"
        >
          {{ props.blueprint.title }}
        </h2>
        <div class="text-sm">
          <span>by: </span>
          <NuxtLink
            class="underline text-amber-500 underline-offset-2"
            :to="`/users/${props.blueprint.author}`"
            >{{ props.blueprint.expand.author.username }}</NuxtLink
          >
        </div>
      </div>
      <div class="flex blueprints-center space-x-2">
        <UIcon name="i-heroicons-heart" class="text-red-500" />
        <h4>{{ props.blueprint.likes_count }}</h4>
      </div>
      <div class="flex flex-wrap">
        <Tag v-for="tag in props.blueprint.expand.tags" :tag_name="tag.name" />
      </div>
    </div>
  </div>
</template>