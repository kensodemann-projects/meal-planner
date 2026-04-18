<template>
  <v-row density="compact">
    <v-col cols="12" md="6">
      <v-number-input
        :label="`Minimum Daily ${nutrient} (${unit})`"
        v-model="min"
        :rules="[
          validationRules.required,
          validationRules.positive,
          validationRules.mustBeLessThan(
            max,
            `Minimum ${nutrient.toLowerCase()} must be less than maximum ${nutrient.toLowerCase()}`,
          ),
        ]"
        :data-testid="minTestId"
      ></v-number-input>
    </v-col>
    <v-col cols="12" md="6">
      <v-number-input
        :label="`Maximum Daily ${nutrient} (${unit})`"
        v-model="max"
        :rules="[
          validationRules.required,
          validationRules.positive,
          validationRules.mustBeGreaterThan(
            min,
            `Maximum ${nutrient.toLowerCase()} must be greater than minimum ${nutrient.toLowerCase()}`,
          ),
        ]"
        :data-testid="maxTestId"
      ></v-number-input>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';

defineProps<{
  nutrient: string;
  unit: string;
  minTestId: string;
  maxTestId: string;
}>();

const min = defineModel<number>('min', { required: true });
const max = defineModel<number>('max', { required: true });
</script>
