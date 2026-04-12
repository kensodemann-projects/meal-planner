<template>
  <v-form v-model="valid">
    <v-container fluid>
      <v-row density="compact">
        <v-col cols="12">
          <v-number-input
            label="Maximum Daily Calories (kcal)"
            v-model="maxDailyCalories"
            :rules="[validationRules.required, validationRules.positive]"
            data-testid="max-daily-calorie-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12">
          <v-number-input
            label="Maximum Daily Protein (grams)"
            v-model="maxDailyProtein"
            :rules="[validationRules.required, validationRules.positive]"
            data-testid="max-daily-protein-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12">
          <v-number-input
            label="Maximum Daily Sugar (grams)"
            v-model="maxDailySugar"
            :rules="[validationRules.required, validationRules.positive]"
            data-testid="max-daily-sugar-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12">
          <v-number-input
            label="Tolerance (%)"
            v-model="tolerance"
            :rules="[
              validationRules.required,
              validationRules.zeroOrGreater,
              (value) => value <= 100 || 'Tolerance must be 100 or less',
            ]"
            data-testid="tolerance-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12">
          <v-autocomplete
            label="Week Start Day"
            v-model="weekStartDay"
            :items="daysOfTheWeek"
            :rules="[validationRules.required]"
            data-testid="week-start-day-input"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <ResetButton class="mr-4" @click="reset" />
        <SaveButton :disabled="!(valid && isModified)" @click="save" />
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import type { Settings, WeekDay } from '@/models/settings';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{ settings: Settings }>();
const emit = defineEmits<{ (event: 'save', payload: Settings): void }>();

const daysOfTheWeek = [
  { title: 'Sunday', value: 0 },
  { title: 'Monday', value: 1 },
  { title: 'Tuesday', value: 2 },
  { title: 'Wednesday', value: 3 },
  { title: 'Thursday', value: 4 },
  { title: 'Friday', value: 5 },
  { title: 'Saturday', value: 6 },
];

// Reactive properties to control the editor
const valid = ref(false);
const maxDailyCalories = ref<number>(props.settings.maxDailyCalories);
const maxDailyProtein = ref<number>(props.settings.maxDailyProtein);
const maxDailySugar = ref<number>(props.settings.maxDailySugar);
const tolerance = ref<number>(props.settings.tolerance);
const weekStartDay = ref<number>(props.settings.weekStartDay);

const isModified = computed(() => {
  return (
    maxDailyCalories.value !== props.settings.maxDailyCalories ||
    maxDailySugar.value !== props.settings.maxDailySugar ||
    maxDailyProtein.value !== props.settings.maxDailyProtein ||
    tolerance.value !== props.settings.tolerance ||
    weekStartDay.value !== props.settings.weekStartDay
  );
});

const reset = () => {
  maxDailyCalories.value = props.settings.maxDailyCalories;
  maxDailySugar.value = props.settings.maxDailySugar;
  maxDailyProtein.value = props.settings.maxDailyProtein;
  tolerance.value = props.settings.tolerance;
  weekStartDay.value = props.settings.weekStartDay;
};

watchEffect(() => reset());

const save = () => {
  const updatedSettings: Settings = {
    minDailyCalories: maxDailyCalories.value,
    maxDailyCalories: maxDailyCalories.value,
    minDailyProtein: maxDailyProtein.value,
    maxDailyProtein: maxDailyProtein.value,
    minDailyCarbs: 0, // Carbs are not currently editable, so we set them to 0
    maxDailyCarbs: 0,
    minDailyFat: 0, // Fat is not currently editable, so we set it to 0
    maxDailyFat: 0,
    maxDailySugar: maxDailySugar.value,
    tolerance: tolerance.value,
    weekStartDay: weekStartDay.value as WeekDay,
  };
  emit('save', updatedSettings);
};
</script>
