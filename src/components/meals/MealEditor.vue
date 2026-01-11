<template>
  <!-- Currently a placeholder layout, this is being used as a testing harness for now -->
  <h2>
    <div class="d-flex justify-space-between">
      <div>Recipes</div>
      <v-btn
        density="compact"
        variant="text"
        icon="mdi-plus"
        :disabled="recipeMealItem !== null"
        @click="() => (recipeMealItem = {})"
        data-testid="add-recipe-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <MealItemEditorCard
    v-if="recipeMealItem !== null"
    :meal-item="recipeMealItem"
    :items="recipes"
    type="recipe"
    @save="saveMealItem"
    @cancel="() => (recipeMealItem = null)"
  />
  <v-expansion-panels data-testid="recipe-panels">
    <v-expansion-panel v-for="item in recipeMealItems" :key="item.id">
      <v-expansion-panel-title>
        {{ item.name }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <NutritionData :value="item.nutrition" />
        <ModifyButton />
        <DeleteButton />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <h2 class="mt-8">
    <div class="d-flex justify-space-between">
      <div>Additional Foods</div>
      <v-btn
        density="compact"
        variant="text"
        icon="mdi-plus"
        :disabled="foodMealItem !== null"
        @click="() => (foodMealItem = {})"
        data-testid="add-food-item-button"
      ></v-btn>
    </div>
  </h2>
  <v-divider class="mb-4"></v-divider>
  <MealItemEditorCard
    v-if="foodMealItem !== null"
    :meal-item="foodMealItem"
    :items="foods"
    type="food"
    @save="saveMealItem"
    @cancel="() => (foodMealItem = null)"
  />
  <v-expansion-panels data-testid="food-item-panels">
    <v-expansion-panel v-for="item in foodMealItems" :key="item.id">
      <v-expansion-panel-title>
        {{ item.name }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <NutritionData :value="item.nutrition" />
        <ModifyButton />
        <DeleteButton />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <h2 class="mt-8">Total Nutrition</h2>
  <v-divider class="mb-4"></v-divider>

  <v-container fluid>
    <v-row class="pa-4" justify="end">
      <CancelButton class="mr-4" @click="$emit('cancel')" />
      <SaveButton :disabled="!(valid && isModified)" @click="save" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';
import type { Meal, MealItem } from '@/models/meal';
import { computed, ref } from 'vue';

const emit = defineEmits<{ (event: 'save', payload: Meal): void; (event: 'cancel'): void }>();
const props = defineProps<{ meal?: Meal }>();

const { foods } = useFoodsData();
const { recipes } = useRecipesData();

const foodMealItem = ref<Partial<MealItem> | null>(null);
const recipeMealItem = ref<Partial<MealItem> | null>(null);
const mealItems = ref<MealItem[]>(props.meal?.items ?? []);

const valid = ref(false);

const foodMealItems = computed((): MealItem[] => mealItems.value.filter((item) => item.foodItemId !== undefined));
const recipeMealItems = computed((): MealItem[] => mealItems.value.filter((item) => item.recipeId !== undefined));
const isModified = computed((): boolean => false);

const saveMealItem = (mealItem: MealItem) => {
  // The effect of this cannot be seen in this component currently, but in a full implementation,
  // this would update the meal's items list
  mealItems.value.push(mealItem);
  if (mealItem.foodItemId) {
    foodMealItem.value = null;
  } else if (mealItem.recipeId) {
    recipeMealItem.value = null;
  }
};

const save = () => {
  const mealToSave: Meal = {
    id: props.meal?.id ?? 'new-meal-id',
    type: props.meal?.type ?? 'Lunch',
    items: props.meal?.items ?? [],
  };
  emit('save', mealToSave);
};
</script>

<style scoped></style>
