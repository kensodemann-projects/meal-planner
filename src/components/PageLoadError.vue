<template>
  <div class="page-load-error text-center">
    <v-icon class="death-icon" icon="mdi-death-star-variant" />
    <div class="title">I find this failure to load to be disturbing.</div>
    <div class="subtitle">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<style scoped>
.death-icon {
  font-size: 18rem;
  font-weight: 300;
}

.title {
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 1rem;
}

.subtitle {
  font-size: 1rem;
  font-weight: 300;
  margin-top: 0.5rem;
}
</style>
