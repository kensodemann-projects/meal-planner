<template>
  <h1 class="mb-4">{{ intlFormat(currDate, { dateStyle: 'long' }) }}</h1>
  <div class="d-flex justify-space-between align-center">
    <h2>Breakfast</h2>
    <v-btn
      v-if="!breakfast.item"
      density="compact"
      variant="text"
      icon="mdi-plus"
      @click="addBreakfastButtonClicked"
      data-testid="add-breakfast-button"
    ></v-btn>
  </div>
  <v-divider class="mb-8"></v-divider>
  <div class="mb-8">
    <MealView
      v-if="breakfast.item && !breakfast.isEditing"
      :meal="breakfast.item"
      @modify="breakfast.isEditing = true"
      @delete="showConfirmDialog = true"
      data-testid="breakfast-view"
    />
    <MealEditor
      v-if="breakfast.isEditing"
      :meal="breakfast.item!"
      @save="(meal) => setMeal('Breakfast', meal)"
      @cancel="cancelMeal('Breakfast')"
    />
  </div>
  <div class="d-flex justify-space-between align-center">
    <h2>Lunch</h2>
    <v-btn
      v-if="!lunch.item"
      density="compact"
      variant="text"
      icon="mdi-plus"
      @click="addLunchButtonClicked"
      data-testid="add-lunch-button"
    ></v-btn>
  </div>
  <v-divider class="mb-8"></v-divider>
  <div class="mb-8">
    <MealView
      v-if="lunch.item && !lunch.isEditing"
      :meal="lunch.item"
      @modify="lunch.isEditing = true"
      @delete="showConfirmDialog = true"
      data-testid="lunch-view"
    />
    <MealEditor
      v-if="lunch.isEditing"
      :meal="lunch.item!"
      @save="(meal) => setMeal('Lunch', meal)"
      @cancel="cancelMeal('Lunch')"
    />
  </div>
  <div class="d-flex justify-space-between align-center">
    <h2>Dinner</h2>
    <v-btn
      v-if="!dinner.item"
      density="compact"
      variant="text"
      icon="mdi-plus"
      @click="addDinnerButtonClicked"
      data-testid="add-dinner-button"
    ></v-btn>
  </div>
  <v-divider class="mb-8"></v-divider>
  <div class="mb-8">
    <MealView
      v-if="dinner.item && !dinner.isEditing"
      :meal="dinner.item"
      @modify="dinner.isEditing = true"
      @delete="showConfirmDialog = true"
      data-testid="dinner-view"
    />
    <MealEditor
      v-if="dinner.isEditing"
      :meal="dinner.item!"
      @save="(meal) => setMeal('Dinner', meal)"
      @cancel="cancelMeal('Dinner')"
    />
  </div>
  <div class="d-flex justify-space-between align-center">
    <h2>Snacks</h2>
    <v-btn
      v-if="!snack.item"
      density="compact"
      variant="text"
      icon="mdi-plus"
      @click="addSnackButtonClicked"
      data-testid="add-snack-button"
    ></v-btn>
  </div>
  <v-divider class="mb-8"></v-divider>
  <div class="mb-8">
    <MealView
      v-if="snack.item && !snack.isEditing"
      :meal="snack.item"
      @modify="snack.isEditing = true"
      @delete="showConfirmDialog = true"
      data-testid="snack-view"
    />
    <MealEditor
      v-if="snack.isEditing"
      :meal="snack.item!"
      @save="(meal) => setMeal('Snack', meal)"
      @cancel="cancelMeal('Snack')"
    />
  </div>
  <div class="d-flex justify-end mt-4">
    <CancelButton @click="cancelDayPlan" />
    <SaveButton @click="saveDayPlan" :disabled="!isDirty" />
  </div>

  <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this meal?"
      icon-color="error"
      @confirm="doRemove"
      @cancel="showConfirmDialog = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import type { Meal, MealType } from '@/models/meal';
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { format, intlFormat, parseISO, startOfWeek } from 'date-fns';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { EditableItem } from '@/models/editable-item';
import { useSettingsData } from '@/data/settings';

const route = useRoute();
const dateParam = route.query.dt as string;
const currDate = parseISO(dateParam);

const { addMealPlan, getMealPlanForDate, updateMealPlan } = useMealPlansData();
const mealPlan = ref<MealPlan>({
  date: dateParam,
  meals: [],
});
const breakfast = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });
const lunch = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });
const dinner = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });
const snack = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });

const isDirty = ref(false);
const showConfirmDialog = ref(false);

const router = useRouter();
const { settings } = useSettingsData();

const addBreakfastButtonClicked = () => {
  breakfast.value = {
    isEditing: true,
    item: {
      id: crypto.randomUUID(),
      type: 'Breakfast',
      items: [],
    },
  };
};

const addLunchButtonClicked = () => {
  lunch.value = {
    isEditing: true,
    item: {
      id: crypto.randomUUID(),
      type: 'Lunch',
      items: [],
    },
  };
};

const addDinnerButtonClicked = () => {
  dinner.value = {
    isEditing: true,
    item: {
      id: crypto.randomUUID(),
      type: 'Dinner',
      items: [],
    },
  };
};

const addSnackButtonClicked = () => {
  snack.value = {
    isEditing: true,
    item: {
      id: crypto.randomUUID(),
      type: 'Snack',
      items: [],
    },
  };
};

const mealRefs: Record<string, typeof breakfast> = {
  Breakfast: breakfast,
  Lunch: lunch,
  Dinner: dinner,
  Snack: snack,
};

const setMeal = (mealType: MealType, meal: Meal | undefined) => {
  const mealRef = mealRefs[mealType];
  if (mealRef && mealRef.value) {
    if (meal) {
      mealRef.value.item = meal;
      isDirty.value = true;
    }
    mealRef.value.isEditing = false;
  }
};

const cancelMeal = (mealType: MealType) => {
  const mealRef = mealRefs[mealType];
  if (mealRef && mealRef.value) {
    mealRef.value.isEditing = false;
    mealRef.value.item = undefined;
  }
};

const doRemove = async () => {};

const navigateToWeek = () => {
  const start = startOfWeek(currDate, { weekStartsOn: settings.value?.weekStartDay });
  const iso = format(start, 'yyyy-MM-dd');
  router.replace({ path: '/planning/week', query: { dt: iso } });
};

const cancelDayPlan = () => navigateToWeek();

const saveDayPlan = async () => {
  const meals: Meal[] = [];
  if (breakfast.value.item) meals.push(breakfast.value.item);
  if (lunch.value.item) meals.push(lunch.value.item);
  if (dinner.value.item) meals.push(dinner.value.item);
  if (snack.value.item) meals.push(snack.value.item);
  if (mealPlan.value.id) {
    await updateMealPlan({ ...mealPlan.value, meals });
  } else {
    await addMealPlan({ ...mealPlan.value, meals });
  }
  navigateToWeek();
};

getMealPlanForDate(dateParam).then((plan) => {
  mealPlan.value = plan || {
    date: dateParam,
    meals: [],
  };
  breakfast.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Breakfast');
  lunch.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Lunch');
  dinner.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Dinner');
  snack.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Snack');
});
</script>
