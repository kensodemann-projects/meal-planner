<template>
  <!-- Currently a placeholder layout, this is being used as a testing harness for now -->
  <h2>Recipes</h2>
  <v-divider class="mb-4"></v-divider>
  <MealItemEditorCard v-model="recipeMealItem" :items="recipes" :meal-item="{}" type="recipe" />

  <h2>Additional Foods</h2>
  <v-divider class="mb-4"></v-divider>
  <MealItemEditorCard v-model="foodMealItem" :items="foods" :meal-item="{}" type="food" />

  <h2>Total Nutrition</h2>
  <v-divider class="mb-4"></v-divider>

  <v-container fluid>
    <v-row class="pa-4" justify="end">
      <CancelButton class="mr-4" @click="$emit('cancel')" />
      <SaveButton :disabled="!(valid && isModified)" @click="save" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';
import type { Meal, MealItem } from '@/models/meal';
import { computed, ref } from 'vue';

const emit = defineEmits<{ (event: 'save', payload: Meal): void; (event: 'cancel'): void }>();
const props = defineProps<{ meal?: Meal }>();

const { foods } = useFoodsData();
const { recipes } = useRecipesData();

const foodMealItem = ref<MealItem>();
const recipeMealItem = ref<MealItem>();

const valid = ref(false);

const isModified = computed((): boolean => false);

const save = () => {
  const mealToSave: Meal = {
    id: props.meal?.id ?? 'new-meal-id',
    type: props.meal?.type ?? 'Lunch',
    items: props.meal?.items ?? [],
  };
  emit('save', mealToSave);
};
</script>

<style scoped></style>
