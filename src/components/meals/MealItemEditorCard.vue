<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <MealItemEditorRows v-model="editMealItem" :type="type" :items="[]" />
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

const isModified = computed(() => false);
</script>

<style scoped></style>
