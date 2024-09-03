<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const route = useRoute();
const routeId = route.params.id.toString()


const collection = ref()

  onMounted(async () => {
  try {
    // fetch a paginated records list
    collection.value = await pb.collection("collections").getOne(routeId);
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
});
</script>

<template>
    {{ collection }}
</template>