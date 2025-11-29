<template>
  <v-row dense>
    <v-col cols="6" md="1">
      <v-number-input
        density="compact"
        hide-details
        control-variant="hidden"
        data-testid="units-input"
      ></v-number-input>
    </v-col>
    <v-col cols="6" md="2">
      <v-autocomplete
        density="compact"
        hide-details
        :items="unitsOfMeasure"
        item-title="id"
        item-value="id"
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
        v-model="foodItem"
        data-testid="food-item-input"
      ></v-combobox>
    </v-col>
    <v-col cols="1" md="1" align-self="center">
      <v-btn density="compact" variant="plain" icon="mdi-delete-forever" data-testid="delete-button"></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { unitsOfMeasure } from '@/data/units-of-measure';
import type { FoodItem } from '@/models/food';
import type { RecipeIngredient } from '@/models/recipe';
import { computed } from 'vue';

const props = defineProps<{
  foods: FoodItem[];
}>();
const ingredient = defineModel<RecipeIngredient>();

const foodItem = computed({
  get: () => {
    if (ingredient.value?.foodId) {
      return props.foods.find((f) => f.id === ingredient.value?.foodId);
    } else {
      return ingredient.value?.name;
    }
  },
  set: (value: FoodItem | string) => {
    const isString = typeof value === 'string';
    const name = isString ? value : value?.name;
    const foodId = isString ? null : value?.id;
    if (ingredient.value) {
      ingredient.value = {
        ...ingredient.value,
        name,
        foodId,
      };
    }
  },
});
</script>
