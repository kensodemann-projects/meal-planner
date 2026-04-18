<template>
  <v-row density="compact">
    <v-col cols="12">
      <v-number-input
        :label="`Maximum Daily ${nutrient} (${unit})`"
        v-model="max"
        :rules="[validationRules.required, validationRules.positive]"
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
  maxTestId: string;
}>();

const max = defineModel<number | null>('max');
</script>
