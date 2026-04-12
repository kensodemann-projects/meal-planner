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
      :rules="[
        validationRules.required,
        validationRules.zeroOrGreater,
        (value) => value <= 100 || 'Tolerance must be 100 or less',
      ]"
      data-testid="tolerance-input"
    ></v-number-input>
    <v-autocomplete
      label="Week Start Day"
      v-model="weekStartDay"
      :items="daysOfTheWeek"
      :rules="[validationRules.required]"
      data-testid="week-start-day-input"
    ></v-autocomplete>

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
const dailyCalorieLimit = ref<number>(props.settings.maxDailyCalories);
const dailySugarLimit = ref<number>(props.settings.maxDailySugar);
const dailyProteinTarget = ref<number>(props.settings.maxDailyProtein);
const tolerance = ref<number>(props.settings.tolerance);
const weekStartDay = ref<number>(props.settings.weekStartDay);

const isModified = computed(() => {
  return (
    dailyCalorieLimit.value !== props.settings.maxDailyCalories ||
    dailySugarLimit.value !== props.settings.maxDailySugar ||
    dailyProteinTarget.value !== props.settings.maxDailyProtein ||
    tolerance.value !== props.settings.tolerance ||
    weekStartDay.value !== props.settings.weekStartDay
  );
});

const reset = () => {
  dailyCalorieLimit.value = props.settings.maxDailyCalories;
  dailySugarLimit.value = props.settings.maxDailySugar;
  dailyProteinTarget.value = props.settings.maxDailyProtein;
  tolerance.value = props.settings.tolerance;
  weekStartDay.value = props.settings.weekStartDay;
};

watchEffect(() => reset());

const save = () => {
  const updatedSettings: Settings = {
    minDailyCalories: dailyCalorieLimit.value,
    maxDailyCalories: dailyCalorieLimit.value,
    minDailyProtein: dailyProteinTarget.value,
    maxDailyProtein: dailyProteinTarget.value,
    minDailyCarbs: 0, // Carbs are not currently editable, so we set them to 0
    maxDailyCarbs: 0,
    minDailyFat: 0, // Fat is not currently editable, so we set it to 0
    maxDailyFat: 0,
    maxDailySugar: dailySugarLimit.value,
    tolerance: tolerance.value,
    weekStartDay: weekStartDay.value as WeekDay,
  };
  emit('save', updatedSettings);
};
</script>
