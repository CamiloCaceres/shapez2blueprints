<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

interface Tag {
  id: string;
  name: string;
}

const props = defineProps<{
  tags: Tag[];
}>();

const emit = defineEmits(['update:tags']);

const localTags = ref<Tag[]>([...props.tags]);

watch(() => props.tags, (newTags) => {
  localTags.value = [...newTags];
}, { deep: true });

watch(localTags, (newTags) => {
  emit('update:tags', newTags);
}, { deep: true });

const removeTag = (tagToRemove: Tag) => {
  localTags.value = localTags.value.filter(tag => tag.id !== tagToRemove.id);
};
</script>

<template>
  <div class="tags-container">
    <UBadge
      v-for="tag in localTags"
      :key="tag.id"
      variant="subtle"
      color="amber"
      class="mr-2 mb-2"
      @click="removeTag(tag)"
    >
      {{ tag.name }}
      <UIcon name="i-heroicons-x-mark" class="ml-1 cursor-pointer" />
    </UBadge>
  </div>
</template>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
}
</style>

