<template>
  <h1 class="text-center">My Recipes</h1>

  <div>
    <v-container fluid dense>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            placeholder="Search for a recipe..."
            v-model="searchKeywords"
            clearable
            data-testid="search-input"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="Category"
            v-model="categoryFilter"
            :items="recipeCategories"
            clearable
            data-testid="filter-category"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete
            label="Cuisine"
            v-model="cuisineFilter"
            :items="cuisines"
            data-testid="filter-cuisine"
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete
            label="Calorie Range"
            v-model="calorieFilterId"
            :items="calorieRanges"
            item-title="label"
            item-value="id"
            data-testid="filter-calorie-range"
            clearable
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col class="text-right text-medium-emphasis font-weight-light">
          <div v-if="!loading" data-testid="recipe-count">
            Displaying {{ filteredRecipes.length }} of {{ recipes.length }} recipe{{ recipes.length === 1 ? '' : 's' }}
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
import { cuisines } from '@/data/cuisines';
import { recipeCategories } from '@/data/recipe-categories';
import { useRecipesData } from '@/data/recipes';
import type { Cuisine, Recipe, RecipeCategory } from '@/models/recipe';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { loading, recipeMatches, recipes } = useRecipesData();

const calorieRanges = [
  { id: 1, label: '0-500', min: 0, max: 500 },
  { id: 2, label: '501-750', min: 501, max: 750 },
  { id: 3, label: '751-1000', min: 751, max: 1000 },
  { id: 4, label: '1001+', min: 1001, max: Infinity },
];

const searchKeywords = ref('');
const categoryFilter = ref<RecipeCategory>();
const cuisineFilter = ref<Cuisine>();
const calorieFilterId = ref<number>();

// Parse and validate query parameters on mount
const parseCalorieRangeFromQuery = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  const validRange = calorieRanges.find((range) => range.id === parsed);
  return validRange ? parsed : undefined;
};

const parseCategoryFromQuery = (value: string | null): RecipeCategory | undefined => {
  if (!value) return undefined;
  return recipeCategories.includes(value as RecipeCategory) ? (value as RecipeCategory) : undefined;
};

const parseCuisineFromQuery = (value: string | null): Cuisine | undefined => {
  if (!value) return undefined;
  return cuisines.includes(value as Cuisine) ? (value as Cuisine) : undefined;
};

// Initialize state from URL query parameters
onMounted(() => {
  const query = route.query;
  if (query.search && typeof query.search === 'string') {
    searchKeywords.value = query.search;
  }
  if (query.category && typeof query.category === 'string') {
    categoryFilter.value = parseCategoryFromQuery(query.category);
  }
  if (query.cuisine && typeof query.cuisine === 'string') {
    cuisineFilter.value = parseCuisineFromQuery(query.cuisine);
  }
  if (query.calorieRange && typeof query.calorieRange === 'string') {
    calorieFilterId.value = parseCalorieRangeFromQuery(query.calorieRange);
  }
});

// Debounced search update
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchKeywords, () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  searchDebounceTimer = setTimeout(() => {
    updateQueryParams();
  }, 500);
});

// Immediate filter updates
watch([categoryFilter, cuisineFilter, calorieFilterId], () => {
  updateQueryParams();
});

// Update URL query parameters
const updateQueryParams = () => {
  const query: Record<string, string> = {};

  if (searchKeywords.value) {
    query.search = searchKeywords.value;
  }
  if (categoryFilter.value) {
    query.category = categoryFilter.value;
  }
  if (cuisineFilter.value) {
    query.cuisine = cuisineFilter.value;
  }
  if (calorieFilterId.value) {
    query.calorieRange = String(calorieFilterId.value);
  }

  router.replace({ query });
};

const filteredRecipes = computed<Recipe[]>(() => {
  const selectedCalorieRange = calorieRanges.find((range) => range.id === calorieFilterId.value);
  return recipes.value.filter((recipe) =>
    recipeMatches(recipe, {
      keywords: searchKeywords.value,
      category: categoryFilter.value,
      cuisine: cuisineFilter.value,
      minCalories: selectedCalorieRange?.min,
      maxCalories: selectedCalorieRange?.max,
    }),
  );
});
</script>
