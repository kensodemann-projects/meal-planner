<template>
  <div class="week-planner">
    <h1 class="text-center">Weekly Plan</h1>
    <div v-if="isLoading" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </div>
    <template v-else>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { addDays, format, intlFormat, parseISO } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type DayRow = { day: Date; iso: string; plan: MealPlan | null };

const { getMealPlansForPeriod } = useMealPlansData();
const route = useRoute();
const router = useRouter();
const dateToISO = (date: Date) => format(date, 'yyyy-MM-dd');

const dt = computed(() => route.query.dt as string);
const weekDays = computed(() => [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(parseISO(dt.value), offset)));
const mealPlans = ref<MealPlan[]>([]);
const isLoading = ref(true);

const weekRows = computed<DayRow[]>(() =>
  weekDays.value.map((d) => {
    const iso = dateToISO(d);
    const plan = mealPlans.value.find((p) => p.date === iso) ?? null;
    return { day: d, iso, plan };
  }),
);

const loadMealPlans = async () => {
  isLoading.value = true;
  try {
    mealPlans.value = await getMealPlansForPeriod(dateToISO(weekDays.value[0]!), dateToISO(weekDays.value[6]!));
  } finally {
    isLoading.value = false;
  }
};

watch(dt, loadMealPlans, { immediate: true });
</script>
