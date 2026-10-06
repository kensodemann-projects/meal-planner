<template>
  <RecipeEditor @cancel="router.replace('/recipes')" @save="saveRecipe" />
</template>

<script setup lang="ts">
import { useRecipesData } from '@/data/recipes';
import type { Recipe } from '@/models/recipe';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addRecipe } = useRecipesData();

const saveRecipe = async (recipe: Recipe) => {
  await addRecipe(recipe);
  router.replace('/recipes');
};
</script>
