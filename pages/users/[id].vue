<script setup lang="ts">
import { pb } from "@/utils/pocketbase";

const route = useRoute();

const blueprints = ref();

const getImageUrl = (item: any) => {
  if (item && item.image) {
    return pb.files.getUrl(item, item.image, { thumb: "800x0" });
  }
  return "";
};

onMounted(async () => {
  try {
    // fetch a paginated records list
    blueprints.value = await pb.collection("blueprints").getList(1, 50, {
        filter: `author = '${route.params.id}'`
    });
  } catch (error) {
    console.error("Error fetching blueprints:", error);
  }
});
</script>
<template>
    <h1>    hi</h1>{{ route.params.id }}
    <pre>{{ blueprints }}</pre>
</template>