<template>
  <v-card
    data-testid="weekly-summary-card"
    variant="outlined"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ dateRange }}</v-card-subtitle>
    <v-card-text>
      <div>
        Days with Meals: <strong>{{ week.daysWithMeals }}</strong>
      </div>
      <NutritionData :value="nutrition" prefix="Average" :settings="settings" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { WeeklyData } from '@/models/weekly-data';
import { computed } from 'vue';
import { format } from 'date-fns';
import type { Settings } from '@/models/settings';

const props = defineProps<{
  title: string;
  week: WeeklyData;
  settings?: Settings | null;
}>();

defineEmits<{
  (event: 'click'): void;
}>();

const dateRange = computed(
  () => `${format(props.week.startDate, 'M/d/yyyy')} - ${format(props.week.endDate, 'M/d/yyyy')}`,
);
const nutrition = computed(() => ({
  calories: props.week.averageCalories,
  protein: props.week.averageProtein,
  carbs: props.week.averageCarbs,
  fat: props.week.averageFat,
  sodium: props.week.averageSodium,
  sugar: props.week.averageSugar,
}));
</script>
