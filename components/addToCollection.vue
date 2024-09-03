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

const toast = useToast();

const isOpen = ref(false);
const isLoading = ref(false);
const isAddCollectionVisible = ref(false);

const myCollections = ref();
const selectedCollectionId = ref("");

const newCollectionName = ref("");

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
    toast.add({
      id: "unauthorized",
      title: "Unathorized",
      description: "You must be logged in to preform this action",
      color: "red",
    });
    return;
  }
  if (!selectedCollectionId.value) {
    console.log("Please select a collection first");
    toast.add({
      id: "bp_error_unsele",
      title: "Error adding blueprint to collection:",
      description: "Please select a collection first",
      color: "red",
    });
    return;
  }
  if (isBlueprintInCollection.value) {
    console.log("This blueprint is already in the selected collection");
    toast.add({
      id: "bp_error_repeated",
      title: "Error adding blueprint to collection:",
      description: "This blueprint is already in the selected collection",
      color: "red",
    });
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
    toast.add({
      id: "bp_uploaded",
      title: "Blueprint added to collection successfully",
      color: "green",
    });
  } catch (error) {
    console.error("Error adding blueprint to collection:", error);
    toast.add({
      id: "bp_error",
      title: "Error adding blueprint to collection:",
      description: error?.toString(),
      color: "red",
    });
  } finally {
    isLoading.value = false;
    isOpen.value = false
  }
}

async function addCollection() {
  try {
    await pb.collection("collections").create({
      name: newCollectionName.value,
      blueprints: [props.blueprintId],
      author: currentUser.value?.id,
    });
    toast.add({
      id: "collection_created",
      title: "Collection created successfully",
      description: `Collection ${newCollectionName.value} created and blueprint added.`,
      color: "green",
    });
    isOpen.value = false

  } catch (error) {
    console.error("Error creating collection:", error);
    toast.add({
      id: "create_collection_error",
      title: "Error creating collection:",
      description: error?.toString(),
      color: "red",
    });
  }
}

function handleOpenModal() {
  if (!currentUser.value) {
    console.log("You must be logged in to add to a collection");
    toast.add({
      id: "unauthorized",
      title: "Unathorized",
      description: "You must be logged in to preform this action",
      color: "red",
    });
    return;
  }
  isOpen.value = true;
}
</script>

<template>
  <UButton
    @click="handleOpenModal"
    icon="i-heroicons-plus"
    class="mt-10 text-right"
  >
    Add to collection
  </UButton>

  <UModal v-model="isOpen">
    <div class="p-4">
      <UCard>
        <template #header>
          <h1 class="text-xl font-semibold">Add blueprint to collection</h1>
        </template>
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
          <UButton
            v-if="!isAddCollectionVisible"
            @click="isAddCollectionVisible = !isAddCollectionVisible"
            icon="i-heroicons-folder-plus"
            variant="outline"
            >New collection</UButton
          >
          <UButton icon="i-heroicons-plus" @click="addToCollection()">{{
            isLoading ? "Adding..." : "Add"
          }}</UButton>
        </div>
        <template v-if="isAddCollectionVisible" #footer>
          <div class="flex space-x-2 items-end">
            <UFormGroup class="flex-grow" label="New collection name:">
                <!-- TODO: need to create validation -->
              <UInput v-model="newCollectionName" />
            </UFormGroup>
            <UButton @click="addCollection()" icon="i-heroicons-folder-plus">Create collection</UButton>
          </div>
        </template>
      </UCard>
    </div>
  </UModal>
</template>
