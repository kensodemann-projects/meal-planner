<template>
  <v-card>
    <v-card-text>
      <div class="d-flex justify-space-between align-center">
        <h3>Recipes</h3>
        <v-btn
          density="compact"
          variant="text"
          icon="mdi-plus"
          :disabled="recipeMealItem !== null"
          @click="() => (recipeMealItem = {})"
          data-testid="add-recipe-button"
        ></v-btn>
      </div>
      <v-divider class="mb-4"></v-divider>
      <MealItemEditorCard
        v-if="recipeMealItem !== null"
        :meal-item="recipeMealItem"
        :items="recipes"
        @save="createMealItem"
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
              @save="(updatedItem) => updateMealItem(recipe, updatedItem)"
              @cancel="() => (recipe.isEditing = false)"
            />
            <div v-else>
              <NutritionData :value="recipe.item.nutrition" />
              <ModifyButton @click="() => (recipe.isEditing = true)" />
              <DeleteButton @click="askToDelete(recipe)" />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <h3 class="mt-8">Total Nutrition</h3>
      <v-divider class="mb-4"></v-divider>
      <NutritionData :value="totalNutrition" data-testid="total-nutrition" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <CloseButton
        class="mr-4"
        :disabled="!!recipeMealItem || recipeMealItems.some((item) => item.isEditing)"
        @click="$emit('close')"
      />
    </v-card-actions>
  </v-card>

  <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to remove this item from the meal?"
      icon-color="error"
      @confirm="removeMealItem"
      @cancel="showConfirmDialog = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { useRecipesData } from '@/data/recipes';
import type { EditableItem } from '@/models/editable-item';
import type { Meal, MealItem } from '@/models/meal';
import { computed, ref } from 'vue';

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'meal-changed', value: Meal): void;
}>();
const props = defineProps<{ meal: Meal }>();

const { recipes } = useRecipesData();

const recipeMealItem = ref<Partial<MealItem> | null>(null);
const mealItemToRemove = ref<MealItem | null>(null);
const mealItems = ref<EditableItem<MealItem>[]>(props.meal.items.map((item) => ({ isEditing: false, item })));

const showConfirmDialog = ref(false);

const recipeMealItems = computed((): EditableItem<MealItem>[] =>
  mealItems.value.filter((wrappedItem) => wrappedItem.item.recipeId !== undefined),
);

const totalNutrition = computed(() => {
  return mealItems.value.reduce(
    (total, wrappedItem) => {
      const itemNutrition = wrappedItem.item.nutrition;
      return {
        calories: total.calories + itemNutrition.calories,
        protein: total.protein + itemNutrition.protein,
        carbs: total.carbs + itemNutrition.carbs,
        fat: total.fat + itemNutrition.fat,
        sugar: total.sugar + itemNutrition.sugar,
        sodium: total.sodium + itemNutrition.sodium,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0 },
  );
});

const askToDelete = (item: EditableItem<MealItem>) => {
  mealItemToRemove.value = item.item;
  showConfirmDialog.value = true;
};

const currentMeal = (): Meal => ({
  ...props.meal,
  items: mealItems.value.map((wrappedItem) => wrappedItem.item),
});

const removeMealItem = () => {
  if (mealItemToRemove.value) {
    mealItems.value = mealItems.value.filter((wrappedItem) => wrappedItem.item !== mealItemToRemove.value);
  }
  mealItemToRemove.value = null;
  showConfirmDialog.value = false;
  emit('meal-changed', currentMeal());
};

const createMealItem = (item: MealItem) => {
  mealItems.value.push({ item, isEditing: false });
  if (item.recipeId) {
    recipeMealItem.value = null;
  }
  emit('meal-changed', currentMeal());
};

const updateMealItem = (wrapper: EditableItem<MealItem>, item: MealItem) => {
  wrapper.item = item;
  wrapper.isEditing = false;
  emit('meal-changed', currentMeal());
};
</script>
