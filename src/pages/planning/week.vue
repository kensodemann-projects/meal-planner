<template>
  <div v-if="paramsValid" class="week-planner">
    <h1 class="text-center">Weekly Plan</h1>
    <div v-for="row in weekRows" :key="row.iso" class="day-plan">
      <h2>{{ intlFormat(row.day, { dateStyle: 'full' }) }}</h2>
      <v-divider class="my-2" />
      <div v-if="row.plan">
        <h4>Meals:</h4>
        <ul>
          <li v-for="meal in row.plan.meals" :key="meal.id">{{ meal.name }}</li>
        </ul>
      </div>
      <div v-else>
        <p>No meal plan for this day.</p>
      </div>
    </div>
  </div>

  <page-load-error v-else message="Invalid date parameter in URL." />
</template>

<script setup lang="ts">
import PageLoadError from '@/components/PageLoadError.vue';
import type { MealPlan } from '@/models/meal-plan';
import { addDays, format, intlFormat, isValid } from 'date-fns';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { MEAL_PLANS } from './mock-data';

const route = useRoute();
const paramsValid = (() => {
  const dt = route.query.dt as string | undefined;
  return !!(dt && isValid(new Date(dt)));
})();

const startDate = paramsValid ? (route.query.dt as string) : format(new Date(), 'yyyy-MM-dd');
const [year, month, day] = startDate.split('-').map(Number);
const weekDays = [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(new Date(year!, month! - 1, day), offset));
const dateToISO = (date: Date) => format(date, 'yyyy-MM-dd');

type DayRow = { day: Date; iso: string; plan: MealPlan | null };
const weekRows = computed<DayRow[]>(() =>
  weekDays.map((d) => {
    const iso = dateToISO(d);
    const plan = MEAL_PLANS.find((p) => p.date === iso) ?? null;
    return { day: d, iso, plan };
  }),
);
</script>
