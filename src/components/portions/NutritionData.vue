<template>
  <v-container fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <div><span class="font-weight-black">Calories:</span> {{ value.calories }}</div>
        <div><span class="font-weight-black">Protein:</span> {{ value.protein }}g</div>
        <div><span class="font-weight-black">Total Carbs:</span> {{ value.carbs }}g</div>
      </v-col>
      <v-col cols="12" md="6">
        <div><span class="font-weight-black">Sodium:</span> {{ value.sodium }}mg</div>
        <div><span class="font-weight-black">Fat:</span> {{ value.fat }}g</div>
        <div>
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
import { maxOnlyStatus } from '@/core/nutritional-status';
import type { Settings } from '@/models/settings';

const props = defineProps<{ value: Nutrition; settings?: Settings }>();

const sugarStatus = computed(() =>
  maxOnlyStatus(props.value.sugar, props.settings?.maxDailySugar, props.settings?.tolerance),
);
</script>

<style scoped></style>
