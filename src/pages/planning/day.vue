<template>
  <h1 class="mb-4">{{ intlFormat(today, { dateStyle: 'long' }) }}</h1>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Breakfast</div>
      <v-btn
        v-if="!breakfast.item"
        density="compact"
        variant="text"
        icon="mdi-plus"
        @click="addBreakfastButtonClicked"
        data-testid="add-breakfast-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <MealEditor
    v-if="breakfast.isEditing"
    :meal="breakfast.item!"
    @save="breakfast.isEditing = false"
    @cancel="
      breakfast.isEditing = false;
      breakfast.item = undefined;
    "
  />
  <h2>
    <div class="d-flex justify-space-between">
      <div>Lunch</div>
      <v-btn
        v-if="!lunch.item"
        density="compact"
        variant="text"
        icon="mdi-plus"
        @click="addLunchButtonClicked"
        data-testid="add-lunch-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Dinner</div>
      <v-btn
        v-if="!dinner.item"
        density="compact"
        variant="text"
        icon="mdi-plus"
        @click="addDinnerButtonClicked"
        data-testid="add-dinner-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <h2>
    <div class="d-flex justify-space-between">
      <div>Snacks</div>
      <v-btn density="compact" variant="text" icon="mdi-plus" data-testid="add-snack-button"></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
</template>

<script setup lang="ts">
import type { Meal } from '@/models/meal';
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { intlFormat } from 'date-fns';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type { EditableItem } from '@/models/editable-item';

const { getMealPlanForDate } = useMealPlansData();
const mealPlan = ref<MealPlan>();
const breakfast = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });
const lunch = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });
const dinner = ref<EditableItem<Meal | undefined>>({ isEditing: false, item: undefined });

const route = useRoute();
// TODO: Add error handling for invalid or missing date
const dt = route.query.dt as string;
const [year, month, day] = dt.split('-').map(Number);
const today = new Date(year!, month! - 1, day);

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

getMealPlanForDate(dt).then((plan) => {
  mealPlan.value = plan || {
    date: dt,
    meals: [],
  };
  breakfast.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Breakfast');
  lunch.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Lunch');
  dinner.value.item = mealPlan.value.meals.find((meal) => meal.type === 'Dinner');
});
</script>
