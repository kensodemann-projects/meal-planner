<template>
  <v-card
    data-testid="daily-summary-card"
    variant="outlined"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <v-card-title>{{ intlFormat(date, { dateStyle: 'full' }) }}</v-card-title>
    <v-card-subtitle>Nutrition Summary</v-card-subtitle>
    <v-card-text>
      <div data-testid="meals-summary">Meals: {{ meals }}</div>
      <NutritionData v-if="nutrition" :value="nutrition" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { MealPlan } from '@/models/meal-plan';
import type { Nutrition } from '@/models/nutrition';
import { intlFormat } from 'date-fns';
import { dailyMealPlanNutrients } from '@/core/nutritional-calculations';

const props = defineProps<{
  date: Date;
  mealPlan?: MealPlan;
}>();

const buildMealSummary = (mealPlan: MealPlan): string => {
  let summary = '';
  if (mealPlan.meals.find((m) => m.type === 'Breakfast')) summary += 'Breakfast';
  if (mealPlan.meals.find((m) => m.type === 'Lunch')) summary += `${summary ? ', ' : ''}Lunch`;
  if (mealPlan.meals.find((m) => m.type === 'Dinner')) summary += `${summary ? ', ' : ''}Dinner`;
  if (mealPlan.meals.find((m) => m.type === 'Snack')) summary += `${summary ? ', ' : ''}Snack`;
  return summary;
};

const nutrition: Nutrition | undefined =
  props.mealPlan && props.mealPlan.meals.length > 0 ? dailyMealPlanNutrients(props.mealPlan) : undefined;
const meals = props.mealPlan && props.mealPlan.meals.length > 0 ? buildMealSummary(props.mealPlan) : 'None';

defineEmits<{
  (event: 'click'): void;
}>();
</script>
