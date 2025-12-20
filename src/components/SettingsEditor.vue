<template>
  <v-form v-model="valid">
    <v-number-input
      label="Daily Calorie Limit (kcal)"
      v-model="dailyCalorieLimit"
      :rules="[validationRules.required, validationRules.positive]"
      data-testid="daily-calorie-limit-input"
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
const dailyCalorieLimit = ref<number | null>(props.settings.dailyCalorieLimit);
</script>
