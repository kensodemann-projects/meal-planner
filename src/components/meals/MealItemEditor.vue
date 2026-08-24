<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Select Date"
                v-model="mealDate"
                v-model:search="mealDateSearch"
                :items="weekDates"
                item-title="dateString"
                item-value="date"
                :rules="[validationRules.required]"
                data-testid="date-input"
                @keydown.tab="selectFirstMatchingDate"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6"></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Select Recipe"
                v-model="recipeId"
                v-model:search="recipeSearch"
                :items="recipes"
                item-title="name"
                item-value="id"
                :rules="[validationRules.required]"
                data-testid="recipe-input"
                @keydown.tab="selectFirstMatchingRecipe"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-number-input
                label="Servings"
                v-model="servings"
                :precision="null"
                :rules="[validationRules.required, validationRules.positive]"
                data-testid="servings-input"
              ></v-number-input>
            </v-col>
          </v-row>

          <NutritionEditorRows v-model="nutrition" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified && valid)" @click="$emit('cancel')" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { useRecipesData } from '@/data/recipes';
import type { MealItem, MealType } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import { computed, ref, shallowRef, watch } from 'vue';
import { addDays, format } from 'date-fns';

export interface PlannedMealItem {
  mealItem: MealItem;
  mealDate: string;
  mealType: MealType;
}

const { mealItem, weekStartDate } = defineProps<{
  mealItem?: MealItem;
  mealType?: MealType;
  mealDate?: string;
  weekStartDate: string;
}>();

const valid = shallowRef(false);
const isModified = shallowRef(false);
const mealDate = shallowRef<string>(weekStartDate);
const mealDateSearch = shallowRef<string>('');
const nutrition = ref<Nutrition | undefined>(mealItem?.nutrition);
const recipeId = shallowRef<string | undefined>(mealItem?.recipeId);
const servings = shallowRef<number>(mealItem?.servings || 1);
const recipeSearch = shallowRef<string>('');
const { recipes } = useRecipesData();

const weekDates = computed(() => {
  const [year, month, day] = weekStartDate.split('-').map(Number);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(year, month - 1, day), i);
    return {
      dateString: format(date, 'EEEE, MMMM d'),
      date: format(date, 'yyyy-MM-dd'),
    };
  });
});

defineEmits<{
  (event: 'cancel'): void;
  (event: 'save', payload: PlannedMealItem): void;
}>();

const selectFirstMatchingRecipe = () => {
  if (!recipeSearch.value) {
    recipeId.value = '';
    return;
  }
  const match = recipes.value?.find((recipe) => recipe.name.toLowerCase().includes(recipeSearch.value.toLowerCase()));
  recipeId.value = match?.id || '';
};

const selectFirstMatchingDate = () => {
  if (!mealDateSearch.value) {
    mealDate.value = weekStartDate;
    return;
  }
  return weekStartDate;
};

watch(recipeId, () => {
  if (recipeId.value) {
    const recipe = recipes.value?.find((recipe) => recipe.id === recipeId.value);
    if (recipe) {
      nutrition.value = {
        calories: recipe.calories * servings.value,
        sodium: recipe.sodium * servings.value,
        sugar: recipe.sugar * servings.value,
        carbs: recipe.carbs * servings.value,
        fat: recipe.fat * servings.value,
        protein: recipe.protein * servings.value,
      };
    }
  }
});
</script>

<style scoped></style>
