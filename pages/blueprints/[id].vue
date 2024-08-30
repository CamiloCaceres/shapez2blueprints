<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const route = useRoute()

const resultList = ref(null);


onMounted(async () => {
  try {
    // fetch a paginated records list
    resultList.value = await pb.collection("blueprints").getOne(route.params.id);
  } catch (error) {
    console.error("Error fetching blueprints:", error);
  }
});
</script>

<template>
    <h1>{{ resultList }}</h1>
</template>
