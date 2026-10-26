<template>
  <div>
    <h1 v-if="heading">{{ heading }}</h1>
    <p v-if="!heading">This meal type is not recognized.</p>
    <template v-else-if="settled">
      <p v-if="rows.length === 0">No recipes planned for this meal today.</p>
      <template v-else>
        <div v-for="row in rows" :key="row.item.id">
          <template v-if="row.recipe">
            <p>Planned servings: {{ row.item.servings }}</p>
            <RecipeView :recipe="row.recipe" :heading-level="2" />
          </template>
          <template v-else>
            {{ row.item.name }}
            <p>Recipe unavailable.</p>
          </template>
        </div>
      </template>
    </template>
    <CloseButton @click="router.push('/dashboard')" />
  </div>
</template>

<script setup lang="ts">
import { dateToISO } from '@/core/dates';
import { useMealPlansData } from '@/data/meal-plans';
import { useRecipesData } from '@/data/recipes';
import type { MealItem, MealType } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Recipe } from '@/models/recipe';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const MEAL_QUERIES = {
  breakfast: { heading: 'Breakfast', mealType: 'Breakfast' },
  lunch: { heading: 'Lunch', mealType: 'Lunch' },
  dinner: { heading: 'Dinner', mealType: 'Dinner' },
  snack: { heading: 'Snacks', mealType: 'Snack' },
} as const satisfies Record<string, { heading: string; mealType: MealType }>;

type MealQuery = keyof typeof MEAL_QUERIES;

type MealRecipeRow = {
  item: MealItem;
  recipe: Recipe | null;
};

const isMealQuery = (value: unknown): value is MealQuery => typeof value === 'string' && value in MEAL_QUERIES;

const route = useRoute();
const router = useRouter();
const { getMealPlanForDate } = useMealPlansData();
const { getRecipe } = useRecipesData();

const settled = ref(false);
const rows = ref<MealRecipeRow[]>([]);
// A newer mealType must not apply a lookup started for an older one.
let requestGeneration = 0;

const heading = computed(() => {
  const mealType = route.query.mealType;
  return isMealQuery(mealType) ? MEAL_QUERIES[mealType].heading : null;
});

const loadMealRecipes = async (mealQuery: MealQuery) => {
  const generation = ++requestGeneration;
  settled.value = false;
  rows.value = [];

  const { mealType } = MEAL_QUERIES[mealQuery];

  let plan: MealPlan | null;
  try {
    plan = await getMealPlanForDate(dateToISO(new Date()));
  } catch {
    if (generation !== requestGeneration) return;
    settled.value = true;
    return;
  }

  if (generation !== requestGeneration) return;

  const items = plan?.meals.filter((meal) => meal.type === mealType).flatMap((meal) => meal.items) ?? [];

  if (items.length === 0) {
    settled.value = true;
    return;
  }

  const loadedRows = await Promise.all(
    items.map(async (item): Promise<MealRecipeRow> => {
      try {
        return { item, recipe: await getRecipe(item.recipeId) };
      } catch {
        return { item, recipe: null };
      }
    }),
  );

  if (generation !== requestGeneration) return;
  rows.value = loadedRows;
  settled.value = true;
};

watch(
  () => route.query.mealType,
  (mealType) => {
    if (!isMealQuery(mealType)) {
      requestGeneration += 1;
      settled.value = false;
      rows.value = [];
      return;
    }
    loadMealRecipes(mealType);
  },
  { immediate: true },
);
</script>
