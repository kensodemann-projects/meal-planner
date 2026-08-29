<template>
  <div>
    <h1 class="text-center">Add Daily Meal Plan</h1>
    <meal-item-editor :week-start-date="weekStartDate" @save="onSave" @cancel="router.back()" />
  </div>
</template>

<script setup lang="ts">
import { useMealPlansData } from '@/data/meal-plans';
import type { PlannedMealItem } from '@/models/meal';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { addMealItemToMealPlan } = useMealPlansData();
const weekStartDate = computed(() => route.query.weekStartDate as string);

const onSave = async (mealItem: PlannedMealItem) => {
  await addMealItemToMealPlan(mealItem);
  router.back();
};
</script>

<style scoped></style>
