<template>
  <v-form v-model="valid">
    <v-container fluid>
      <v-row density="compact">
        <v-col cols="12" md="6">
          <v-number-input
            label="Minimum Daily Calories (kcal)"
            v-model="minDailyCalories"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeLessThan(maxDailyCalories, 'Minimum calories must be less than maximum calories'),
            ]"
            data-testid="min-daily-calorie-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-number-input
            label="Maximum Daily Calories (kcal)"
            v-model="maxDailyCalories"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeGreaterThan(
                minDailyCalories,
                'Maximum calories must be greater than minimum calories',
              ),
            ]"
            data-testid="max-daily-calorie-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12" md="6">
          <v-number-input
            label="Minimum Daily Protein (grams)"
            v-model="minDailyProtein"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeLessThan(maxDailyProtein, 'Minimum protein must be less than maximum protein'),
            ]"
            data-testid="min-daily-protein-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-number-input
            label="Maximum Daily Protein (grams)"
            v-model="maxDailyProtein"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeGreaterThan(
                minDailyProtein,
                'Maximum protein must be greater than minimum protein',
              ),
            ]"
            data-testid="max-daily-protein-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12" md="6">
          <v-number-input
            label="Minimum Daily Fat (grams)"
            v-model="minDailyFat"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeLessThan(maxDailyFat, 'Minimum fat must be less than maximum fat'),
            ]"
            data-testid="min-daily-fat-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-number-input
            label="Maximum Daily Fat (grams)"
            v-model="maxDailyFat"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeGreaterThan(minDailyFat, 'Maximum fat must be greater than minimum fat'),
            ]"
            data-testid="max-daily-fat-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12" md="6">
          <v-number-input
            label="Minimum Daily Carbs (grams)"
            v-model="minDailyCarbs"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeLessThan(maxDailyCarbs, 'Minimum carbs must be less than maximum carbs'),
            ]"
            data-testid="min-daily-carbs-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-number-input
            label="Maximum Daily Carbs (grams)"
            v-model="maxDailyCarbs"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeGreaterThan(minDailyCarbs, 'Maximum carbs must be greater than minimum carbs'),
            ]"
            data-testid="max-daily-carbs-input"
          ></v-number-input>
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="12" md="6">
          <v-number-input
            label="Minimum Daily Sodium (mg)"
            v-model="minDailySodium"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeLessThan(maxDailySodium, 'Minimum sodium must be less than maximum sodium'),
            ]"
            data-testid="min-daily-sodium-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-number-input
            label="Maximum Daily Sodium (mg)"
            v-model="maxDailySodium"
            :rules="[
              validationRules.required,
              validationRules.positive,
              validationRules.mustBeGreaterThan(minDailySodium, 'Maximum sodium must be greater than minimum sodium'),
            ]"
            data-testid="max-daily-sodium-input"
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
const minDailyCalories = ref<number>(props.settings.minDailyCalories);
const maxDailyCalories = ref<number>(props.settings.maxDailyCalories);
const minDailyProtein = ref<number>(props.settings.minDailyProtein);
const maxDailyProtein = ref<number>(props.settings.maxDailyProtein);
const minDailyFat = ref<number>(props.settings.minDailyFat);
const maxDailyFat = ref<number>(props.settings.maxDailyFat);
const minDailyCarbs = ref<number>(props.settings.minDailyCarbs);
const maxDailyCarbs = ref<number>(props.settings.maxDailyCarbs);
const minDailySodium = ref<number>(props.settings.minDailySodium);
const maxDailySodium = ref<number>(props.settings.maxDailySodium);
const maxDailySugar = ref<number>(props.settings.maxDailySugar);
const tolerance = ref<number>(props.settings.tolerance);
const weekStartDay = ref<number>(props.settings.weekStartDay);

const isModified = computed(() => {
  return (
    minDailyCalories.value !== props.settings.minDailyCalories ||
    maxDailyCalories.value !== props.settings.maxDailyCalories ||
    minDailyProtein.value !== props.settings.minDailyProtein ||
    maxDailyProtein.value !== props.settings.maxDailyProtein ||
    minDailyFat.value !== props.settings.minDailyFat ||
    maxDailyFat.value !== props.settings.maxDailyFat ||
    minDailyCarbs.value !== props.settings.minDailyCarbs ||
    maxDailyCarbs.value !== props.settings.maxDailyCarbs ||
    minDailySodium.value !== props.settings.minDailySodium ||
    maxDailySodium.value !== props.settings.maxDailySodium ||
    maxDailySugar.value !== props.settings.maxDailySugar ||
    tolerance.value !== props.settings.tolerance ||
    weekStartDay.value !== props.settings.weekStartDay
  );
});

const reset = () => {
  minDailyCalories.value = props.settings.minDailyCalories;
  maxDailyCalories.value = props.settings.maxDailyCalories;
  minDailyProtein.value = props.settings.minDailyProtein;
  maxDailyProtein.value = props.settings.maxDailyProtein;
  minDailyFat.value = props.settings.minDailyFat;
  maxDailyFat.value = props.settings.maxDailyFat;
  minDailyCarbs.value = props.settings.minDailyCarbs;
  maxDailyCarbs.value = props.settings.maxDailyCarbs;
  minDailySodium.value = props.settings.minDailySodium;
  maxDailySodium.value = props.settings.maxDailySodium;
  maxDailySugar.value = props.settings.maxDailySugar;
  tolerance.value = props.settings.tolerance;
  weekStartDay.value = props.settings.weekStartDay;
};

watchEffect(() => reset());

const save = () => {
  const updatedSettings: Settings = {
    minDailyCalories: minDailyCalories.value,
    maxDailyCalories: maxDailyCalories.value,
    minDailyProtein: minDailyProtein.value,
    maxDailyProtein: maxDailyProtein.value,
    minDailyCarbs: minDailyCarbs.value,
    maxDailyCarbs: maxDailyCarbs.value,
    minDailyFat: minDailyFat.value,
    maxDailyFat: maxDailyFat.value,
    minDailySodium: minDailySodium.value,
    maxDailySodium: maxDailySodium.value,
    maxDailySugar: maxDailySugar.value,
    tolerance: tolerance.value,
    weekStartDay: weekStartDay.value as WeekDay,
  };
  emit('save', updatedSettings);
};
</script>
