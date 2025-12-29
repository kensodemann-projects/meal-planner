<template>
  <div class="error-page text-center" role="alert">
    <v-icon class="death-icon" icon="mdi-death-star-variant" aria-hidden="true" />
    <div class="title">I find this failure to load to be disturbing.</div>
    <div class="subtitle">This is not the page you are looking for.</div>
  </div>
</template>

<script setup lang="ts">
//
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

<route lang="yaml">
meta:
  allowAnonymous: true
</route>
