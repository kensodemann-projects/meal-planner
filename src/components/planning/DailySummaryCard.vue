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
      <!--
      <div>
        Days with Meals: <strong>{{ week.daysWithMeals }}</strong>
      </div>
      <div>
        Average Calories: <strong>{{ week.averageCalories }}</strong>
      </div>
      <div>
        Average Protein: <strong>{{ week.averageProtein }}g</strong>
      </div>
      <div>
        Average Carbs: <strong>{{ week.averageCarbs }}g</strong>
      </div>
      -->
      <p>Click to view details</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { MealPlan } from '@/models/meal-plan';
import { intlFormat } from 'date-fns';

defineProps<{
  date: Date;
  mealPlan?: MealPlan;
}>();

defineEmits<{
  (event: 'click'): void;
}>();
</script>
