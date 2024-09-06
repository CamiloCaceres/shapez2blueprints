<script setup lang="ts">
import { ref, reactive } from "vue";
import { useFileDialog } from "@vueuse/core";
import { pb, currentUser } from "@/utils/pocketbase";
import { processBlueprintString } from "@/utils/blueprints";

const blueprint_data = reactive({
  title: "",
  description: "",
  isValid: false,
  buildingCount: 0,
  islandCount: 0,
  cost: 0,
});
const tags = ref<string[]>(["oyib9c5uvf6fz9b"]);

//file upload
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false,
});
const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | undefined>(undefined);
onChange((fileList) => {
  if (fileList && fileList.length > 0) {
    selectedImage.value = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(fileList[0]);
  } else {
    selectedImage.value = null;
    imagePreview.value = undefined;
  }
});
const removeSelectedImage = () => {
  selectedImage.value = null;
  imagePreview.value = undefined;
  reset();
};

//blueprint file upload
const blueprint_string = ref("");
const handleBlueprintUploaded = (content: string) => {
  blueprint_string.value = content;
};
watch(blueprint_string, (newBlueprintString) => {
  const summary = processBlueprintString(newBlueprintString);
  blueprint_data.isValid = summary.isValid;
  blueprint_data.buildingCount = summary.buildingCount;
  blueprint_data.islandCount = summary.islandCount;
  blueprint_data.cost = summary.cost;
});

//Upload blueprint
const uploadBlueprint = async () => {
  try {
    const formData = new FormData();
    formData.append("title", blueprint_data.title);
    formData.append("description", blueprint_data.description);
    formData.append("blueprint_string", blueprint_string.value);
    formData.append("is_valid", blueprint_data.isValid.toString());
    formData.append("building_count", blueprint_data.buildingCount.toString());
    formData.append("island_count", blueprint_data.islandCount.toString());
    formData.append("cost", blueprint_data.cost.toString());
    formData.append("author", currentUser.value?.id);
    if (selectedImage.value) {
      formData.append("image", selectedImage.value);
    }

    const createdRecord = await pb.collection("blueprints").create(formData);
    console.log("Blueprint uploaded successfully:", createdRecord);
    await pb.collection("blueprints").update(createdRecord.id, {
      'tags+': tags.value,
    });
    navigateTo("/blueprints/" + createdRecord.id);
    // Reset form or navigate to a success page
  } catch (error) {
    console.error("Error uploading blueprint:", error);
  }
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-12">
    <template #header>
      <h1 class="text-2xl font-bold">Add Blueprint</h1>
    </template>

    <UFormGroup label="title">
      <UInput v-model="blueprint_data.title" />
    </UFormGroup>
    <UFormGroup label="Description">
      <UInput v-model="blueprint_data.description" />
    </UFormGroup>

    <h2>Upload Blueprint</h2>
    <BlueprintUpload @content-extracted="handleBlueprintUploaded" />
    <UTextarea v-model="blueprint_string" />
    <UFormGroup v-if="!selectedImage" label="Upload image">
      <UButton @click="open">Choose Image</UButton>
    </UFormGroup>
    <div v-if="selectedImage" class="mt-4">
      <p>Selected image: {{ selectedImage.name }}</p>
      <div class="flex items-start gap-2">
        <img
          :src="imagePreview"
          alt="Selected Image"
          class="max-w-xs max-h-72"
        />
        <UButton
          icon="i-heroicons-x-mark"
          variant="outline"
          color="red"
          @click="removeSelectedImage"
          class="mt-2"
        ></UButton>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <UButton color="amber" @click="uploadBlueprint" class="self-end"
          >Submit Blueprint</UButton
        >
      </div>
    </template>
  </UCard>

  <!-- Debug output -->
  <!--   <div class="mt-4">
    <h3>Debug Information:</h3>
    <pre>{{ JSON.stringify(blueprint_data, null, 2) }}</pre>
  </div> -->
</template>
