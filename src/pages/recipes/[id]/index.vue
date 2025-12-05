<template>
  <div v-if="recipe">
    <RecipeView v-if="recipe" :recipe="recipe" />
  </div>
  <RouterLink to="/recipes">Back to Recipes List</RouterLink>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRecipesData } from '@/data/recipes';
import { ref } from 'vue';
import type { Recipe } from '@/models/recipe';

const recipe = ref<Recipe | null>(null);
const { params } = useRoute();
const id = (params as { id: string }).id;

const { getRecipe } = useRecipesData();
getRecipe(id).then((r) => {
  recipe.value = r;
});
</script>
