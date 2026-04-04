<template>
  <h1 class="text-center">Planning &amp; Logging</h1>

  <h2>Current Weeks</h2>
  <v-divider class="my-4"></v-divider>

  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <WeeklySummaryCard
          v-if="thisWeek"
          title="This Week"
          :week="thisWeek"
          @click="router.push({ path: 'planning/week', query: { dt: dateToISO(thisWeek.startDate) } })"
        />
      </v-col>
      <v-col cols="12" md="6">
        <WeeklySummaryCard
          v-if="nextWeek"
          title="Next Week (Planning)"
          :week="nextWeek"
          @click="router.push({ path: 'planning/week', query: { dt: dateToISO(nextWeek.startDate) } })"
        />
      </v-col>
    </v-row>
  </v-container>

  <h2>Recent Weeks</h2>
  <v-divider class="my-4"></v-divider>
  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6" v-for="week in previousWeeks" :key="week.startDate.getTime()">
        <WeeklySummaryCard
          :title="`Weeks Ago: ${differenceInWeeks(thisWeek?.startDate || new Date(), week.startDate)}`"
          :week="week"
          @click="router.push({ path: 'planning/week', query: { dt: dateToISO(week.startDate) } })"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { daysWithMeals, multiDayMealPlanNutrients } from '@/core/nutritional-calculations';
import { useMealPlansData } from '@/data/meal-plans';
import { useSettingsData } from '@/data/settings';
import type { WeeklyData } from '@/models/weekly-data';
import { addWeeks, differenceInWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const thisWeek = ref<WeeklyData>();
const nextWeek = ref<WeeklyData>();
const previousWeeks = ref<WeeklyData[]>([]);

const { settings } = useSettingsData();

const router = useRouter();
const { getMealPlansForPeriod } = useMealPlansData();

const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd');

const buildDataForWeek = async (startDate: Date): Promise<WeeklyData> => {
  const endDate = endOfWeek(startDate, { weekStartsOn: settings.value?.weekStartDay });
  const mealPlans = await getMealPlansForPeriod(dateToISO(startDate), dateToISO(endDate));
  const days = daysWithMeals(mealPlans);
  const nutrition = multiDayMealPlanNutrients(mealPlans);
  return {
    startDate,
    endDate,
    daysWithMeals: days,
    averageCalories: Math.round(nutrition.calories / (days || 1)),
    averageProtein: Math.round(nutrition.protein / (days || 1)),
    averageCarbs: Math.round(nutrition.carbs / (days || 1)),
  };
};

settings.promise.value
  .then(async () => {
    const start = startOfWeek(new Date(), { weekStartsOn: settings.value?.weekStartDay });
    thisWeek.value = await buildDataForWeek(start);
    nextWeek.value = await buildDataForWeek(addWeeks(start, 1));
    const indices = [1, 2, 3, 4];
    const previousWeekPromises = indices.map((i) => buildDataForWeek(addWeeks(start, -i)));
    const loadedPreviousWeeks = await Promise.all(previousWeekPromises);
    loadedPreviousWeeks.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    previousWeeks.value = loadedPreviousWeeks;
  })
  .catch((err) => {
    if (import.meta.env.DEV) {
      console.error('Failed to load settings for meal planning page', err);
    }
  });
</script>
