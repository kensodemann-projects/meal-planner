<template>
  <v-form v-model="valid">
    <v-number-input
      label="Calories per day"
      v-model="caloriesPerDay"
      :rules="[validationRules.required, validationRules.positive]"
      data-testid="calories-per-day-input"
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
const caloriesPerDay = ref<number | null>(props.settings.calories);
</script>
