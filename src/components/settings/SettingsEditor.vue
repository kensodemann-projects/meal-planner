<template>
  <v-form v-model="valid">
    <v-container fluid>
      <NutrientRangeRow
        nutrient="Calories"
        unit="kcal"
        v-model:min="minDailyCalories"
        v-model:max="maxDailyCalories"
        min-test-id="min-daily-calorie-input"
        max-test-id="max-daily-calorie-input"
      />
      <NutrientRangeRow
        nutrient="Protein"
        unit="grams"
        v-model:min="minDailyProtein"
        v-model:max="maxDailyProtein"
        min-test-id="min-daily-protein-input"
        max-test-id="max-daily-protein-input"
      />
      <NutrientRangeRow
        nutrient="Fat"
        unit="grams"
        v-model:min="minDailyFat"
        v-model:max="maxDailyFat"
        min-test-id="min-daily-fat-input"
        max-test-id="max-daily-fat-input"
      />
      <NutrientRangeRow
        nutrient="Carbs"
        unit="grams"
        v-model:min="minDailyCarbs"
        v-model:max="maxDailyCarbs"
        min-test-id="min-daily-carbs-input"
        max-test-id="max-daily-carbs-input"
      />
      <NutrientRangeRow
        nutrient="Sodium"
        unit="mg"
        v-model:min="minDailySodium"
        v-model:max="maxDailySodium"
        min-test-id="min-daily-sodium-input"
        max-test-id="max-daily-sodium-input"
      />
      <NutrientMaxRow nutrient="Sugar" unit="grams" v-model:max="maxDailySugar" max-test-id="max-daily-sugar-input" />
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
            v-model:search="weekStartDaySearch"
            :items="daysOfTheWeek"
            :rules="[validationRules.required]"
            data-testid="week-start-day-input"
            @keydown.tab="selectFirstMatchingDay"
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
import { computed, shallowRef, watchEffect } from 'vue';

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
const valid = shallowRef(false);
const minDailyCalories = shallowRef<number>(props.settings.minDailyCalories);
const maxDailyCalories = shallowRef<number>(props.settings.maxDailyCalories);
const minDailyProtein = shallowRef<number>(props.settings.minDailyProtein);
const maxDailyProtein = shallowRef<number>(props.settings.maxDailyProtein);
const minDailyFat = shallowRef<number>(props.settings.minDailyFat);
const maxDailyFat = shallowRef<number>(props.settings.maxDailyFat);
const minDailyCarbs = shallowRef<number>(props.settings.minDailyCarbs);
const maxDailyCarbs = shallowRef<number>(props.settings.maxDailyCarbs);
const minDailySodium = shallowRef<number>(props.settings.minDailySodium);
const maxDailySodium = shallowRef<number>(props.settings.maxDailySodium);
const maxDailySugar = shallowRef<number>(props.settings.maxDailySugar);
const tolerance = shallowRef<number>(props.settings.tolerance);
const weekStartDay = shallowRef<number | null>(props.settings.weekStartDay);
const weekStartDaySearch = shallowRef<string>('');

const selectFirstMatchingDay = () => {
  if (!weekStartDaySearch.value) {
    weekStartDay.value = null;
    return;
  }
  const match = daysOfTheWeek.find((day) => day.title.toLowerCase().includes(weekStartDaySearch.value.toLowerCase()));
  weekStartDay.value = match?.value ?? null;
};

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
