<template>
  <v-card data-testid="daily-summary-card" variant="outlined" role="button" tabindex="0">
    <v-card-title
      >{{ intlFormat(date, { dateStyle: 'full' }) }}
      <v-tooltip v-if="nutrition" activator="parent" location="bottom" width="350">
        <NutritionData :value="nutrition" :settings="settings" />
      </v-tooltip>
    </v-card-title>
    <v-card-subtitle v-if="!mealPlan || mealPlan.meals.length === 0">No meals have been entered</v-card-subtitle>
    <v-card-text>
      <template v-for="meal in mealPlan?.meals" :key="meal.id">
        <div class="text-title-medium">{{ meal.type }}</div>
        <MealItemListItem
          class="ml-4"
          v-for="mealItem in meal.items"
          :key="mealItem.id"
          :mealItem="mealItem"
          :settings="settings"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { dailyMealPlanNutrients } from '@/core/nutritional-calculations';
import type { MealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Nutrition } from '@/models/nutrition';
import type { Settings } from '@/models/settings';
import { intlFormat } from 'date-fns';
import { computed } from 'vue';

const props = defineProps<{
  date: Date;
  mealPlan?: MealPlan;
  settings?: Settings | null;
}>();

const nutrition = computed<Nutrition | undefined>(() =>
  props.mealPlan && props.mealPlan.meals.length > 0 ? dailyMealPlanNutrients(props.mealPlan) : undefined,
);

defineEmits<{
  (event: 'modify', value: MealItem): void;
  (event: 'delete', value: MealItem): void;
}>();
</script>
