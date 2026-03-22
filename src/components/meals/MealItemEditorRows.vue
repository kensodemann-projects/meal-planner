<template>
  <v-container fluid dense>
    <v-row>
      <v-col cols="12" md="4">
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
      <v-col cols="12" md="4">
        <v-number-input
          label="Units"
          v-model="units"
          :rules="[validationRules.required]"
          disabled
          data-testid="units-input"
        ></v-number-input>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Unit of Measure"
          v-model="unitOfMeasureId"
          :items="unitOfMeasureOptions"
          :rules="[validationRules.required]"
          disabled
          data-testid="unit-of-measure-input"
        ></v-autocomplete>
      </v-col>
    </v-row>

    <NutritionEditorRows v-model="nutrition" />
  </v-container>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { validationRules } from '@/core/validation-rules';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
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

const units = computed({
  get: () => mealItem.value?.units,
  set: (units: number) => {
    mealItem.value = {
      ...mealItem.value,
      units,
      nutrition: getNutrition(recipeId.value) || ({} as Nutrition),
    };
  },
});

const unitOfMeasureId = computed({
  get: () => mealItem.value?.unitOfMeasure?.id,
  set: (id: string) => {
    const unitOfMeasure = findUnitOfMeasure(id);
    mealItem.value = {
      ...mealItem.value,
      unitOfMeasure,
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
