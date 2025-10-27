<template>
  <h2>This is where the editor for update will go</h2>
  <div>For: {{ id }}</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const { params } = useRoute();
const id = (params as { id: string }).id;
</script>
