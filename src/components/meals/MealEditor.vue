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
    <v-expansion-panel v-for="recipe in recipeMealItems" :key="recipe.item.id">
      <v-expansion-panel-title>
        {{ recipe.item.name }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <MealItemEditorCard
          v-if="recipe.isEditing"
          :meal-item="recipe.item"
          :items="recipes"
          type="recipe"
          @save="
            (updatedItem) => {
              const index = recipeMealItems.indexOf(recipe);
              if (index !== -1) {
                recipeMealItems[index] = { item: updatedItem, isEditing: false };
              }
            }
          "
          @cancel="() => (recipe.isEditing = false)"
        />
        <div v-else>
          <NutritionData :value="recipe.item.nutrition" />
          <ModifyButton @click="() => (recipe.isEditing = true)" />
          <DeleteButton />
        </div>
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
    <v-expansion-panel v-for="food in foodMealItems" :key="food.item.id">
      <v-expansion-panel-title>
        {{ food.item.name }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <MealItemEditorCard
          v-if="food.isEditing"
          :meal-item="food.item"
          :items="foods"
          type="food"
          @save="
            (updatedItem) => {
              food.item = updatedItem;
              food.isEditing = false;
            }
          "
          @cancel="() => (food.isEditing = false)"
        />
        <div v-else>
          <NutritionData :value="food.item.nutrition" />
          <ModifyButton @click="() => (food.isEditing = true)" />
          <DeleteButton />
        </div>
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

type WrappedMealItem = { isEditing: boolean; item: MealItem };

const foodMealItem = ref<Partial<MealItem> | null>(null);
const recipeMealItem = ref<Partial<MealItem> | null>(null);
const mealItems = ref<WrappedMealItem[]>(props.meal?.items.map((item) => ({ isEditing: false, item })) ?? []);

const valid = ref(false);

const foodMealItems = computed((): WrappedMealItem[] => mealItems.value.filter((x) => x.item.foodItemId !== undefined));
const recipeMealItems = computed((): WrappedMealItem[] => mealItems.value.filter((x) => x.item.recipeId !== undefined));

const isModified = computed((): boolean => false);

const saveMealItem = (item: MealItem) => {
  // The effect of this cannot be seen in this component currently, but in a full implementation,
  // this would update the meal's items list
  mealItems.value.push({ item, isEditing: false });
  if (item.foodItemId) {
    foodMealItem.value = null;
  } else if (item.recipeId) {
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
