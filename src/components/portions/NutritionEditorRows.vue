<template>
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
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import type { Nutrition } from '@/models/nutrition';
import { computed } from 'vue';

const nutrition = defineModel<Partial<Nutrition>>();

const createNutritionField = <K extends keyof Partial<Nutrition>>(key: K) =>
  computed({
    get: () => nutrition.value?.[key],
    set: (value: Partial<Nutrition>[K]) => {
      nutrition.value = {
        ...nutrition.value,
        [key]: value,
      };
    },
  });

const calories = createNutritionField('calories');
const sodium = createNutritionField('sodium');
const sugar = createNutritionField('sugar');
const carbs = createNutritionField('carbs');
const fat = createNutritionField('fat');
const protein = createNutritionField('protein');
</script>

<style scoped></style>
