<template>
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

  <NutritionEditorRows v-model="portion" />
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { validationRules } from '@/core/validation-rules';
import { unitOfMeasureOptions } from '@/data/unit-of-measure';
import type { Portion } from '@/models/portion';
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

const unitOfMeasureId = computed({
  get: () => portion.value?.unitOfMeasure?.id,
  set: (id: string) =>
    (portion.value = {
      ...portion.value,
      unitOfMeasure: findUnitOfMeasure(id || ''),
    }),
});
</script>
