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
          <v-autocomplete
            label="Category"
            v-model="category"
            :items="recipeCategories"
            :rules="[validationRules.required]"
            data-testid="category-input"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            label="Cuisine"
            v-model="cuisine"
            :items="cuisines"
            :rules="[validationRules.required]"
            data-testid="cuisine-input"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-number-input
            label="Servings"
            v-model="servings"
            :rules="[validationRules.required]"
            :precision="null"
            data-testid="servings-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            label="Difficulty"
            v-model="difficulty"
            :items="recipeDifficulties"
            :rules="[validationRules.required]"
            data-testid="difficulty-input"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>

    <SortableListEditor
      v-model="ingredients"
      title="Ingredients"
      :validate-item="isValidIngredient"
      :create-item="createIngredient"
      @list-modified="listChanged = true"
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
      test-id-prefix="step"
      list-class="step-list editable-list"
    >
      <template #item="{ item, onAddNext, onChange, onDelete }">
        <StepEditorRow :step="item" @add-next="onAddNext" @changed="onChange" @delete="onDelete" />
      </template>
    </SortableListEditor>

    <h2>Nutritional Information</h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-number-input
            label="Serving Size"
            v-model="units"
            :rules="[validationRules.required]"
            :precision="null"
            data-testid="recipe-units-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete
            label="Serving Units"
            v-model="unitOfMeasureId"
            :items="unitOfMeasureOptions"
            :rules="[validationRules.required]"
            data-testid="recipe-unit-of-measure-input"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="4">
          <v-number-input
            label="Grams per Serving"
            v-model="grams"
            :rules="[validationRules.required]"
            data-testid="grams-input"
          ></v-number-input>
        </v-col>
      </v-row>
    </v-container>

    <h3>Nutrients per Serving</h3>

    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-number-input
            label="Calories"
            v-model="calories"
            :rules="[validationRules.required]"
            data-testid="calories-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="4">
          <v-number-input
            label="Sodium"
            v-model="sodium"
            :rules="[validationRules.required]"
            data-testid="sodium-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="4">
          <v-number-input
            label="Sugar"
            v-model="sugar"
            :rules="[validationRules.required]"
            data-testid="sugar-input"
          ></v-number-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-number-input
            label="Total Carbohydrates"
            v-model="carbs"
            :rules="[validationRules.required]"
            data-testid="carbs-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="4">
          <v-number-input
            label="Fat"
            v-model="fat"
            :rules="[validationRules.required]"
            data-testid="fat-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="4">
          <v-number-input
            label="Protein"
            :rules="[validationRules.required]"
            v-model="protein"
            data-testid="protein-input"
          ></v-number-input>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CancelButton class="mr-4" @click="$emit('cancel')" />
        <SaveButton :disabled="!(valid && isModified)" @click="save" />
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { validationRules } from '@/core/validation-rules';
import { recipeCategories } from '@/data/recipe-categories';
import { recipeDifficulties } from '@/data/recipe-difficulties';
import type { RecipeIngredient, Recipe, RecipeCategory, RecipeDifficulty, RecipeStep, Cuisine } from '@/models/recipe';
import { computed, onMounted, ref } from 'vue';
import type { VTextField } from 'vuetify/components';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
import { cuisines } from '@/data/cuisines';

const emit = defineEmits<{ (event: 'save', payload: Recipe): void; (event: 'cancel'): void }>();
const props = defineProps<{ recipe?: Recipe }>();

const valid = ref(false);
const name = ref<string>(props.recipe?.name || '');
const description = ref<string>(props.recipe?.description || '');
const category = ref<RecipeCategory | undefined>(props.recipe?.category);
const cuisine = ref<Cuisine | undefined>(props.recipe?.cuisine);
const difficulty = ref<RecipeDifficulty | undefined>(props.recipe?.difficulty);
const servings = ref<number | undefined>(props.recipe?.servings);
const units = ref<number | undefined>(props.recipe?.units);
const unitOfMeasureId = ref<string | undefined>(props.recipe?.unitOfMeasure?.id);
const grams = ref<number | undefined>(props.recipe?.grams);
const calories = ref<number | undefined>(props.recipe?.calories);
const sodium = ref<number>(props.recipe?.sodium || 0);
const sugar = ref<number>(props.recipe?.sugar || 0);
const carbs = ref<number>(props.recipe?.carbs || 0);
const fat = ref<number>(props.recipe?.fat || 0);
const protein = ref<number>(props.recipe?.protein || 0);
const ingredients = ref<Partial<RecipeIngredient>[]>(props.recipe ? [...props.recipe.ingredients] : []);
const steps = ref<Partial<RecipeStep>[]>(props.recipe ? [...props.recipe.steps] : []);

const nameInput = ref<InstanceType<typeof VTextField> | null>(null);
const listChanged = ref(false);

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
    props.recipe.category !== category.value ||
    props.recipe.cuisine !== cuisine.value ||
    props.recipe.difficulty !== difficulty.value ||
    props.recipe.servings !== servings.value ||
    props.recipe.units !== units.value ||
    props.recipe.unitOfMeasure.id !== unitOfMeasureId.value ||
    props.recipe.grams !== grams.value ||
    props.recipe.calories !== calories.value ||
    props.recipe.sodium !== sodium.value ||
    props.recipe.sugar !== sugar.value ||
    props.recipe.carbs !== carbs.value ||
    props.recipe.fat !== fat.value ||
    props.recipe.protein !== protein.value
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
    units: units.value!,
    unitOfMeasure: findUnitOfMeasure(unitOfMeasureId.value!),
    grams: grams.value!,
    calories: calories.value!,
    sodium: sodium.value,
    sugar: sugar.value,
    carbs: carbs.value,
    fat: fat.value,
    protein: protein.value,
    ingredients: ingredients.value.filter(isValidIngredient),
    steps: steps.value.filter(isValidStep),
  };
  emit('save', {
    ...(props.recipe ? { ...recipe, id: props.recipe.id } : recipe),
  });
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
