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

const scaleNutrition = (nutrition: Nutrition, factor: number): Nutrition => ({
  calories: nutrition.calories * factor,
  sodium: nutrition.sodium * factor,
  sugar: nutrition.sugar * factor,
  protein: nutrition.protein * factor,
  carbs: nutrition.carbs * factor,
  fat: nutrition.fat * factor,
});

const recipeId = computed({
  get: () => mealItem.value?.recipeId,
  set: (id: string) => {
    const recipe = props.items.find((item) => item.id === id);
    const baseNutrition = getNutritionFromRecipe(id);
    const nutrition = baseNutrition && scaleNutrition(baseNutrition, mealItem.value?.servings || 1);
    mealItem.value = {
      ...mealItem.value,
      recipeId: id,
      name: recipe?.name || '',
      nutrition,
    };
  },
});

const servings = computed({
  get: () => mealItem.value?.servings,
  set: (newServings: number) => {
    if (newServings) {
      const oldServings = mealItem.value?.servings || 1;
      const nutrition =
        mealItem.value?.nutrition && scaleNutrition(mealItem.value?.nutrition, newServings / oldServings);
      mealItem.value = {
        ...mealItem.value,
        servings: newServings,
        nutrition,
      };
    }
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
