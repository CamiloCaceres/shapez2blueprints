<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFileSystemAccess } from '@vueuse/core'

const fileContent = ref('')

const { isSupported, open, data } = useFileSystemAccess({
  dataType: 'Text',
  types: [{
    description: 'Shapez2 Blueprint',
    accept: {
      'application/octet-stream': ['.spz2bp'],
    },
  }],
  excludeAcceptAllOption: true,
})

const handleFileOpen = async () => {
  await open()
  if (data.value) {
    fileContent.value = data.value.toString()
  }
}

const emit = defineEmits(['content-extracted'])

// Watch for changes in fileContent and emit the event
watch(fileContent, (newContent) => {
  emit('content-extracted', newContent)
})
</script>

<template>
  <div>
    <div v-if="isSupported">
      <UButton @click="handleFileOpen">Open SPZ2BP File</UButton>
    </div>
    <div v-else>
      File System Access API is not supported in your browser.
    </div>
  </div>
</template>