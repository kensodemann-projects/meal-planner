<template>
  <div class="week-planner">
    <h1 class="text-center">Weekly Plan</h1>
    <div v-for="day in weekDays" :key="dateToISO(day)" class="day-plan">
      <h2>{{ intlFormat(day, { dateStyle: 'full' }) }}</h2>
      <v-divider class="my-2" />
      <div v-if="dailyMap.has(dateToISO(day))">
        <h4>Meals:</h4>
        <ul>
          <li v-for="meal in dailyMap.get(dateToISO(day))!.meals" :key="meal.id">{{ meal.name }}</li>
        </ul>
      </div>
      <div v-else>
        <p>No meal plan for this day.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MealPlan } from '@/models/meal-plan';
import { addDays, format, intlFormat } from 'date-fns';
import { MEAL_PLANS } from './mock-data';

// start date and end date will be obtained from the route
const startDate = '2025-12-28';
const [year, month, day] = startDate.split('-').map(Number);
const weekDays = [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(new Date(year!, month! - 1, day), offset));
const dateToISO = (date: Date) => format(date, 'yyyy-MM-dd');

const dailyPlans: MealPlan[] = MEAL_PLANS.filter(
  (plan) => plan.date >= dateToISO(weekDays[0]!) && plan.date <= dateToISO(weekDays[6]!),
);
// Eventually, this map should map to a format that includes the daily stats, etc. for display
const dailyMap = new Map(dailyPlans.map((plan) => [plan.date, plan]));
</script>
