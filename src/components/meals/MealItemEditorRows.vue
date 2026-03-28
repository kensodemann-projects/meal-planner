<template>
  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <v-autocomplete
          label="Select Recipe"
          v-model="recipeId"
          :items="items"
          item-title="name"
          item-value="id"
          :rules="[validationRules.required]"
          data-testid="recipe-input"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="6">
        <v-number-input
          label="Servings"
          v-model="servings"
          :rules="[validationRules.required]"
          data-testid="servings-input"
        ></v-number-input>
      </v-col>
    </v-row>

    <NutritionEditorRows v-model="nutrition" />
  </v-container>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import type { MealItem } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import { computed } from 'vue';

const props = defineProps<{
  items: Recipe[];
}>();
const mealItem = defineModel<Partial<MealItem>>();

const getNutritionFromRecipe = (id: string): Nutrition | undefined => {
  const item = props.items.find((v) => v.id === id);
  if (item) {
    return {
      calories: item.calories,
      sodium: item.sodium,
      sugar: item.sugar,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    };
  }
};

const getNutrition = (id: string | undefined): Nutrition | undefined => {
  if (id) {
    return getNutritionFromRecipe(id);
  }
  return undefined;
};

const recipeId = computed({
  get: () => mealItem.value?.recipeId,
  set: (id: string) => {
    mealItem.value = {
      ...mealItem.value,
      recipeId: id,
      name: props.items.find((item) => item.id === id)?.name || '',
      nutrition: getNutrition(id) || ({} as Nutrition),
    };
  },
});

const servings = computed({
  get: () => mealItem.value?.servings,
  set: (servings: number) => {
    mealItem.value = {
      ...mealItem.value,
      servings,
      nutrition: getNutrition(recipeId.value) || ({} as Nutrition),
    };
  },
});

const nutrition = computed({
  get: () => mealItem.value?.nutrition || {},
  set: (value) => {
    mealItem.value = {
      ...mealItem.value,
      nutrition: value as Nutrition,
    };
  },
});
</script>

<style scoped></style>
