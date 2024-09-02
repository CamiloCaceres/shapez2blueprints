<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const route = useRoute();
const routeId = route.params.id.toString()


const collections = ref()

  onMounted(async () => {
  try {
    // fetch a paginated records list
    collections.value = await pb.collection("collections").getOne(routeId);
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
});
</script>

<template>
    {{ collections }}
</template>