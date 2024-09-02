<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const route = useRoute();

const collections = ref();



onMounted(async () => {
  try {
    // fetch a paginated records list
    collections.value = await pb.collection("collections").getList(1, 50, {
        
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
});
</script>
<template>
    <h1>    hi</h1>{{ route.params.id }}
    <pre>{{ collections }}</pre>
</template>