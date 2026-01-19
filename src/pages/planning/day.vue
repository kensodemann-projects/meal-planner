<template>
  <h1 class="mb-4">{{ intlFormat(today, { dateStyle: 'long' }) }}</h1>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Breakfast</div>
      <v-btn density="compact" variant="text" icon="mdi-plus" data-testid="add-breakfast-button"></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Lunch</div>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Dinner</div>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Snacks</div>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
</template>

<script setup lang="ts">
// import type { Meal } from '@/models/meal';
import { intlFormat } from 'date-fns';
import { useRoute } from 'vue-router';

// const emptyMeal: Meal = {
//   id: crypto.randomUUID(),
//   type: 'Dinner',
//   items: [],
// };

const route = useRoute();
const dt = route.query.dt as string;
const [year, month, day] = dt.split('-').map(Number);
const today = new Date(year!, month! - 1, day);
</script>
