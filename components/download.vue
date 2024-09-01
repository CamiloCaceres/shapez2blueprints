<template>
  <div>
    <UButton color="amber" variant="outline" icon="i-heroicons-arrow-down-tray" @click="handleDownload" :loading="isDownloading" :disabled="!blueprint">
      {{ isDownloading ? "Downloading..." : "Download blueprint" }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  blueprint: string;
  filename?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filename: "blueprint.spz2bp",
});

const isDownloading = ref(false);

function generateFileContent(blueprint: string): string {
  return blueprint; // This is just the string as-is
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/\s+/g, "_");
}

function downloadBlueprint(blueprint: string, filename: string) {
  const content = generateFileContent(blueprint);
  const blob = new Blob([content], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFilename(filename)}.spz2bp`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function handleDownload() {
  if (!props.blueprint) {
    console.error("Blueprint is required");
    return;
  }

  isDownloading.value = true;

  try {
    downloadBlueprint(props.blueprint, props.filename);
  } catch (error) {
    console.error("Error downloading blueprint:", error);
    // You might want to emit an event here to notify the parent component of the error
  } finally {
    isDownloading.value = false;
  }
}
</script>
