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
            label="Difficulty"
            v-model="difficulty"
            :items="recipeDifficulties"
            :rules="[validationRules.required]"
            data-testid="difficulty-input"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>

    <h2>
      <div class="d-flex justify-space-between">
        <div>Ingredients</div>
        <v-btn
          density="compact"
          variant="text"
          icon="mdi-plus"
          :disabled="ingredientsInvalid"
          @click="addIngredient"
          data-testid="add-ingredient-button"
        ></v-btn>
      </div>
    </h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid data-testid="ingredient-list-grid">
      <IngredientEditorRow
        v-for="(ingredient, index) in ingredients"
        :key="ingredient.id"
        :foods="foods"
        :ingredient="ingredient"
        @delete="() => deleteIngredient(index)"
        @changed="(i) => changeIngredient(i, index)"
      />
    </v-container>

    <h2>
      <div class="d-flex justify-space-between">
        <div>Steps</div>
        <v-btn
          density="compact"
          variant="text"
          icon="mdi-plus"
          :disabled="stepsInvalid"
          @click="() => null"
          data-testid="add-steps-button"
        ></v-btn>
      </div>
    </h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid data-testid="step-list-grid"></v-container>

    <h2>Nutritional Information</h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid>
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
          <v-number-input
            label="Grams per Serving"
            v-model="servingGrams"
            data-testid="grams-per-serving-input"
          ></v-number-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-number-input
            label="Serving Size"
            v-model="servingSize"
            :rules="[validationRules.required]"
            :precision="null"
            data-testid="serving-size-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            label="Serving Units"
            v-model="servingUnitOfMeasureId"
            :items="unitOfMeasureOptions"
            :rules="[validationRules.required]"
            data-testid="unit-of-measure-input"
          ></v-autocomplete>
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
            v-model="totalCarbs"
            :rules="[validationRules.required]"
            data-testid="total-carbs-input"
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
import type { RecipeIngredient, Recipe, RecipeCategory, RecipeDifficulty } from '@/models/recipe';
import { computed, onMounted, ref } from 'vue';
import type { VTextField } from 'vuetify/components';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
import IngredientEditorRow from './IngredientEditorRow.vue';
import { useFoodsData } from '@/data/foods';

const emit = defineEmits<{ (event: 'save', payload: Recipe): void; (event: 'cancel'): void }>();
const props = defineProps<{ recipe?: Recipe }>();

const valid = ref(false);
const name = ref<string>(props.recipe?.name || '');
const description = ref<string>(props.recipe?.description || '');
const category = ref<RecipeCategory | undefined>(props.recipe?.category);
const difficulty = ref<RecipeDifficulty | undefined>(props.recipe?.difficulty);
const servings = ref<number | undefined>(props.recipe?.servings);
const servingSize = ref<number | undefined>(props.recipe?.servingSize);
const servingUnitOfMeasureId = ref<string | undefined>(props.recipe?.servingSizeUnits?.id);
const servingGrams = ref<number | null | undefined>(props.recipe?.servingGrams);
const calories = ref<number | undefined>(props.recipe?.calories);
const sodium = ref<number>(props.recipe?.sodium || 0);
const sugar = ref<number>(props.recipe?.sugar || 0);
const totalCarbs = ref<number>(props.recipe?.totalCarbs || 0);
const fat = ref<number>(props.recipe?.fat || 0);
const protein = ref<number>(props.recipe?.protein || 0);
const ingredients = ref<RecipeIngredient[]>(props.recipe ? [...props.recipe.ingredients] : []);
const steps = ref<string[]>(props.recipe ? [...props.recipe.steps] : []);

const nameInput = ref<InstanceType<typeof VTextField> | null>(null);
const listChanged = ref(false);

const { foods } = useFoodsData();

const ingredientsInvalid = computed(
  (): boolean => !!ingredients.value.find((i) => !(i.units && i.name && i.unitOfMeasure)),
);

const stepsInvalid = computed((): boolean => !!steps.value.find((s) => !!(s && s.trim())));

const addIngredient = () => {
  ingredients.value.push({
    id: crypto.randomUUID(),
    units: 1,
    unitOfMeasure: findUnitOfMeasure('item'),
    name: '',
  });
  listChanged.value = true;
};

const changeIngredient = (ingredient: RecipeIngredient, index: number) => {
  ingredients.value[index] = { ...ingredient, id: ingredients.value[index]!.id };
  listChanged.value = true;
};

const deleteIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
  listChanged.value = true;
};

const isModified = computed((): boolean => {
  if (!props.recipe) return true;
  return (
    listChanged.value ||
    props.recipe.name !== name.value ||
    props.recipe.category !== category.value ||
    props.recipe.difficulty !== difficulty.value ||
    props.recipe.servings !== servings.value ||
    props.recipe.servingSize !== servingSize.value ||
    props.recipe.servingSizeUnits.id !== servingUnitOfMeasureId.value ||
    props.recipe.servingGrams !== servingGrams.value ||
    props.recipe.calories !== calories.value ||
    props.recipe.sodium !== sodium.value ||
    props.recipe.sugar !== sugar.value ||
    props.recipe.totalCarbs !== totalCarbs.value ||
    props.recipe.fat !== fat.value ||
    props.recipe.protein !== protein.value
  );
});

const save = () => {
  emit('save', {
    ...props.recipe,
    name: name.value.trim(),
    description: description.value.trim() || null,
    category: category.value!,
    difficulty: difficulty.value!,
    servings: servings.value!,
    servingSize: servingSize.value!,
    servingSizeUnits: findUnitOfMeasure(servingUnitOfMeasureId.value!),
    servingGrams: servingGrams.value || null,
    calories: calories.value!,
    sodium: sodium.value,
    sugar: sugar.value,
    totalCarbs: totalCarbs.value,
    fat: fat.value,
    protein: protein.value,
    ingredients: ingredients.value,
    steps: steps.value,
  });
};

onMounted(() => nameInput.value?.focus());
</script>
