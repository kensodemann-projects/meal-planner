<template>
  <div class="week-planner">
    <h1 class="text-center">Weekly Plan</h1>
    <p v-if="loadError" data-testid="load-error">{{ loadError }}</p>
    <div v-for="row in weekRows" :key="row.iso" class="day-plan">
      <h2 @click="router.push({ path: '/planning/day', query: { dt: row.iso } })">
        {{ intlFormat(row.day, { dateStyle: 'full' }) }}
      </h2>
      <v-divider class="my-2" />
      <div v-if="row.plan">
        <h4>Meals:</h4>
        <ul>
          <li v-for="meal in row.plan.meals" :key="meal.id">{{ meal.type }}</li>
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
import { addDays, format, intlFormat, parseISO } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMealPlansData } from '@/data/meal-plans';

type DayRow = { day: Date; iso: string; plan: MealPlan | null };

const { getMealPlansForPeriod } = useMealPlansData();
const route = useRoute();
const router = useRouter();
const dateToISO = (date: Date) => format(date, 'yyyy-MM-dd');

const dt = computed(() => route.query.dt as string);
const weekDays = computed(() => [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(parseISO(dt.value), offset)));
const mealPlans = ref<MealPlan[]>([]);
const loadError = ref<string | null>(null);

const weekRows = computed<DayRow[]>(() =>
  weekDays.value.map((d) => {
    const iso = dateToISO(d);
    const plan = mealPlans.value.find((p) => p.date === iso) ?? null;
    return { day: d, iso, plan };
  }),
);

const loadMealPlans = async () => {
  try {
    loadError.value = null;
    const days = weekDays.value;
    mealPlans.value = await getMealPlansForPeriod(dateToISO(days[0]!), dateToISO(days[6]!));
  } catch {
    loadError.value = 'Failed to load meal plans. Please check your connection and try again.';
  }
};

watch(() => route.query.dt, loadMealPlans, { immediate: true });
</script>
