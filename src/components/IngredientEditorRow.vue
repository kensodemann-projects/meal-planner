<template>
  <v-row dense>
    <v-col cols="6" md="1">
      <v-number-input
        density="compact"
        hide-details
        control-variant="hidden"
        :precision="null"
        :rules="[validationRules.required]"
        v-model="units"
        data-testid="units-input"
      ></v-number-input>
    </v-col>
    <v-col cols="6" md="2">
      <v-autocomplete
        density="compact"
        hide-details
        :items="unitsOfMeasure"
        :rules="[validationRules.required]"
        item-title="id"
        item-value="id"
        v-model="unitOfMeasureId"
        data-testid="unit-of-measure-input"
      ></v-autocomplete>
    </v-col>
    <v-col cols="11" md="8">
      <v-text-field
        density="compact"
        label="Ingredient"
        hide-details
        :rules="[validationRules.required]"
        v-model="ingredientName"
        data-testid="ingredient-name-input"
      ></v-text-field>
    </v-col>
    <v-col cols="1" md="1" align-self="center">
      <v-btn
        density="compact"
        variant="plain"
        icon="mdi-delete-forever"
        @click="showConfirmDelete = true"
        data-testid="delete-button"
      ></v-btn>
    </v-col>
  </v-row>
  <v-dialog v-model="showConfirmDelete" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this ingredient?"
      icon-color="error"
      @confirm="
        () => {
          showConfirmDelete = false;
          emit('delete');
        }
      "
      @cancel="() => (showConfirmDelete = false)"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { validationRules } from '@/core/validation-rules';
import { unitsOfMeasure } from '@/data/units-of-measure';
import type { RecipeIngredient } from '@/models/recipe';
import { computed, shallowRef } from 'vue';

const props = defineProps<{
  ingredient: RecipeIngredient;
}>();
const emit = defineEmits<{ (event: 'changed', payload: RecipeIngredient): void; (event: 'delete'): void }>();

const showConfirmDelete = shallowRef(false);

const units = computed({
  get: () => props.ingredient.units,
  set: (units: number) =>
    emit('changed', {
      ...props.ingredient,
      units,
    }),
});

const unitOfMeasureId = computed({
  get: () => props.ingredient.unitOfMeasure.id,
  set: (id: string) => {
    const unitOfMeasure = findUnitOfMeasure(id);
    emit('changed', {
      ...props.ingredient,
      unitOfMeasure,
    });
  },
});

const ingredientName = computed({
  get: () => props.ingredient.name,
  set: (name: string) => {
    emit('changed', {
      ...props.ingredient,
      name,
    });
  },
});
</script>
