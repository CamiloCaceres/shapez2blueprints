<script setup lang="ts">
import { pb, currentUser } from "@/utils/pocketbase";

const route = useRoute();
const collections = ref();



onMounted(async () => {
  try {
    // fetch a paginated records list
    collections.value = await pb.collection("collections").getList(1, 50, {
        filter: `author = '${currentUser.value?.id}'`
        
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
});
</script>
<template>
    <pre>{{ collections }}</pre>
</template>