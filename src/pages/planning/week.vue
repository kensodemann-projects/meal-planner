<template>
  <div class="week-planner">
    <h1 class="text-center">Weekly Plan</h1>
    <div v-if="isLoading" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </div>
    <template v-else>
      <div v-for="row in weekRows" :key="row.iso" class="day-plan mb-4">
        <DailySummaryCard
          :date="row.day"
          :mealPlan="row.plan"
          :settings="settings"
          @modify="(plannedMealItem) => navigateToUpdate(row.plan!, plannedMealItem)"
          @delete="confirmDelete"
        />
      </div>
    </template>
    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CloseButton @click="router.back()" />
      </v-row>
    </v-container>
  </div>

  <v-fab
    color="primary"
    icon="mdi-plus"
    variant="tonal"
    location="bottom end"
    absolute
    @click="navigateToAdd"
    data-testid="add-button"
  ></v-fab>

  <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this item from the meal?"
      icon-color="error"
      @confirm="doDelete"
      @cancel="showConfirmDialog = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import DailySummaryCard from '@/components/planning/DailySummaryCard.vue';
import { dateToISO } from '@/core/dates';
import { useMealPlansData } from '@/data/meal-plans';
import { useSettingsData } from '@/data/settings';
import type { PlannedMealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import { addDays, parseISO } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type DayRow = { day: Date; iso: string; plan?: MealPlan };

const { settings } = useSettingsData();
const { getMealPlansForPeriod, removeMealItemFromMealPlan } = useMealPlansData();
const route = useRoute();
const router = useRouter();
const weekStartDate = computed(() => route.query.weekStartDate as string);
const weekDays = computed(() => [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(parseISO(weekStartDate.value), offset)));
const mealPlans = ref<MealPlan[]>([]);
const isLoading = ref(true);
const showConfirmDialog = ref(false);
const mealItemToDelete = ref<PlannedMealItem | null>(null);

const weekRows = computed<DayRow[]>(() =>
  weekDays.value.map((d) => {
    const iso = dateToISO(d);
    const plan = mealPlans.value.find((p) => p.date === iso);
    return { day: d, iso, plan };
  }),
);

const refreshMealPlans = async () => {
  mealPlans.value = await getMealPlansForPeriod(dateToISO(weekDays.value[0]!), dateToISO(weekDays.value[6]!));
};

const loadMealPlans = async () => {
  isLoading.value = true;
  await refreshMealPlans();
  try {
  } finally {
    isLoading.value = false;
  }
};

const navigateToAdd = () => {
  router.push({ path: 'add', query: { weekStartDate: weekStartDate.value } });
};

const navigateToUpdate = (mealPlan: MealPlan, plannedMealItem: PlannedMealItem) => {
  router.push({
    path: 'update',
    query: {
      weekStartDate: weekStartDate.value,
      mealPlanId: mealPlan.id,
      mealType: plannedMealItem.mealType,
      mealItemId: plannedMealItem.mealItem.id,
    },
  });
};

const confirmDelete = (plannedMealItem: PlannedMealItem) => {
  showConfirmDialog.value = true;
  mealItemToDelete.value = plannedMealItem;
};

const doDelete = async () => {
  const item = mealItemToDelete.value;
  mealItemToDelete.value = null;
  showConfirmDialog.value = false;
  if (item) {
    await removeMealItemFromMealPlan(item);
    await refreshMealPlans();
  }
};

watch(weekStartDate, loadMealPlans, { immediate: true });
</script>
