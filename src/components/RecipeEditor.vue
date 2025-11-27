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

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CancelButton class="mr-4" @click="$emit('cancel')" />
        <SaveButton :disabled="!(valid && isModified)" @click="save" />
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { recipeCategories } from '@/data/recipe-categories';
import { recipeDifficulties } from '@/data/recipe-difficulties';
import type { Recipe, RecipeCategory, RecipeDifficulty } from '@/models/recipe';
import { computed, onMounted, ref } from 'vue';
import type { VTextField } from 'vuetify/components';

const emit = defineEmits<{ (event: 'save', payload: Recipe): void; (event: 'cancel'): void }>();
const props = defineProps<{ recipe?: Recipe }>();

const valid = ref(false);
const name = ref<string>(props.recipe?.name || '');
const category = ref<RecipeCategory | undefined>(props.recipe?.category);
const difficulty = ref<RecipeDifficulty | undefined>(props.recipe?.difficulty);

const nameInput = ref<InstanceType<typeof VTextField> | null>(null);

const isModified = computed((): boolean => {
  if (!props.recipe) return true;

  if (
    props.recipe.name !== name.value ||
    props.recipe.category !== category.value ||
    props.recipe.difficulty !== difficulty.value
  ) {
    return true;
  }

  return false;
});

const save = () => {
  emit('save', {
    ...props.recipe,
    name: name.value,
    category: category.value!,
    difficulty: difficulty.value!,
  });
};

onMounted(() => nameInput.value?.focus());
</script>
