<template>
  <div>
    <h1 class="text-center">Update Meal Item</h1>
    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </div>
    <meal-item-editor
      v-else
      :week-start-date="weekStartDate"
      :meal-date="mealPlan?.date"
      :meal-type="meal?.type"
      :meal-item="mealItem"
      @save="onSave"
      @cancel="goToWeek()"
    />
  </div>
</template>

<script setup lang="ts">
import { useMealPlansData } from '@/data/meal-plans';
import type { MealType, PlannedMealItem } from '@/models/meal';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { updateMealItemInMealPlan, mealPlans, loading } = useMealPlansData();
const weekStartDate = computed(() => route.query.weekStartDate as string);
const mealPlan = computed(() => mealPlans.value.find((plan) => plan.id === (route.query.mealPlanId as string)));
const meal = computed(() => mealPlan.value?.meals.find((meal) => meal.type === (route.query.mealType as MealType)));
const mealItem = computed(() => meal.value?.items.find((item) => item.id === (route.query.mealItemId as string)));

const goToWeek = () => router.replace({ path: '/planning/week', query: { weekStartDate: weekStartDate.value } });

const onSave = async (mealItem: PlannedMealItem) => {
  await updateMealItemInMealPlan(mealItem, mealPlan.value!.date, meal.value!.type);
  goToWeek();
};
</script>

<style scoped></style>
