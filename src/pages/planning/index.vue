<template>
  <h1 class="text-center">Meal Planning</h1>

  <h2>Current Weeks</h2>
  <v-divider class="my-4"></v-divider>

  <v-container fluid dense>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card
          outlined
          @click="router.push({ path: './week', query: { dt: format(nextWeek!.startDate, 'yyyy-MM-dd') } })"
        >
          <v-card-title>Next Week (Planning)</v-card-title>
          <v-card-subtitle>
            {{ nextWeek?.startDate.toLocaleDateString() }} - {{ nextWeek?.endDate.toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
            <div>Days with Meals: {{ nextWeek?.daysWithMeals }}</div>
            <div>Highest Calories: {{ nextWeek?.highestCalories }}</div>
            <div>Highest Protein: {{ nextWeek?.highestProtein }}g</div>
            <div>Highest Carbs: {{ nextWeek?.highestCarbs }}g</div>
            <div>Cheat Days: {{ nextWeek?.cheatDays }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title>This Week</v-card-title>
          <v-card-subtitle>
            {{ thisWeek?.startDate.toLocaleDateString() }} - {{ thisWeek?.endDate.toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
            <div>Days with Meals: {{ thisWeek?.daysWithMeals }}</div>
            <div>Highest Calories: {{ thisWeek?.highestCalories }}</div>
            <div>Highest Protein: {{ thisWeek?.highestProtein }}g</div>
            <div>Highest Carbs: {{ thisWeek?.highestCarbs }}g</div>
            <div>Cheat Days: {{ thisWeek?.cheatDays }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <h2>Recent Weeks</h2>
  <v-divider class="my-4"></v-divider>
  <v-container fluid dense>
    <v-row dense>
      <v-col cols="12" md="6" v-for="week in previousWeeks" :key="week.startDate.getDate()">
        <v-card outlined>
          <v-card-title
            >Weeks Ago: {{ differenceInWeeks(thisWeek?.startDate || new Date(), week.startDate) }}</v-card-title
          >
          <v-card-subtitle>
            {{ week.startDate.toLocaleDateString() }} - {{ week.endDate.toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
            <div>Days with Meals: {{ week.daysWithMeals }}</div>
            <div>Highest Calories: {{ week.highestCalories }}</div>
            <div>Highest Protein: {{ week.highestProtein }}g</div>
            <div>Highest Carbs: {{ week.highestCarbs }}g</div>
            <div>Cheat Days: {{ week.cheatDays }}</div>
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
  highestCalories: number;
  highestProtein: number;
  highestCarbs: number;
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

settings.promise.value.then(() => {
  const start = startOfWeek(new Date(), { weekStartsOn: settings.value?.weekStartDay });
  const end = endOfWeek(new Date(), { weekStartsOn: settings.value?.weekStartDay });
  thisWeek.value = {
    startDate: start,
    endDate: end,
    daysWithMeals: randomDays(),
    highestCalories: randomCalories(),
    highestProtein: randomProtein(),
    highestCarbs: randomCarbs(),
    cheatDays: randomCheatDays(),
  };
  nextWeek.value = {
    startDate: addWeeks(start, 1),
    endDate: addWeeks(end, 1),
    daysWithMeals: randomDays(),
    highestCalories: randomCalories(),
    highestProtein: randomProtein(),
    highestCarbs: randomCarbs(),
    cheatDays: randomCheatDays(),
  };
  [4, 3, 2, 1].forEach((i) => {
    const prevStart = addWeeks(start, -i);
    const prevEnd = addWeeks(end, -i);
    previousWeeks.value.push({
      startDate: prevStart,
      endDate: prevEnd,
      daysWithMeals: randomDays(),
      highestCalories: randomCalories(),
      highestProtein: randomProtein(),
      highestCarbs: randomCarbs(),
      cheatDays: randomCheatDays(),
    });
  });
  previousWeeks.value.reverse();
});
</script>
