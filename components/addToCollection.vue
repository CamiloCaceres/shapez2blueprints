<script setup lang="ts">
import { ref } from "vue";
import { currentUser, pb } from "@/utils/pocketbase";

interface Collection {
  id: string;
  name: string;
  author: string;
  blueprints: string[];
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  description: string;
}

interface CollectionsResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Collection[];
}

const props = defineProps({
  blueprintId: { type: String, required: true },
});

const isOpen = ref(false);
const isLoading = ref(false);

const myCollections = ref();
const selectedCollectionId = ref("");

const isBlueprintInCollection = computed(() => {
  if (!selectedCollectionId.value) return false;
  const selectedCollection = collections.value.find(
    (c: any) => c.id === selectedCollectionId.value
  );
  return selectedCollection?.blueprints.includes(props.blueprintId);
});

const collections = computed(() => myCollections.value.items || []);

onMounted(async () => {
  try {
    // fetch a paginated records list
    myCollections.value = await pb.collection("collections").getList(1, 50, {
      filter: `author = '${currentUser.value?.id}'`,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
});

async function addToCollection() {
  if (!currentUser.value) {
    console.log("You must be logged in to add to a collection");
    return;
  }
  if (!selectedCollectionId.value) {
    console.log("Please select a collection first");
    return;
  }
  if (isBlueprintInCollection.value) {
    console.log("This blueprint is already in the selected collection");
    return;
  }

  isLoading.value = true;

  try {
    const collection = await pb
      .collection("collections")
      .getOne(selectedCollectionId.value);

    if (collection.author !== currentUser.value.id) {
      console.log("You can only add blueprints to collections you created");
      return;
    }

    await pb.collection("collections").update(selectedCollectionId.value, {
      "blueprints+": props.blueprintId,
    });

    console.log("Blueprint added to collection successfully");
  } catch (error) {
    console.error("Error adding blueprint to collection:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UButton
    @click="isOpen = true"
    icon="i-heroicons-plus"
    class="mt-10 text-right"
  >
    Add to collection
  </UButton>

  <UModal v-model="isOpen">
    <div class="p-4">
      <UCard>
        <template #header> Add blueprint to collection </template>
        <UFormGroup label="Select collection">
          <UInputMenu
            v-model="selectedCollectionId"
            :options="collections"
            option-attribute="name"
            value-attribute="id"
            searchable
            placeholder="Select a collection"
            :search-attributes="['name', 'description']"
          >
            <template #option="{ option: collection }">
              <div class="flex flex-col">
                <span class="font-medium">{{ collection.name }}</span>
              </div>
            </template>
            <template #option-empty="{ query }">
              No collections found matching "{{ query }}"
            </template>
          </UInputMenu>
        </UFormGroup>
        <div class="flex items-end justify-end space-x-2 mt-4">
          <UButton icon="i-heroicons-folder-plus" variant="outline"
            >New collection</UButton
          >
          <UButton icon="i-heroicons-plus" @click="addToCollection()">{{
            isLoading ? "Adding..." : "Add"
          }}</UButton>
        </div>
      </UCard>
    </div>
  </UModal>
</template>
