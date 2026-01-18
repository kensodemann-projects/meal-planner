<template>
  <h1>{{ intlFormat(today, { dateStyle: 'full' }) }}</h1>
  <h2>Breakfast</h2>
  <h2>Lunch</h2>
  <h2>Dinner</h2>
  <h2>Snacks</h2>
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
