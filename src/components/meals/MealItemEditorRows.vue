<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-autocomplete
          :label="`Select ${props.type === 'food' ? 'Food' : 'Recipe'}`"
          v-model="recipeOrFoodId"
          :items="values"
          item-title="name"
          item-value="id"
          :rules="[validationRules.required]"
          data-testid="recipe-or-food-input"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="4">
        <v-number-input
          label="Units"
          v-model="units"
          :rules="[validationRules.required]"
          :disabled="type === 'recipe'"
          data-testid="units-input"
        ></v-number-input>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Unit of Measure"
          v-model="unitOfMeasureId"
          :items="unitOfMeasureOptions"
          :rules="[validationRules.required]"
          :disabled="type === 'recipe'"
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
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import { computed } from 'vue';

const props = defineProps<{
  values: (FoodItem | Recipe)[];
  type: 'food' | 'recipe';
}>();
const modelValue = defineModel<Partial<MealItem>>();

const getNutritionFromItem = (id: string): Nutrition => {
  const item = props.values.find((v) => v.id === id);
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
  return {
    calories: 0,
    sodium: 0,
    sugar: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
};

const recipeOrFoodId = computed({
  get: () => (props.type === 'food' ? modelValue.value?.foodItemId : modelValue.value?.recipeId),
  set: (id: string) =>
    (modelValue.value = {
      ...modelValue.value,
      [props.type === 'food' ? 'foodItemId' : 'recipeId']: id,
      name: props.values.find((item) => item.id === id)?.name || '',
      nutrition: getNutritionFromItem(id),
    }),
});

const units = computed({
  get: () => modelValue.value?.units || (props.type === 'recipe' ? 1 : undefined),
  set: (value: number) => {
    modelValue.value = {
      ...modelValue.value,
      units: value,
    };
  },
});

const unitOfMeasureId = computed({
  get: () => modelValue.value?.unitOfMeasure?.id || (props.type === 'recipe' ? 'serving' : undefined),
  set: (id: string) =>
    (modelValue.value = {
      ...modelValue.value,
      unitOfMeasure: findUnitOfMeasure(id || ''),
    }),
});

const nutrition = computed({
  get: () => modelValue.value?.nutrition || {},
  set: (value) => {
    modelValue.value = {
      ...modelValue.value,
      nutrition: value as Nutrition,
    };
  },
});
</script>

<style scoped></style>
