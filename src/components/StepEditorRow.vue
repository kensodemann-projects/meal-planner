<template>
  <v-row dense>
    <v-col cols="11">
      <v-text-field
        density="compact"
        label="Instruction"
        hide-details
        :rules="[validationRules.required]"
        v-model="instruction"
        data-testid="instruction-input"
      ></v-text-field>
    </v-col>
    <v-col cols="1" align-self="center">
      <v-btn
        density="compact"
        variant="plain"
        icon="mdi-delete-forever"
        @click="showConfirmDelete = true"
        data-testid="delete-button"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import type { RecipeStep } from '@/models/recipe';
import { computed, shallowRef } from 'vue';

const props = defineProps<{
  step: RecipeStep;
}>();
const emit = defineEmits<{ (event: 'changed', payload: RecipeStep): void; (event: 'delete'): void }>();

const showConfirmDelete = shallowRef(false);

const instruction = computed({
  get: () => props.step.instruction,
  set: (instruction: string) =>
    emit('changed', {
      ...props.step,
      instruction,
    }),
});
</script>
