<script setup lang="ts">
import { ref, onMounted } from "vue";
import { pb } from "@/utils/pocketbase";
interface Tag {
  id: string;
  name: string;
}


const tags = ref<Tag[]>([]);
const selectedTags = ref<Tag[]>([]);
const loading = ref(false);

onMounted(async () => {
  await fetchTags();
});

async function fetchTags() {
  loading.value = true;
  try {
    const records = await pb
      .collection("tags")
      .getFullList<Tag>({ sort: "-created" });
    tags.value = records;
  } catch (error) {
    console.error("Error fetching tags:", error);
  } finally {
    loading.value = false;
  }
}

async function searchTags(query: string) {
  loading.value = true;
  try {
    const records = await pb.collection("tags").getFullList<Tag>({
      sort: "-created",
      filter: `name ~ "${query}"`,
    });
    return records;
  } catch (error) {
    console.error("Error searching tags:", error);
    return [];
  } finally {
    loading.value = false;
  }
}

async function createTag(name: string) {
    console.log(name)
  loading.value = true;
  try {
    const newTag = await pb.collection("tags").create<Tag>({ name });
    tags.value.push(newTag);
    return newTag;
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  } finally {
    fetchTags()
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <UFormGroup label="Tags">
      <template #hint>
        <div class="flex gap-2">
          <UBadge
            v-for="tag in selectedTags"
            :key="tag.id"
            variant="subtle"
            color="amber"
            >{{ tag.name }}</UBadge
          >
        </div>
      </template>
      <USelectMenu
        v-model="selectedTags"
        :options="tags"
        :loading="loading"
        :searchable="searchTags"
        option-attribute="name"
        placeholder="Select or create tags"
        multiple
        creatable
        :show-create-option-when="(query) => query.length > 3"
        @create="createTag"
      >
        <template #option="{ option }">
          {{ option.name }}
        </template>
        <template #option-create="{ option }">
          Create "{{ option.name }}"
        </template>
      </USelectMenu>
    </UFormGroup>
  </div>
</template>
