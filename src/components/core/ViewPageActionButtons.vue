<template>
  <div class="page-actions mt-4">
    <CloseButton @click="$emit('close')" />
    <ModifyButton class="ml-8" @click="$emit('modify')" />
    <DeleteButton class="ml-8" @click="$emit('delete')" />
  </div>
</template>

<script setup lang="ts">
defineEmits(['close', 'modify', 'delete']);
</script>
