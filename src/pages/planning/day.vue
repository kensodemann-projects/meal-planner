<template>
  <div>{{ intlFormat(today, { dateStyle: 'full' }) }}</div>
  <MealEditor :meal="emptyMeal" />
</template>

<script setup lang="ts">
import type { Meal } from '@/models/meal';
import { intlFormat } from 'date-fns';
import { useRoute } from 'vue-router';

const emptyMeal: Meal = {
  id: crypto.randomUUID(),
  type: 'Dinner',
  items: [],
};

const route = useRoute();
const dt = route.query.dt as string;
const [year, month, day] = dt.split('-').map(Number);
const today = new Date(year!, month! - 1, day);
</script>
