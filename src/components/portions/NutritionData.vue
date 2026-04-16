<template>
  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <div data-testid="calories">
          <NutritionalStatusMarker v-if="settings" :status="caloriesStatus" />
          <span class="font-weight-black">Calories:</span> {{ value.calories }}
        </div>
        <div data-testid="protein">
          <NutritionalStatusMarker v-if="settings" :status="proteinStatus" />
          <span class="font-weight-black">Protein:</span> {{ value.protein }}g
        </div>
        <div data-testid="carbs"><span class="font-weight-black">Total Carbs:</span> {{ value.carbs }}g</div>
      </v-col>
      <v-col cols="12" md="6">
        <div data-testid="sodium"><span class="font-weight-black">Sodium:</span> {{ value.sodium }}mg</div>
        <div data-testid="fat"><span class="font-weight-black">Fat:</span> {{ value.fat }}g</div>
        <div data-testid="sugar">
          <NutritionalStatusMarker v-if="settings" :status="sugarStatus" />
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

const props = defineProps<{ value: Nutrition; settings?: Settings }>();

const caloriesStatus = computed(() =>
  rangeStatus(
    props.value.calories,
    props.settings?.minDailyCalories,
    props.settings?.maxDailyCalories,
    props.settings?.tolerance,
  ),
);

const proteinStatus = computed(() =>
  rangeStatus(
    props.value.protein,
    props.settings?.minDailyProtein,
    props.settings?.maxDailyProtein,
    props.settings?.tolerance,
  ),
);

const sugarStatus = computed(() =>
  maxOnlyStatus(props.value.sugar, props.settings?.maxDailySugar, props.settings?.tolerance),
);
</script>

<style scoped></style>
