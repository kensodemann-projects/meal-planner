<template>
  <h1 class="text-center">Meal Planning</h1>

  <h2>Current Weeks</h2>
  <v-divider class="my-4"></v-divider>

  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <v-card
          variant="outlined"
          @click="router.push({ path: 'planning/week', query: { dt: toISODate(thisWeek!.startDate) } })"
        >
          <v-card-title>This Week</v-card-title>
          <v-card-subtitle>
            {{ thisWeek?.startDate.toLocaleDateString() }} - {{ thisWeek?.endDate.toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
            <div>
              Days with Meals: <strong>{{ thisWeek?.daysWithMeals }}</strong>
            </div>
            <div>
              Average Calories: <strong>{{ thisWeek?.averageCalories }}</strong>
            </div>
            <div>
              Average Protein: <strong>{{ thisWeek?.averageProtein }}g</strong>
            </div>
            <div>
              Average Carbs: <strong>{{ thisWeek?.averageCarbs }}g</strong>
            </div>
            <div>
              Cheat Days: <strong>{{ thisWeek?.cheatDays }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card
          variant="outlined"
          @click="router.push({ path: 'planning/week', query: { dt: toISODate(nextWeek!.startDate) } })"
        >
          <v-card-title>Next Week (Planning)</v-card-title>
          <v-card-subtitle>
            {{ nextWeek?.startDate.toLocaleDateString() }} - {{ nextWeek?.endDate.toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
            <div>
              Days with Meals: <strong>{{ nextWeek?.daysWithMeals }}</strong>
            </div>
            <div>
              Average Calories: <strong>{{ nextWeek?.averageCalories }}</strong>
            </div>
            <div>
              Average Protein: <strong>{{ nextWeek?.averageProtein }}g</strong>
            </div>
            <div>
              Average Carbs: <strong>{{ nextWeek?.averageCarbs }}g</strong>
            </div>
            <div>
              Cheat Days: <strong>{{ nextWeek?.cheatDays }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <h2>Recent Weeks</h2>
  <v-divider class="my-4"></v-divider>
  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6" v-for="week in previousWeeks" :key="week.startDate.getTime()">
        <v-card
          variant="outlined"
          @click="router.push({ path: 'planning/week', query: { dt: toISODate(week.startDate) } })"
        >
          <v-card-title
            >Weeks Ago: {{ differenceInWeeks(thisWeek?.startDate || new Date(), week.startDate) }}</v-card-title
          >
          <v-card-subtitle>
            {{ week.startDate.toLocaleDateString() }} - {{ week.endDate.toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
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
            <div>
              Cheat Days: <strong>{{ week.cheatDays }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { daysWithMeals, multiDayMealPlanNutrients } from '@/core/nutritional-calculations';
import { useMealPlansData } from '@/data/meal-plans';
import { useSettingsData } from '@/data/settings';
import { addWeeks, differenceInWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface WeeklyData {
  startDate: Date;
  endDate: Date;
  daysWithMeals: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  cheatDays: number;
}
const thisWeek = ref<WeeklyData>();
const nextWeek = ref<WeeklyData>();
const previousWeeks = ref<WeeklyData[]>([]);

const { settings } = useSettingsData();

const router = useRouter();
const { getMealPlansForPeriod } = useMealPlansData();

const toISODate = (date: Date): string => format(date, 'yyyy-MM-dd');

const buildDataForWeek = async (startDate: Date): Promise<WeeklyData> => {
  const endDate = endOfWeek(startDate, { weekStartsOn: settings.value?.weekStartDay });
  const mealPlans = await getMealPlansForPeriod(toISODate(startDate), toISODate(endDate));
  const days = daysWithMeals(mealPlans);
  const nutrition = multiDayMealPlanNutrients(mealPlans);
  return {
    startDate,
    endDate,
    daysWithMeals: days,
    averageCalories: Math.round(nutrition.calories / days),
    averageProtein: Math.round(nutrition.protein / days),
    averageCarbs: Math.round(nutrition.carbs / days),
    cheatDays: 0,
  };
};

settings.promise.value
  .then(async () => {
    const start = startOfWeek(new Date(), { weekStartsOn: settings.value?.weekStartDay });
    thisWeek.value = await buildDataForWeek(start);
    nextWeek.value = await buildDataForWeek(addWeeks(start, 1));
    [1, 2, 3, 4].forEach(async (i) => {
      previousWeeks.value.push(await buildDataForWeek(addWeeks(start, -i)));
    });
  })
  .catch((err) => {
    if (import.meta.env.DEV) {
      console.error('Failed to load settings for meal planning page', err);
    }
  });
</script>
