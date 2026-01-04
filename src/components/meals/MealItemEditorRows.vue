<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-autocomplete
          :label="`Select ${props.type === 'food' ? 'Food' : 'Recipe'}`"
          v-model="recipeOrFoodId"
          :items="items"
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
import { foodItemNutrients } from '@/core/nutritional-calculations';
import { validationRules } from '@/core/validation-rules';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import type { UnitOfMeasure } from '@/models/unit-of-measure';
import { computed } from 'vue';

const props = defineProps<{
  items: (FoodItem | Recipe)[];
  type: 'food' | 'recipe';
}>();
const mealItem = defineModel<Partial<MealItem>>();

const getNutritionFromFoodItem = (id: string, units: number, unitOfMeasure: UnitOfMeasure): Nutrition | undefined => {
  const item = props.items.find((v) => v.id === id);
  if (item) {
    return foodItemNutrients(item as FoodItem, units, unitOfMeasure);
  }
};

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

const getNutrition = (
  id: string | undefined,
  units: number | undefined,
  unitOfMeasure: UnitOfMeasure | undefined,
): Nutrition | undefined => {
  if (props.type === 'food' && id && units && unitOfMeasure) {
    return getNutritionFromFoodItem(id, units, unitOfMeasure);
  } else if (props.type === 'recipe' && id) {
    return getNutritionFromRecipe(id);
  }
  return undefined;
};

const recipeOrFoodId = computed({
  get: () => (props.type === 'food' ? mealItem.value?.foodItemId : mealItem.value?.recipeId),
  set: (id: string) => {
    const unitOfMeasure = unitOfMeasureId.value ? findUnitOfMeasure(unitOfMeasureId.value) : undefined;
    mealItem.value = {
      ...mealItem.value,
      [props.type === 'food' ? 'foodItemId' : 'recipeId']: id,
      name: props.items.find((item) => item.id === id)?.name || '',
      nutrition: getNutrition(id, units.value, unitOfMeasure) || ({} as Nutrition),
    };
  },
});

const units = computed({
  get: () => mealItem.value?.units,
  set: (units: number) => {
    const unitOfMeasure = unitOfMeasureId.value ? findUnitOfMeasure(unitOfMeasureId.value) : undefined;
    mealItem.value = {
      ...mealItem.value,
      units,
      nutrition: getNutrition(recipeOrFoodId.value, units, unitOfMeasure) || ({} as Nutrition),
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
      nutrition: getNutrition(recipeOrFoodId.value, units.value, unitOfMeasure) || ({} as Nutrition),
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
