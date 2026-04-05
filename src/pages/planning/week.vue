<template>
  <div class="week-planner">
    <h1 class="text-center">Weekly Plan</h1>
    <div v-if="isLoading" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </div>
    <template v-else>
      <div v-for="row in weekRows" :key="row.iso" class="day-plan mb-4">
        <DailySummaryCard
          :date="row.day"
          :mealPlan="row.plan"
          :to="{ path: '/planning/day', query: { dt: row.iso } }"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import DailySummaryCard from '@/components/planning/DailySummaryCard.vue';
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { addDays, format, parseISO } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type DayRow = { day: Date; iso: string; plan?: MealPlan };

const { getMealPlansForPeriod } = useMealPlansData();
const route = useRoute();
const dateToISO = (date: Date) => format(date, 'yyyy-MM-dd');

const dt = computed(() => route.query.dt as string);
const weekDays = computed(() => [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(parseISO(dt.value), offset)));
const mealPlans = ref<MealPlan[]>([]);
const isLoading = ref(true);

const weekRows = computed<DayRow[]>(() =>
  weekDays.value.map((d) => {
    const iso = dateToISO(d);
    const plan = mealPlans.value.find((p) => p.date === iso);
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
