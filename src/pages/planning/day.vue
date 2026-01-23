<template>
  <h1 class="mb-4">{{ intlFormat(today, { dateStyle: 'long' }) }}</h1>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Breakfast</div>
      <v-btn
        v-if="!breakfast"
        density="compact"
        variant="text"
        icon="mdi-plus"
        data-testid="add-breakfast-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Lunch</div>
      <v-btn v-if="!lunch" density="compact" variant="text" icon="mdi-plus" data-testid="add-lunch-button"></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Dinner</div>
      <v-btn v-if="!dinner" density="compact" variant="text" icon="mdi-plus" data-testid="add-dinner-button"></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Snacks</div>
      <v-btn density="compact" variant="text" icon="mdi-plus" data-testid="add-snack-button"></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
</template>

<script setup lang="ts">
import type { Meal } from '@/models/meal';
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { intlFormat } from 'date-fns';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// const emptyMeal: Meal = {
//   id: crypto.randomUUID(),
//   type: 'Dinner',
//   items: [],
// };

const { getMealPlanForDate } = useMealPlansData();
const mealPlan = ref<MealPlan>();
const breakfast = ref<Meal | undefined>();
const lunch = ref<Meal | undefined>();
const dinner = ref<Meal | undefined>();

const route = useRoute();
// TODO: Add error handling for invalid or missing date
const dt = route.query.dt as string;
const [year, month, day] = dt.split('-').map(Number);
const today = new Date(year!, month! - 1, day);

getMealPlanForDate(dt).then((plan) => {
  mealPlan.value = plan || {
    date: dt,
    meals: [],
  };
  breakfast.value = mealPlan.value.meals.find((meal) => meal.type === 'Breakfast');
  lunch.value = mealPlan.value.meals.find((meal) => meal.type === 'Lunch');
  dinner.value = mealPlan.value.meals.find((meal) => meal.type === 'Dinner');
});
</script>
