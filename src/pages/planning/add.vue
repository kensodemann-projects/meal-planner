<template>
  <div>
    <h1 class="text-center">Add Daily Meal Plan</h1>
    <meal-item-editor :week-start-date="weekStartDate" @cancel="router.back()" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const weekStartDate = computed(() => route.query.weekStartDate as string);
</script>

<style scoped></style>
