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
import { buildWeeklyData } from '@/core/build-weekly-data';
import { useMealPlansData } from '@/data/meal-plans';
import { useSettingsData } from '@/data/settings';
import type { WeeklyData } from '@/models/weekly-data';
import { addWeeks, differenceInWeeks, format, startOfWeek } from 'date-fns';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const thisWeek = ref<WeeklyData>();
const nextWeek = ref<WeeklyData>();
const previousWeeks = ref<WeeklyData[]>([]);

const { settings } = useSettingsData();

const router = useRouter();
const { getMealPlansForPeriod } = useMealPlansData();

const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd');

const loadData = async (currentSettings: typeof settings.value) => {
  if (!currentSettings) return;
  const start = startOfWeek(new Date(), { weekStartsOn: currentSettings.weekStartDay });
  thisWeek.value = await buildWeeklyData(start, currentSettings, getMealPlansForPeriod);
  nextWeek.value = await buildWeeklyData(addWeeks(start, 1), currentSettings, getMealPlansForPeriod);
  const indices = [1, 2, 3, 4];
  const previousWeekPromises = indices.map((i) =>
    buildWeeklyData(addWeeks(start, -i), currentSettings, getMealPlansForPeriod),
  );
  const loadedPreviousWeeks = await Promise.all(previousWeekPromises);
  loadedPreviousWeeks.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  previousWeeks.value = loadedPreviousWeeks;
};

onMounted(async () => {
  try {
    await settings.promise.value;
    await loadData(settings.value);
  } catch (err: unknown) {
    if (import.meta.env.DEV) {
      console.error('Failed to load data for meal planning page', err);
    }
  }
});
</script>
