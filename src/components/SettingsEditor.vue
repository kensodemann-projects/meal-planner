<template>
  <v-form v-model="valid">
    <v-number-input
      label="Daily Calorie Limit (kcal)"
      v-model="dailyCalorieLimit"
      :rules="[validationRules.required, validationRules.positive]"
      data-testid="daily-calorie-limit-input"
    ></v-number-input>
    <v-number-input
      label="Daily Sugar Limit (grams)"
      v-model="dailySugarLimit"
      :rules="[validationRules.required, validationRules.positive]"
      data-testid="daily-sugar-limit-input"
    ></v-number-input>
    <v-number-input
      label="Daily Protein Target (grams)"
      v-model="dailyProteinTarget"
      :rules="[validationRules.required, validationRules.positive]"
      data-testid="daily-protein-target-input"
    ></v-number-input>
    <v-number-input
      label="Tolerance (%)"
      v-model="tolerance"
      :rules="[validationRules.required, validationRules.positive]"
      data-testid="tolerance-input"
    ></v-number-input>
    <v-number-input
      label="Cheat Days per Week"
      v-model="cheatDays"
      :rules="[validationRules.required, validationRules.zeroOrGreater]"
      data-testid="cheat-days-input"
    ></v-number-input>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import type { Settings } from '@/models/settings';
import { ref } from 'vue';

const props = defineProps<{ settings: Settings }>();

// Reactive properties to control the editor
const valid = ref(false);
const dailyCalorieLimit = ref<number>(props.settings.dailyCalorieLimit);
const dailySugarLimit = ref<number>(props.settings.dailySugarLimit);
const dailyProteinTarget = ref<number>(props.settings.dailyProteinTarget);
const tolerance = ref<number>(props.settings.tolerance);
const cheatDays = ref<number>(props.settings.cheatDays);
</script>
