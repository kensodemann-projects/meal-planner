<template>
  <page-load-error message="An error occurred while loading this page." />
</template>

<script setup lang="ts">
import PageLoadError from '@/components/PageLoadError.vue';
</script>

<route lang="yaml">
meta:
  allowAnonymous: true
</route>
