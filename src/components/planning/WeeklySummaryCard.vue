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
      <div>
        Average Calories: <strong>{{ week.averageCalories }}</strong>
      </div>
      <div>
        Average Protein: <strong>{{ week.averageProtein }}g</strong>
      </div>
      <div>
        Average Carbs: <strong>{{ week.averageCarbs }}g</strong>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { WeeklyData } from '@/models/weekly-data';
import { computed } from 'vue';
import { format } from 'date-fns';

const props = defineProps<{
  title: string;
  week: WeeklyData;
}>();

defineEmits<{
  (event: 'click'): void;
}>();

const dateRange = computed(() => `${format(props.week.startDate, 'P')} - ${format(props.week.endDate, 'P')}`);
</script>
