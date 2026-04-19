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
        <DetailStatCard
          :icon="meal.icon"
          :label="meal.label"
          :value="meal.value"
          @click="router.push({ path: 'dashboard/recipes', query: { mealType: meal.type.toLowerCase() } })"
        />
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
import { dateToISO } from '@/core/dates';
import { dailyMealPlanNutrients, mealNutrients, zeroNutrition } from '@/core/nutritional-calculations';
import { useMealPlansData } from '@/data/meal-plans';
import { useSettingsData } from '@/data/settings';
import type { MealType } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { WeeklyData } from '@/models/weekly-data';
import { addWeeks, startOfWeek } from 'date-fns';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { getMealPlanForDate, getMealPlansForPeriod } = useMealPlansData();
const { settings } = useSettingsData();

const thisWeek = ref<WeeklyData>();
const nextWeek = ref<WeeklyData>();
const mealPlanForToday = ref<MealPlan | null>();

const detailStats = computed(() => {
  const nutrition = mealPlanForToday.value ? dailyMealPlanNutrients(mealPlanForToday.value) : zeroNutrition;
  return [
    { icon: 'mdi-food-steak', label: 'Protein (g)', value: nutrition.protein },
    { icon: 'mdi-candy-outline', label: 'Sugar (g)', value: nutrition.sugar },
    { icon: 'mdi-baguette', label: 'Carbs (g)', value: nutrition.carbs },
    { icon: 'mdi-shaker-outline', label: 'Sodium (mg)', value: nutrition.sodium },
    { icon: 'mdi-french-fries', label: 'Fat (g)', value: nutrition.fat },
    { icon: 'mdi-fire', label: 'Calories', value: nutrition.calories },
  ];
});

const getMealCalories = (mealType: MealType): number | string => {
  const meal = mealPlanForToday.value?.meals.find((m) => m.type === mealType);
  if (!meal) return 'N/A';
  const nutrition = mealNutrients(meal);
  return nutrition.calories;
};

const meals = computed(() => [
  {
    icon: 'mdi-coffee-outline',
    label: 'Breakfast',
    type: 'Breakfast' as MealType,
    value: getMealCalories('Breakfast'),
  },
  { icon: 'mdi-food-outline', label: 'Lunch', type: 'Lunch' as MealType, value: getMealCalories('Lunch') },
  { icon: 'mdi-food-turkey', label: 'Dinner', type: 'Dinner' as MealType, value: getMealCalories('Dinner') },
  { icon: 'mdi-peanut-outline', label: 'Snacks', type: 'Snack' as MealType, value: getMealCalories('Snack') },
]);

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
