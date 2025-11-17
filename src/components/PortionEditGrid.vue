<template>
  <v-container fluid>
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
          v-model="unitOfMeasureId"
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
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
import { findUnitOfMeasure, type Portion } from '@meal-planner/common';
import { computed } from 'vue';

const portion = defineModel<Partial<Portion>>();

const createPortionField = <K extends keyof Partial<Portion>>(key: K) =>
  computed({
    get: () => portion.value?.[key],
    set: (value: Partial<Portion>[K]) => {
      portion.value = {
        ...portion.value,
        [key]: value,
      };
    },
  });

const units = createPortionField('units');
const grams = createPortionField('grams');
const calories = createPortionField('calories');
const sodium = createPortionField('sodium');
const sugar = createPortionField('sugar');
const carbs = createPortionField('carbs');
const fat = createPortionField('fat');
const protein = createPortionField('protein');

const unitOfMeasureId = computed({
  get: () => portion.value?.unitOfMeasure?.id,
  set: (id: string) =>
    (portion.value = {
      ...portion.value,
      unitOfMeasure: findUnitOfMeasure(id || ''),
    }),
});
</script>
