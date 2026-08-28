<template>
  <div>
    <h1 class="text-center">Add Daily Meal Plan</h1>
    <meal-item-editor :week-start-date="weekStartDate" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const weekStartDate = computed(() => route.query.weekStartDate as string);
</script>

<style scoped></style>
