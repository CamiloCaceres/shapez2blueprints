<script setup lang="ts">
import { ref, onMounted } from "vue";
import { pb } from "@/utils/pocketbase";
// import { DateTime } from "luxon";

const router = useRouter();

const resultList = ref(null);

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

const getImageUrl = (item) => {
  if (item && item.image) {
    return pb.files.getUrl(item, item.image, { thumb: "150x200" });
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
  <div class="grid grid-cols-4" v-if="resultList">
    <div v-for="item in resultList.items" :key="item.id">
      <div
        class="rounded border w-[200px] cursor-pointer"
        @click="router.push(`blueprints/${item.id}`)"
      >
        <img :src="getImageUrl(item)" :alt="item.title" />
        <h2>{{ item.title }}</h2>
        <h4>by: {{ item.expand.author.username }}</h4>
        <h4>likes: {{ item.likes_count }}</h4>
<!--         <h4>created: {{ getDate(item.created) }}</h4>
 -->        <div v-for="tag in item.expand.tags">
          {{ tag.name }}
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
  <pre class="text-wrap">
    {{ resultList?.items }}
  </pre>
</template>
