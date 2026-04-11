<template>
  <h1 class="text-center">Today's Outlook</h1>

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
import type { WeeklyData } from '@/models/weekly-data';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { getMealPlansForPeriod } = useMealPlansData();
const { settings } = useSettingsData();

const thisWeek = ref<WeeklyData>();
const nextWeek = ref<WeeklyData>();

const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd');

const loadData = async (currentSettings: typeof settings.value) => {
  if (!currentSettings) return;
  const start = startOfWeek(new Date(), { weekStartsOn: currentSettings.weekStartDay });
  thisWeek.value = await buildWeeklyData(start, currentSettings, getMealPlansForPeriod);
  nextWeek.value = await buildWeeklyData(addWeeks(start, 1), currentSettings, getMealPlansForPeriod);
};

onMounted(async () => {
  try {
    await loadData(await settings.promise.value);
  } catch (err: unknown) {
    if (import.meta.env.DEV) {
      console.error('Failed to load settings for meal planning page', err);
    }
  }
});
</script>
