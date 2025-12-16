<template>
  <div class="step-editor-row">
    <div class="step-editor-row__instruction">
      <v-text-field
        density="compact"
        label="Instruction"
        hide-details
        :rules="[validationRules.required]"
        v-model="instruction"
        data-testid="instruction-input"
      ></v-text-field>
    </div>
    <div class="step-editor-row__delete">
      <v-btn
        density="compact"
        variant="plain"
        icon="mdi-delete-forever"
        @click="showConfirmDelete = true"
        data-testid="delete-button"
      ></v-btn>
    </div>
  </div>
  <v-dialog v-model="showConfirmDelete" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this step?"
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

<style scoped>
.step-editor-row {
  --gap: 12px;

  display: flex;
  flex-wrap: nowrap;
  gap: var(--gap);
  align-items: center;
}

.step-editor-row__instruction {
  flex: 1 1 auto;
}

.step-editor-row__delete {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
