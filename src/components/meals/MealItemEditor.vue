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
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Select Meal Type"
                v-model="mealType"
                v-model:search="mealTypeSearch"
                :items="mealTypes"
                :rules="[validationRules.required]"
                data-testid="meal-type-input"
                @keydown.tab="selectFirstMatchingMealType"
              ></v-autocomplete>
            </v-col>
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
        <SaveButton :disabled="!(isModified && valid)" @click="onSave" />
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

const props = defineProps<{
  mealItem?: MealItem;
  mealType?: MealType;
  mealDate?: string;
  weekStartDate: string;
}>();

const valid = shallowRef(false);
const mealDate = shallowRef<string | undefined | null>(props.mealDate);
const mealDateSearch = shallowRef<string>('');
const mealType = shallowRef<MealType | undefined | null>(props.mealType);
const mealTypeSearch = shallowRef<string>('');
const nutrition = ref<Nutrition | undefined>(props.mealItem?.nutrition);
const recipeId = shallowRef<string | undefined | null>(props.mealItem?.recipeId);
const servings = shallowRef<number>(props.mealItem?.servings || 1);
const recipeSearch = shallowRef<string>('');
const { recipes } = useRecipesData();

const weekDates = computed(() => {
  const [year, month, day] = props.weekStartDate.split('-').map(Number);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(year, month - 1, day), i);
    return {
      dateString: format(date, 'EEEE, MMMM d'),
      date: format(date, 'yyyy-MM-dd'),
    };
  });
});

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'save', payload: PlannedMealItem): void;
}>();

const selectFirstMatchingRecipe = () => {
  if (!recipeSearch.value) {
    recipeId.value = null;
    return;
  }
  const match = recipes.value?.find((recipe) => recipe.name.toLowerCase().includes(recipeSearch.value.toLowerCase()));
  recipeId.value = match?.id || null;
};

const selectFirstMatchingDate = () => {
  if (!mealDateSearch.value) {
    mealDate.value = null;
    return;
  }
  const match = weekDates.value?.find((dt) => dt.dateString.toLowerCase().includes(mealDateSearch.value.toLowerCase()));
  mealDate.value = match?.date || null;
};

const selectFirstMatchingMealType = () => {
  if (!mealTypeSearch.value) {
    mealType.value = null;
    return;
  }
  const match = mealTypes.find((type) => type.toLowerCase().includes(mealTypeSearch.value.toLowerCase()));
  mealType.value = match || null;
};

const isModified = computed(() => {
  if (!props.mealItem) return true;
  if (
    mealDate.value !== props.mealDate ||
    mealType.value !== props.mealType ||
    recipeId.value !== props.mealItem?.recipeId ||
    servings.value !== props.mealItem?.servings
  )
    return true;
  const nutritionFields: (keyof Nutrition)[] = ['calories', 'sodium', 'sugar', 'carbs', 'fat', 'protein'];
  return nutritionFields.some((field) => nutrition.value?.[field] !== props.mealItem?.nutrition?.[field]);
});

const setNutritionFromRecipe = () => {
  if (recipeId.value && servings.value) {
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
};

watch(recipeId, () => setNutritionFromRecipe());
watch(servings, () => setNutritionFromRecipe());

const onSave = () => {
  emit('save', {
    mealDate: mealDate.value!,
    mealType: mealType.value!,
    mealItem: {
      id: props.mealItem?.id || globalThis.crypto.randomUUID(),
      name: recipes.value?.find((recipe) => recipe.id === recipeId.value)?.name || '',
      recipeId: recipeId.value!,
      servings: servings.value,
      nutrition: { ...nutrition.value! },
    },
  });
};
</script>

<style scoped></style>
