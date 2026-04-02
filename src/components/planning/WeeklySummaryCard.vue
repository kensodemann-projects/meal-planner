<template>
  <v-card data-testid="weekly-summary-card" variant="outlined" @click="$emit('click')">
    <v-card-title>{{ title }}</v-card-title>
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { WeeklyData } from '@/models/weekly-data';

defineProps<{
  title: string;
  week: WeeklyData;
}>();

defineEmits<{
  (event: 'click'): void;
}>();
</script>
