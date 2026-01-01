<template>
  <div></div>
</template>

<script setup lang="ts">
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';

defineProps<{
  values: (FoodItem | Recipe)[];
}>();
defineModel<Partial<MealItem>>();
</script>

<style scoped></style>
