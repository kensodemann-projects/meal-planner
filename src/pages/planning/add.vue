<template>
  <div>
    <h1>Test the Editor</h1>
  </div>
  <MealItemEditorCard :mealItem="mealItem" :items="recipes" />
</template>

<script setup lang="ts">
import type { MealItem } from '@/models/meal';
import { useRecipesData } from '@/data/recipes';
import { ref } from 'vue';

const mealItem = ref<Partial<MealItem>>({});
const { recipes } = useRecipesData();
</script>

<style scoped></style>
