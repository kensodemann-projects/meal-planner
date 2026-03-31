<template>
  <h1 class="text-center">Meal Planning</h1>

  <h2>Current Weeks</h2>
  <v-divider class="my-4"></v-divider>

  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <v-card
          variant="outlined"
          @click="router.push({ path: 'planning/week', query: { dt: format(thisWeek!.startDate, 'yyyy-MM-dd') } })"
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
          @click="router.push({ path: 'planning/week', query: { dt: format(nextWeek!.startDate, 'yyyy-MM-dd') } })"
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
          @click="router.push({ path: 'planning/week', query: { dt: format(week.startDate, 'yyyy-MM-dd') } })"
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

const randomDays = (): number => Math.floor(Math.random() * 7) + 1;
const router = useRouter();

const randomCalories = (): number => Math.floor(Math.random() * 2000) + 1000;
const randomProtein = (): number => Math.floor(Math.random() * 150) + 50;
const randomCarbs = (): number => Math.floor(Math.random() * 300) + 100;
const randomCheatDays = (): number => Math.floor(Math.random() * 3);

settings.promise.value
  .then(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: settings.value?.weekStartDay });
    const end = endOfWeek(new Date(), { weekStartsOn: settings.value?.weekStartDay });
    // TODO: Copilot this needs to be replaced with real data fetching logic for the current, next and previous weeks
    //       Furthermore, the @src/core/nutrition-calculator.ts should be used to calculate the average calories, protein and carbs for the week.
    thisWeek.value = {
      startDate: start,
      endDate: end,
      daysWithMeals: randomDays(),
      averageCalories: randomCalories(),
      averageProtein: randomProtein(),
      averageCarbs: randomCarbs(),
      cheatDays: randomCheatDays(),
    };
    nextWeek.value = {
      startDate: addWeeks(start, 1),
      endDate: addWeeks(end, 1),
      daysWithMeals: randomDays(),
      averageCalories: randomCalories(),
      averageProtein: randomProtein(),
      averageCarbs: randomCarbs(),
      cheatDays: randomCheatDays(),
    };
    [4, 3, 2, 1].forEach((i) => {
      const prevStart = addWeeks(start, -i);
      const prevEnd = addWeeks(end, -i);
      previousWeeks.value.push({
        startDate: prevStart,
        endDate: prevEnd,
        daysWithMeals: randomDays(),
        averageCalories: randomCalories(),
        averageProtein: randomProtein(),
        averageCarbs: randomCarbs(),
        cheatDays: randomCheatDays(),
      });
    });
    previousWeeks.value.reverse();
  })
  .catch((err) => {
    if (import.meta.env.DEV) {
      console.error('Failed to load settings for meal planning page', err);
    }
  });
</script>
