<template>
  <v-form v-model="valid">
    <h2>Basic Information</h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Name"
            placeholder="Enter the name of the recipe..."
            v-model="name"
            :rules="[validationRules.required]"
            data-testid="name-input"
            ref="nameInput"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea label="Description" v-model="description" data-testid="description-input"></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <TextAutocomplete
            label="Category"
            v-model="category"
            :items="recipeCategories"
            :rules="[validationRules.required]"
            data-testid="category-input"
          />
        </v-col>

        <v-col cols="12" md="6">
          <TextAutocomplete
            label="Cuisine"
            v-model="cuisine"
            :items="cuisines"
            :rules="[validationRules.required]"
            data-testid="cuisine-input"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-number-input
            label="Servings"
            v-model="servings"
            :rules="[validationRules.required]"
            data-testid="servings-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="6">
          <TextAutocomplete
            label="Difficulty"
            v-model="difficulty"
            :items="recipeDifficulties"
            :rules="[validationRules.required]"
            data-testid="difficulty-input"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-number-input
            label="Preparation Time (minutes)"
            v-model="prepTimeMinutes"
            :rules="[validationRules.required, validationRules.zeroOrGreater]"
            data-testid="prep-time-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-number-input
            label="Cooking Time (minutes)"
            v-model="cookTimeMinutes"
            :rules="[validationRules.required, validationRules.zeroOrGreater]"
            data-testid="cook-time-input"
          ></v-number-input>
        </v-col>
      </v-row>
    </v-container>

    <SortableListEditor
      v-model="ingredients"
      title="Ingredients"
      :validate-item="isValidIngredient"
      :create-item="createIngredient"
      @list-modified="listChanged = true"
      add-prompt="Add Ingredient"
      test-id-prefix="ingredient"
      list-class="ingredient-list editable-list"
    >
      <template #item="{ item, onAddNext, onChange, onDelete }">
        <IngredientEditorRow :ingredient="item" @add-next="onAddNext" @changed="onChange" @delete="onDelete" />
      </template>
    </SortableListEditor>

    <SortableListEditor
      v-model="steps"
      title="Steps"
      :validate-item="isValidStep"
      :create-item="createStep"
      @list-modified="listChanged = true"
      add-prompt="Add Step"
      test-id-prefix="step"
      list-class="step-list editable-list"
    >
      <template #item="{ item, onAddNext, onChange, onDelete }">
        <StepEditorRow :step="item" @add-next="onAddNext" @changed="onChange" @delete="onDelete" />
      </template>
    </SortableListEditor>

    <h2>Nutritional Information Per Serving</h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid>
      <NutritionEditorRows v-model="nutrition" />
    </v-container>

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CancelButton class="mr-4" @click="$emit('cancel')" />
        <SaveButton class="mr-4" :disabled="!(valid && isModified)" @click="save" />
        <SecondaryButton
          @click="calculateNutritionInformation"
          :disabled="false"
          :loading="nutritionInfoLoading"
          data-testid="calculate-nutrition-button"
          >Calculate Nutrition</SecondaryButton
        >
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { cuisines } from '@/data/cuisines';
import { recipeCategories } from '@/data/recipe-categories';
import { recipeDifficulties } from '@/data/recipe-difficulties';
import type { Nutrition } from '@/models/nutrition';
import type { Cuisine, Recipe, RecipeCategory, RecipeDifficulty, RecipeIngredient, RecipeStep } from '@/models/recipe';
import { computed, onMounted, ref, shallowRef } from 'vue';
import type { VTextField } from 'vuetify/components';

const emit = defineEmits<{ (event: 'save', payload: Recipe): void; (event: 'cancel'): void }>();
const props = defineProps<{ recipe?: Recipe }>();

const valid = shallowRef(false);
const name = shallowRef<string>(props.recipe?.name || '');
const description = shallowRef<string>(props.recipe?.description || '');
const category = shallowRef<RecipeCategory | null>(props.recipe?.category ?? null);
const cuisine = shallowRef<Cuisine | null>(props.recipe?.cuisine ?? null);
const difficulty = shallowRef<RecipeDifficulty | null>(props.recipe?.difficulty ?? null);
const servings = shallowRef<number | undefined>(props.recipe?.servings);
const prepTimeMinutes = shallowRef<number | undefined>(props.recipe?.prepTimeMinutes);
const cookTimeMinutes = shallowRef<number | undefined>(props.recipe?.cookTimeMinutes);
const nutrition = ref<Partial<Nutrition>>({
  calories: props.recipe?.calories,
  sodium: props.recipe?.sodium || 0,
  sugar: props.recipe?.sugar || 0,
  carbs: props.recipe?.carbs || 0,
  fat: props.recipe?.fat || 0,
  protein: props.recipe?.protein || 0,
});
const ingredients = ref<Partial<RecipeIngredient>[]>(props.recipe ? [...props.recipe.ingredients] : []);
const steps = ref<Partial<RecipeStep>[]>(props.recipe ? [...props.recipe.steps] : []);
const nutritionInfoLoading = shallowRef(false);

const nameInput = ref<InstanceType<typeof VTextField> | null>(null);
const listChanged = shallowRef(false);

const createIngredient = (): Partial<RecipeIngredient> => ({
  id: globalThis.crypto.randomUUID(),
});

const createStep = (): Partial<RecipeStep> => ({
  id: globalThis.crypto.randomUUID(),
});

const isValidIngredient = (item: Partial<RecipeIngredient>): item is RecipeIngredient => {
  return (
    'units' in item && 'name' in item && 'unitOfMeasure' in item && !!(item.units && item.name && item.unitOfMeasure)
  );
};

const isValidStep = (item: Partial<RecipeStep>): item is RecipeStep => {
  return 'instruction' in item && !!item.instruction?.trim();
};

const isModified = computed((): boolean => {
  if (!props.recipe) return true;
  return (
    listChanged.value ||
    props.recipe.name !== name.value ||
    (props.recipe.description || '') !== description.value ||
    props.recipe.category !== category.value ||
    props.recipe.cuisine !== cuisine.value ||
    props.recipe.difficulty !== difficulty.value ||
    props.recipe.servings !== servings.value ||
    props.recipe.prepTimeMinutes !== prepTimeMinutes.value ||
    props.recipe.cookTimeMinutes !== cookTimeMinutes.value ||
    props.recipe.calories !== nutrition.value.calories ||
    props.recipe.sodium !== nutrition.value.sodium ||
    props.recipe.sugar !== nutrition.value.sugar ||
    props.recipe.carbs !== nutrition.value.carbs ||
    props.recipe.fat !== nutrition.value.fat ||
    props.recipe.protein !== nutrition.value.protein
  );
});

const save = () => {
  const recipe = {
    name: name.value.trim(),
    description: description.value.trim() || null,
    category: category.value!,
    cuisine: cuisine.value!,
    difficulty: difficulty.value!,
    servings: servings.value!,
    prepTimeMinutes: prepTimeMinutes.value!,
    cookTimeMinutes: cookTimeMinutes.value!,
    calories: nutrition.value.calories!,
    sodium: nutrition.value.sodium!,
    sugar: nutrition.value.sugar!,
    carbs: nutrition.value.carbs!,
    fat: nutrition.value.fat!,
    protein: nutrition.value.protein!,
    ingredients: ingredients.value.filter(isValidIngredient),
    steps: steps.value.filter(isValidStep),
  };
  emit('save', {
    ...(props.recipe ? { ...recipe, id: props.recipe.id } : recipe),
  });
};

const calculateNutritionInformation = () => {
  // Placeholder for future implementation
  nutritionInfoLoading.value = true;
  setTimeout(() => {
    nutritionInfoLoading.value = false;
  }, 3000);
};

onMounted(() => nameInput.value?.focus());
</script>

<style scoped>
.ingredient-list,
.step-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px;
}
</style>
