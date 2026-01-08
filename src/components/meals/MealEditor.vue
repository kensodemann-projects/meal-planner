<template>
  <!-- Currently a placeholder layout, this is being used as a testing harness for now -->
  <h2>
    <div class="d-flex justify-space-between">
      <div>Recipes</div>
      <v-btn
        density="compact"
        variant="text"
        icon="mdi-plus"
        :disabled="recipeMealItem !== null"
        @click="() => (recipeMealItem = {})"
        data-testid="add-portion-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <MealItemEditorCard v-if="recipeMealItem !== null" :meal-item="recipeMealItem" :items="recipes" type="recipe" />

  <h2>
    <div class="d-flex justify-space-between">
      <div>Additional Foods</div>
      <v-btn
        density="compact"
        variant="text"
        icon="mdi-plus"
        :disabled="foodMealItem !== null"
        @click="() => (foodMealItem = {})"
        data-testid="add-portion-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <MealItemEditorCard v-if="foodMealItem !== null" :meal-item="foodMealItem" :items="foods" type="food" />

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

const foodMealItem = ref<Partial<MealItem> | null>(null);
const recipeMealItem = ref<Partial<MealItem> | null>(null);

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
