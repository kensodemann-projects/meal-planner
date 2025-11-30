<template>
  <v-row dense>
    <v-col cols="6" md="1">
      <v-number-input
        density="compact"
        hide-details
        control-variant="hidden"
        :precision="null"
        :rules="[validationRules.required]"
        v-model="units"
        data-testid="units-input"
      ></v-number-input>
    </v-col>
    <v-col cols="6" md="2">
      <v-autocomplete
        density="compact"
        hide-details
        :items="unitsOfMeasure"
        :rules="[validationRules.required]"
        item-title="id"
        item-value="id"
        v-model="unitOfMeasureId"
        data-testid="unit-of-measure-input"
      ></v-autocomplete>
    </v-col>
    <v-col cols="11" md="8">
      <v-combobox
        density="compact"
        label="Food Item"
        item-title="name"
        hide-details
        :items="foods"
        :rules="[validationRules.required]"
        v-model="foodItem"
        data-testid="food-item-input"
      ></v-combobox>
    </v-col>
    <v-col cols="1" md="1" align-self="center">
      <v-btn
        density="compact"
        variant="plain"
        icon="mdi-delete-forever"
        @click="$emit('delete')"
        data-testid="delete-button"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { validationRules } from '@/core/validation-rules';
import { unitsOfMeasure } from '@/data/units-of-measure';
import type { FoodItem } from '@/models/food';
import type { RecipeIngredient } from '@/models/recipe';
import { computed } from 'vue';

const props = defineProps<{
  foods: FoodItem[];
  ingredient: RecipeIngredient;
}>();
const emit = defineEmits<{ (event: 'changed', payload: RecipeIngredient): void; (event: 'delete'): void }>();

const units = computed({
  get: () => props.ingredient.units,
  set: (units: number) =>
    emit('changed', {
      ...props.ingredient,
      units,
    }),
});

const unitOfMeasureId = computed({
  get: () => props.ingredient.unitOfMeasure.id,
  set: (id: string) => {
    const unitOfMeasure = findUnitOfMeasure(id);
    emit('changed', {
      ...props.ingredient,
      unitOfMeasure,
    });
  },
});

const foodItem = computed({
  get: () => {
    if (props.ingredient.foodId) {
      return props.foods.find((f) => f.id === props.ingredient.foodId);
    } else {
      return props.ingredient.name;
    }
  },
  set: (value: FoodItem | string) => {
    const isString = typeof value === 'string';
    const name = isString ? value : value?.name;
    const foodId = isString ? null : value?.id;
    emit('changed', {
      ...props.ingredient,
      name,
      foodId,
    });
  },
});
</script>
