<template>
  <h1 class="text-center">Today's Outlook</h1>

  <v-container fluid>
    <v-row density="compact">
      <v-col v-for="detailStat in detailStats" :key="detailStat.label" cols="12" sm="6" md="4">
        <DetailStatCard :icon="detailStat.icon" :label="detailStat.label" :value="detailStat.value" />
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid>
    <v-row density="compact">
      <v-col v-for="meal in meals" :key="meal.label" cols="12" sm="6" md="3">
        <DetailStatCard :icon="meal.icon" :label="meal.label" :value="meal.value" />
      </v-col>
    </v-row>
  </v-container>

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
</template>

<script lang="ts" setup>
import { buildWeeklyData } from '@/core/build-weekly-data';
import { useMealPlansData } from '@/data/meal-plans';
import { useSettingsData } from '@/data/settings';
import type { MealPlan } from '@/models/meal-plan';
import type { WeeklyData } from '@/models/weekly-data';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { getMealPlanForDate, getMealPlansForPeriod } = useMealPlansData();
const { settings } = useSettingsData();

const thisWeek = ref<WeeklyData>();
const nextWeek = ref<WeeklyData>();
const mealPlanForToday = ref<MealPlan | null>();

const detailStats = [
  { icon: 'mdi-food-steak', label: 'Protein (g)', value: '400' },
  { icon: 'mdi-candy-outline', label: 'Sugar (g)', value: '250' },
  { icon: 'mdi-baguette', label: 'Total Carbs (g)', value: '335' },
  { icon: 'mdi-shaker-outline', label: 'Sodium (mg)', value: '1250' },
  { icon: 'mdi-french-fries', label: 'Fat (g)', value: '353' },
  { icon: 'mdi-fire', label: 'Calories', value: '2040' },
];

const meals = [
  { icon: 'mdi-coffee-outline', label: 'Breakfast', value: '400' },
  { icon: 'mdi-food-outline', label: 'Lunch', value: '400' },
  { icon: 'mdi-food-turkey', label: 'Dinner', value: '400' },
  { icon: 'mdi-peanut-outline', label: 'Snacks', value: '400' },
];

const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd');

const loadData = async (currentSettings: typeof settings.value) => {
  if (!currentSettings) return;
  const start = startOfWeek(new Date(), { weekStartsOn: currentSettings.weekStartDay });
  mealPlanForToday.value = await getMealPlanForDate(dateToISO(new Date()));
  thisWeek.value = await buildWeeklyData(start, currentSettings, getMealPlansForPeriod);
  nextWeek.value = await buildWeeklyData(addWeeks(start, 1), currentSettings, getMealPlansForPeriod);
};

onMounted(async () => {
  try {
    await loadData(await settings.promise.value);
  } catch (err: unknown) {
    if (import.meta.env.DEV) {
      console.error('Failed to load dashboard data', err);
    }
  }
});
</script>
