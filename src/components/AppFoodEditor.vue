<template>
  <v-form v-model="valid">
    <v-container>
      <v-list-subheader>Basic Information</v-list-subheader>
      <v-divider class="mb-4"></v-divider>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Name"
            placeholder="Enter the name of the food..."
            v-model="name"
            :rules="[validationRules.required]"
            data-testid="name-input"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Brand"
            placeholder="Enter the brand (optional)..."
            v-model="brand"
            data-testid="brand-input"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label="Food Category"
            v-model="category"
            :items="foodCategories"
            :rules="[validationRules.required]"
            data-testid="food-category-input"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-list-subheader>Nutritional Information</v-list-subheader>
      <v-divider class="mb-4"></v-divider>

      <v-row>
        <v-col cols="12" md="4">
          <v-number-input
            label="Units"
            v-model="units"
            :rules="[validationRules.required]"
            data-testid="units-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="Unit of Measure"
            v-model="unitOfMeasure"
            :items="unitOfMeasureOptions"
            :rules="[validationRules.required]"
            data-testid="unit-of-measure-input"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-number-input
            label="Grams"
            placeholder="Equivalent grams..."
            v-model="grams"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="grams-input"
          ></v-number-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-number-input
            label="Calories"
            v-model="calories"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="calories-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="4">
          <v-number-input
            label="Sodium (mg)"
            v-model="sodium"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="sodium-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="4">
          <v-number-input
            label="Sugar (g)"
            v-model="sugar"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="sugar-input"
          ></v-number-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-number-input
            label="Total Carbs (g)"
            v-model="carbs"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="carbs-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="4">
          <v-number-input
            label="Fat (g)"
            v-model="fat"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="fat-input"
          ></v-number-input>
        </v-col>
        <v-col cols="12" md="4">
          <v-number-input
            label="Protein (g)"
            v-model="protein"
            :precision="null"
            :rules="[validationRules.required]"
            data-testid="protein-input"
          ></v-number-input>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row class="pa-4" justify="end">
        <v-btn color="secondary" class="mr-4" @click="$emit('cancel')" data-testid="cancel-button">Cancel</v-btn>
        <v-btn color="primary" :disabled="!(valid && isModified())" @click="save" data-testid="save-button">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { findUnitOfMeasure, unitOfMeasureOptions } from '@/data/unit-of-measure';
import { foodCategories, type FoodItem } from '@/models';
import { ref } from 'vue';

const props = defineProps<{ food?: FoodItem }>();
const emit = defineEmits<{ (event: 'save', payload: FoodItem): void; (event: 'cancel'): void }>();

const valid = ref(false);
const name = ref(props.food?.name);
const brand = ref(props.food?.brand);
const category = ref(props.food?.category);
const units = ref(props.food?.units);
const unitOfMeasure = ref(props.food?.unitOfMeasure.id);
const grams = ref(props.food?.grams);
const calories = ref(props.food?.calories);
const sodium = ref(props.food?.sodium || 0);
const sugar = ref(props.food?.sugar || 0);
const carbs = ref(props.food?.carbs || 0);
const fat = ref(props.food?.fat || 0);
const protein = ref(props.food?.protein || 0);
const alternativePortions = props.food?.alternativePortions || [];

const isModified = (): boolean =>
  !props.food ||
  props.food.name !== name.value ||
  props.food.brand !== brand.value ||
  props.food.category !== category.value ||
  props.food.units !== units.value ||
  props.food.unitOfMeasure.id !== unitOfMeasure.value ||
  props.food.grams !== grams.value ||
  props.food.calories !== calories.value ||
  props.food.sodium !== sodium.value ||
  props.food.sugar !== sugar.value ||
  props.food.carbs !== carbs.value ||
  props.food.fat !== fat.value ||
  props.food.protein !== protein.value;

const save = () => {
  const food: Omit<FoodItem, 'alternativePortions'> = {
    id: props.food?.id || undefined,
    fdcId: props.food?.fdcId || null,
    name: name.value || '',
    brand: brand.value || null,
    category: category.value || 'Unknown',
    units: units.value || 0,
    unitOfMeasure: findUnitOfMeasure(unitOfMeasure.value || ''),
    grams: grams.value || 0,
    calories: calories.value || 0,
    sodium: sodium.value || 0,
    sugar: sugar.value || 0,
    carbs: carbs.value || 0,
    fat: fat.value || 0,
    protein: protein.value || 0,
  };
  emit('save', { ...food, alternativePortions });
};
</script>
