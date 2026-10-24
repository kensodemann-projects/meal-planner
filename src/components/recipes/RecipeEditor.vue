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
            :rules="nameRules"
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
          <SelectAutocomplete
            label="Category"
            v-model="category"
            :items="recipeCategories"
            :rules="[validationRules.required]"
            data-testid="category-input"
          />
        </v-col>

        <v-col cols="12" md="6">
          <SelectAutocomplete
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
            :rules="[validationRules.required, validationRules.positive]"
            data-testid="servings-input"
          ></v-number-input>
        </v-col>

        <v-col cols="12" md="6">
          <SelectAutocomplete
            v-if="kind === 'homemade'"
            label="Difficulty"
            v-model="difficulty"
            :items="recipeDifficulties"
            :rules="[validationRules.required]"
            data-testid="difficulty-input"
          />
          <SelectAutocomplete
            v-else
            label="Source"
            v-model="sourceId"
            :items="sources"
            :rules="[validationRules.required]"
            item-title="name"
            item-value="id"
            data-testid="source-input"
          />
        </v-col>
      </v-row>

      <v-row v-if="kind === 'homemade'">
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

    <div v-if="kind === 'homemade'">
      <SortableListEditor
        v-model="ingredients"
        title="Ingredients"
        :validate-item="isValidIngredient"
        :create-item="createIngredient"
        add-prompt="Add Ingredient"
        test-id-prefix="ingredient"
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
        add-prompt="Add Step"
        test-id-prefix="step"
      >
        <template #item="{ item, onAddNext, onChange, onDelete }">
          <StepEditorRow :step="item" @add-next="onAddNext" @changed="onChange" @delete="onDelete" />
        </template>
      </SortableListEditor>
    </div>

    <div class="d-flex justify-space-between align-center">
      <h2>Nutritional Information Per Serving</h2>
      <SecondaryButton
        @click="calculateNutritionInformation"
        :disabled="disableNutritionButton"
        :loading="nutritionInfoLoading"
        data-testid="calculate-nutrition-button"
      >
        Calculate Nutrition
      </SecondaryButton>
    </div>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid>
      <NutritionEditorRows v-model="nutrition" />
    </v-container>

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CancelButton class="mr-4" @click="$emit('cancel')" />
        <SaveButton class="mr-4" :disabled="!(valid && isModified)" @click="save" />
      </v-row>
    </v-container>
  </v-form>

  <v-snackbar
    color="success"
    location="bottom center"
    prepend-icon="$success"
    text="Nutrition information calculated successfully."
    timeout="3000"
    title="Success"
    contained
    v-model="showSuccessSnackbar"
    data-testid="calculate-nutrition-success-snackbar"
  />

  <v-snackbar
    color="error"
    location="bottom center"
    prepend-icon="$error"
    text="An error occurred while calculating nutrition information."
    timeout="-1"
    title="Error"
    contained
    v-model="showErrorSnackbar"
    data-testid="calculate-nutrition-error-snackbar"
  >
    <template v-slot:actions>
      <v-btn variant="text" color="white" @click="showErrorSnackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNutritionGenerator, type NutritionPromptRecipe } from '@/core/nutrition-generator';
import { validationRules } from '@/core/validation-rules';
import { cuisines } from '@/data/cuisines';
import { recipeCategories } from '@/data/recipe-categories';
import { recipeDifficulties } from '@/data/recipe-difficulties';
import { useRecipesData } from '@/data/recipes';
import { useSourcesData } from '@/data/sources';
import type { Nutrition } from '@/models/nutrition';
import type {
  Cuisine,
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
  RecipeIngredient,
  RecipeKind,
  RecipeStep,
} from '@/models/recipe';
import { computed, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import type { VTextField } from 'vuetify/components';

const emit = defineEmits<{ (event: 'save', payload: Recipe): void; (event: 'cancel'): void }>();
const props = withDefaults(defineProps<{ recipe?: Recipe; kind?: RecipeKind }>(), {
  kind: ({ recipe }) => recipe?.kind || 'homemade',
});

const { generateNutritionData } = useNutritionGenerator();
const { loading, recipes } = useRecipesData();
const { sources } = useSourcesData();

const valid = shallowRef(false);
const sourceId = shallowRef<string | null>(props.recipe?.sourceId ?? null);
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
  sodium: props.recipe?.sodium,
  sugar: props.recipe?.sugar,
  carbs: props.recipe?.carbs,
  fat: props.recipe?.fat,
  protein: props.recipe?.protein,
});
// structuredClone rejects Vue reactive proxies, so unwrap the prop lists first.
const cloneList = <T,>(items: T[]): T[] => structuredClone(toRaw(items));
const ingredients = ref<Partial<RecipeIngredient>[]>(props.recipe ? cloneList(props.recipe.ingredients) : []);
const steps = ref<Partial<RecipeStep>[]>(props.recipe ? cloneList(props.recipe.steps) : []);
const nutritionInfoLoading = shallowRef(false);
const showSuccessSnackbar = shallowRef(false);
const showErrorSnackbar = shallowRef(false);

const nameInput = ref<InstanceType<typeof VTextField> | null>(null);

const isSameNameScope = (x: Recipe) =>
  (x.kind || 'homemade') === props.kind && (props.kind === 'homemade' || x.sourceId === sourceId.value);

const recipeNames = computed((): string[] =>
  recipes.value.filter((x) => x.id !== props.recipe?.id && isSameNameScope(x)).map((x) => x.name),
);

const mustBeUniqueName = computed(() => validationRules.mustBeUnique(recipeNames.value));

const nameRules = [
  validationRules.required,
  (value: string | null | undefined) => {
    if (!value?.trim()) return true;
    if (loading.value) return 'Recipes are still loading';
    return mustBeUniqueName.value(value);
  },
];

watch([loading, recipeNames], () => {
  if (name.value.trim()) {
    nameInput.value?.validate();
  }
});

const createIngredient = (): Partial<RecipeIngredient> => ({
  id: globalThis.crypto.randomUUID(),
});

const createStep = (): Partial<RecipeStep> => ({
  id: globalThis.crypto.randomUUID(),
});

const isValidIngredient = (item: Partial<RecipeIngredient>): item is RecipeIngredient => {
  return (
    typeof item.units === 'number' &&
    item.units > 0 &&
    'name' in item &&
    'unitOfMeasure' in item &&
    !!(item.name?.trim() && item.unitOfMeasure)
  );
};

const isValidStep = (item: Partial<RecipeStep>): item is RecipeStep => {
  return 'instruction' in item && !!item.instruction?.trim();
};

const validTrimmedIngredients = (): RecipeIngredient[] =>
  ingredients.value.filter(isValidIngredient).map((ingredient) => ({
    ...ingredient,
    name: ingredient.name.trim(),
  }));

const validTrimmedSteps = (): RecipeStep[] =>
  steps.value.filter(isValidStep).map((step) => ({
    ...step,
    instruction: step.instruction.trim(),
  }));

const ingredientAtIndexDiffers = (current: Partial<RecipeIngredient>, opened: Partial<RecipeIngredient>): boolean =>
  current.id !== opened.id ||
  current.units !== opened.units ||
  (current.name ?? '').trim() !== opened.name ||
  current.unitOfMeasure?.id !== opened.unitOfMeasure?.id ||
  current.unitOfMeasure?.name !== opened.unitOfMeasure?.name ||
  current.unitOfMeasure?.type !== opened.unitOfMeasure?.type ||
  current.unitOfMeasure?.system !== opened.unitOfMeasure?.system;

const stepAtIndexDiffers = (current: Partial<RecipeStep>, opened: Partial<RecipeStep>): boolean =>
  current.id !== opened.id || (current.instruction ?? '').trim() !== opened.instruction;

const listDiffers = <T,>(
  current: Partial<T>[],
  opened: Partial<T>[],
  itemDiffers: (currentItem: Partial<T>, openedItem: Partial<T>) => boolean,
): boolean => current.length !== opened.length || current.some((item, index) => itemDiffers(item, opened[index]!));

const isModified = computed((): boolean => {
  if (!props.recipe) return true;
  return (
    listDiffers(ingredients.value, props.recipe.ingredients, ingredientAtIndexDiffers) ||
    listDiffers(steps.value, props.recipe.steps, stepAtIndexDiffers) ||
    name.value.trim() !== props.recipe.name ||
    (description.value.trim() || null) !== (props.recipe.description || null) ||
    props.recipe.category !== category.value ||
    props.recipe.cuisine !== cuisine.value ||
    props.recipe.difficulty !== difficulty.value ||
    props.recipe.servings !== servings.value ||
    props.recipe.prepTimeMinutes !== prepTimeMinutes.value ||
    props.recipe.cookTimeMinutes !== cookTimeMinutes.value ||
    (props.recipe.sourceId ?? null) !== sourceId.value ||
    props.recipe.calories !== nutrition.value.calories ||
    props.recipe.sodium !== nutrition.value.sodium ||
    props.recipe.sugar !== nutrition.value.sugar ||
    props.recipe.carbs !== nutrition.value.carbs ||
    props.recipe.fat !== nutrition.value.fat ||
    props.recipe.protein !== nutrition.value.protein
  );
});

const absent = (value: unknown): value is null | undefined => value === null || value === undefined;

const createRecipeFromForm = (): Recipe | undefined => {
  const categoryValue = category.value;
  const cuisineValue = cuisine.value;
  const servingsValue = servings.value;
  const { calories, sodium, sugar, carbs, fat, protein } = nutrition.value;
  if (
    absent(categoryValue) ||
    absent(cuisineValue) ||
    absent(servingsValue) ||
    absent(calories) ||
    absent(sodium) ||
    absent(sugar) ||
    absent(carbs) ||
    absent(fat) ||
    absent(protein)
  ) {
    return undefined;
  }

  const shared = {
    name: name.value.trim(),
    description: description.value.trim() || null,
    kind: props.kind,
    category: categoryValue,
    cuisine: cuisineValue,
    servings: servingsValue,
    calories,
    sodium,
    sugar,
    carbs,
    fat,
    protein,
  };

  if (props.kind === 'homemade') {
    const difficultyValue = difficulty.value;
    const prepTime = prepTimeMinutes.value;
    const cookTime = cookTimeMinutes.value;
    if (absent(difficultyValue) || absent(prepTime) || absent(cookTime)) {
      return undefined;
    }
    return {
      ...shared,
      difficulty: difficultyValue,
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      ingredients: validTrimmedIngredients(),
      steps: validTrimmedSteps(),
    };
  }

  const selectedSourceId = sourceId.value;
  if (absent(selectedSourceId)) {
    return undefined;
  }
  return {
    ...shared,
    sourceId: selectedSourceId,
    difficulty: 'Easy',
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    ingredients: [],
    steps: [],
  };
};

const save = () => {
  const recipe = createRecipeFromForm();
  if (recipe === undefined) return;
  emit('save', props.recipe ? { ...recipe, id: props.recipe.id } : recipe);
};

const disableNutritionButton = computed(() => {
  return (
    !servings.value ||
    servings.value <= 0 ||
    name.value.trim() === '' ||
    (props.kind === 'prepared' && !sourceId.value) ||
    (props.kind === 'homemade' && !ingredients.value.some(isValidIngredient))
  );
});

const nutritionPromptFromForm = (): NutritionPromptRecipe | undefined => {
  const servingsValue = servings.value;
  if (absent(servingsValue)) return undefined;
  const shared = {
    name: name.value.trim(),
    description: description.value.trim() || null,
    kind: props.kind,
    category: category.value,
    cuisine: cuisine.value,
    servings: servingsValue,
  };
  return props.kind === 'homemade'
    ? {
        ...shared,
        ingredients: validTrimmedIngredients(),
        steps: validTrimmedSteps(),
      }
    : {
        ...shared,
        sourceId: sourceId.value ?? undefined,
        ingredients: [],
        steps: [],
      };
};

const calculateNutritionInformation = async () => {
  const recipe = nutritionPromptFromForm();
  if (recipe === undefined) return;
  nutritionInfoLoading.value = true;
  try {
    // A missing prepared source is passed through so the generator throws and the existing catch shows the error.
    nutrition.value =
      recipe.kind === 'prepared'
        ? await generateNutritionData(
            recipe,
            sources.value.find((source) => source.id === recipe.sourceId),
          )
        : await generateNutritionData(recipe);
    showSuccessSnackbar.value = true;
  } catch {
    showErrorSnackbar.value = true;
  } finally {
    nutritionInfoLoading.value = false;
  }
};

onMounted(() => nameInput.value?.focus());
</script>
