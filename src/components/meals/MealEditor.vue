<template>
  <v-card>
    <v-card-text>
      <h3>
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
      </h3>
      <v-divider class="mb-4"></v-divider>
      <MealItemEditorCard
        v-if="recipeMealItem !== null"
        :meal-item="recipeMealItem"
        :items="recipes"
        type="recipe"
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
              type="recipe"
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

      <h3 class="mt-8">
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
      </h3>
      <v-divider class="mb-4"></v-divider>
      <MealItemEditorCard
        v-if="foodMealItem !== null"
        :meal-item="foodMealItem"
        :items="foods"
        type="food"
        @save="createMealItem"
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
              @save="(updatedItem) => updateMealItem(food, updatedItem)"
              @cancel="() => (food.isEditing = false)"
            />
            <div v-else>
              <NutritionData :value="food.item.nutrition" />
              <ModifyButton @click="() => (food.isEditing = true)" />
              <DeleteButton @click="askToDelete(food)" />
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
      <CancelButton class="mr-4" @click="$emit('cancel')" />
      <SaveButton :disabled="!isModified" @click="save" />
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
import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';
import type { EditableItem } from '@/models/editable-item';
import type { Meal, MealItem } from '@/models/meal';
import { computed, ref } from 'vue';

const emit = defineEmits<{ (event: 'save', payload: Meal): void; (event: 'cancel'): void }>();
const props = defineProps<{ meal: Meal }>();

const { foods } = useFoodsData();
const { recipes } = useRecipesData();

const foodMealItem = ref<Partial<MealItem> | null>(null);
const recipeMealItem = ref<Partial<MealItem> | null>(null);
const mealItemToRemove = ref<MealItem | null>(null);
const mealItems = ref<EditableItem<MealItem>[]>(props.meal.items.map((item) => ({ isEditing: false, item })));
const isModified = ref(false);

const showConfirmDialog = ref(false);

const foodMealItems = computed((): EditableItem<MealItem>[] =>
  mealItems.value.filter((wrappedItem) => wrappedItem.item.foodItemId !== undefined),
);
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

const removeMealItem = () => {
  if (mealItemToRemove.value) {
    mealItems.value = mealItems.value.filter((wrappedItem) => wrappedItem.item !== mealItemToRemove.value);
  }
  mealItemToRemove.value = null;
  showConfirmDialog.value = false;
};

const createMealItem = (item: MealItem) => {
  mealItems.value.push({ item, isEditing: false });
  if (item.foodItemId) {
    foodMealItem.value = null;
  } else if (item.recipeId) {
    recipeMealItem.value = null;
  }
  isModified.value = true;
};

const updateMealItem = (wrapper: EditableItem<MealItem>, item: MealItem) => {
  wrapper.item = item;
  wrapper.isEditing = false;
  isModified.value = true;
};

const save = () => {
  const mealToSave: Meal = {
    ...props.meal,
    items: mealItems.value.map((wrappedItem) => wrappedItem.item),
  };
  emit('save', mealToSave);
};
</script>

<style scoped></style>
