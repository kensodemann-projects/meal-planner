<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Select Food Item or Recipe"
          v-model="mealItemId"
          :items="values"
          item-title="name"
          item-value="id"
          :rules="[validationRules.required]"
          data-testid="food-or-recipe-input"
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
  </v-container>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';
import { computed } from 'vue';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';

const props = defineProps<{
  values: (FoodItem | Recipe)[];
  type: 'food' | 'recipe';
}>();
const modelValue = defineModel<Partial<MealItem>>();

const mealItemId = computed({
  get: () => (props.type === 'food' ? modelValue.value?.foodItemId : modelValue.value?.recipeId),
  set: (id: string) =>
    (modelValue.value = {
      ...modelValue.value,
      [props.type === 'food' ? 'foodId' : 'recipeId']: id,
      name: props.values.find((item) => item.id === id)?.name || '',
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
</script>

<style scoped></style>
