<script setup lang="ts">
const props = defineProps<{
  tag_name: string;
}>();
</script>

<template>
    <div class="tags-container">
      <UBadge
        variant="subtle"
        color="sky"
        class="mr-2 mb-2"
      >
        {{ props.tag_name }}

      </UBadge>
    </div>
  </template>