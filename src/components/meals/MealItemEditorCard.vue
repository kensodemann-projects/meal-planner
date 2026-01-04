<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <MealItemEditorRows v-model="editMealItem" :type="type" :items="items" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified && valid)" @click="$emit('save', editMealItem as MealItem)" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import { computed, ref } from 'vue';

const props = defineProps<{
  mealItem?: Partial<MealItem>;
  items: (FoodItem | Recipe)[];
  type: 'food' | 'recipe';
}>();

const editMealItem = ref<Partial<MealItem>>(
  props.mealItem || {
    units: props.type === 'recipe' ? 1 : undefined,
    unitOfMeasure: props.type === 'recipe' ? findUnitOfMeasure('serving') : undefined,
  },
);
const valid = ref(false);

const isModified = computed(() => {
  if (!props.mealItem) return true;
  const fields: (keyof Nutrition)[] = ['calories', 'sodium', 'sugar', 'carbs', 'fat', 'protein'];
  if (
    editMealItem.value.unitOfMeasure?.id !== props.mealItem?.unitOfMeasure?.id ||
    editMealItem.value.units !== props.mealItem?.units
  ) {
    return true;
  }
  return fields.some((field) => editMealItem.value.nutrition?.[field] !== props.mealItem!.nutrition![field]);
});
</script>

<style scoped></style>
