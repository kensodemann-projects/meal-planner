<template>
  <h1 class="text-center">My Recipes</h1>

  <v-list two-line>
    <RecipeListItem
      v-for="recipe in recipes"
      :key="recipe.id"
      :recipe="recipe as Recipe"
      @click="router.push(`recipes/${recipe.id}`)"
    />
  </v-list>

  <v-fab
    color="primary"
    icon="mdi-plus"
    variant="tonal"
    location="bottom end"
    absolute
    @click="router.push('recipes/add')"
    data-testid="add-button"
  ></v-fab>
</template>

<script lang="ts" setup>
import { useRecipesData } from '@/data/recipes';
import { useRouter } from 'vue-router';
import type { Recipe } from '@/models/recipe';

const router = useRouter();
const { recipes } = useRecipesData();
</script>
