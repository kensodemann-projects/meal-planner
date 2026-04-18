<template>
  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <div data-testid="calories">
          <NutritionalStatusMarker v-if="settings" class="status-marker" :status="caloriesStatus" />
          <span class="font-weight-black">Calories:</span> {{ value.calories }}
        </div>
        <div data-testid="protein">
          <NutritionalStatusMarker v-if="settings" class="status-marker" :status="proteinStatus" />
          <span class="font-weight-black">Protein:</span> {{ value.protein }}g
        </div>
        <div data-testid="carbs">
          <NutritionalStatusMarker v-if="settings" class="status-marker" :status="carbsStatus" />
          <span class="font-weight-black">Total Carbs:</span> {{ value.carbs }}g
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div data-testid="sodium">
          <NutritionalStatusMarker v-if="settings" class="status-marker" :status="sodiumStatus" />
          <span class="font-weight-black">Sodium:</span> {{ value.sodium }}mg
        </div>
        <div data-testid="fat">
          <NutritionalStatusMarker v-if="settings" class="status-marker" :status="fatStatus" />
          <span class="font-weight-black">Fat:</span> {{ value.fat }}g
        </div>
        <div data-testid="sugar">
          <NutritionalStatusMarker v-if="settings" class="status-marker" :status="sugarStatus" />
          <span class="font-weight-black">Sugar:</span> {{ value.sugar }}g
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Nutrition } from '@/models/nutrition';
import { computed } from 'vue';
import { maxOnlyStatus, rangeStatus } from '@/core/nutritional-status';
import type { Settings } from '@/models/settings';

const { value, settings } = defineProps<{ value: Nutrition; settings?: Settings | null }>();

const caloriesStatus = computed(() =>
  rangeStatus(value.calories, settings?.minDailyCalories, settings?.maxDailyCalories, settings?.tolerance),
);

const proteinStatus = computed(() =>
  rangeStatus(value.protein, settings?.minDailyProtein, settings?.maxDailyProtein, settings?.tolerance),
);

const carbsStatus = computed(() =>
  rangeStatus(value.carbs, settings?.minDailyCarbs, settings?.maxDailyCarbs, settings?.tolerance),
);

const fatStatus = computed(() =>
  rangeStatus(value.fat, settings?.minDailyFat, settings?.maxDailyFat, settings?.tolerance),
);

const sodiumStatus = computed(() =>
  rangeStatus(value.sodium, settings?.minDailySodium, settings?.maxDailySodium, settings?.tolerance),
);

const sugarStatus = computed(() => maxOnlyStatus(value.sugar, settings?.maxDailySugar, settings?.tolerance));
</script>

<style scoped>
.status-marker {
  margin-right: 0.25rem;
}
</style>
