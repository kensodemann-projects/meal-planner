<template>
  <h1 class="text-center">My Recipes</h1>

  <div>
    <v-container fluid dense>
      <v-row dense>
        <v-col cols="12">
          <v-text-field placeholder="Search for a recipe..." data-testid="search-input" clearable></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="Category"
            :items="recipeCategories"
            data-testid="filter-category"
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete label="Cuisine" :items="cuisines" data-testid="filter-cuisine" clearable></v-autocomplete>
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete
            label="Calorie Range"
            :items="['0-500', '501-750', '751-1000', '1001+']"
            data-testid="filter-calorie-range"
            clearable
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col class="text-right text-medium-emphasis font-weight-light">
          <div v-if="!loading">
            Displaying {{ filteredRecipes.length }} of {{ recipes.length }} recipe{{ recipes.length === 1 ? '' : 's' }}.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <div class="text-center my-12" v-if="!loading && recipes.length === 0">
    <h2>No recipes found.</h2>
  </div>

  <div class="text-center my-12" v-else-if="!loading && filteredRecipes.length === 0">
    <h2>No recipes match your search criteria.</h2>
  </div>
  <v-list v-else two-line>
    <RecipeListItem
      v-for="recipe in filteredRecipes"
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
import { recipeCategories } from '@/data/recipe-categories';
import { cuisines } from '@/data/cuisines';
import { computed } from 'vue';

const router = useRouter();
const { loading, recipes } = useRecipesData();

const filteredRecipes = computed<Recipe[]>(() => {
  // Filtering logic will go here in the future
  return recipes.value;
});
</script>
