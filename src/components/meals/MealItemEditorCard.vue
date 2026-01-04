<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <MealItemEditorRows v-model="editMealItem" :type="type" :values="[]" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified && valid)" @click="$emit('save', editMealItem as MealItem)" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import type { MealItem } from '@/models/meal';
import { computed, ref } from 'vue';

const props = defineProps<{
  item?: Partial<MealItem>;
  type: 'food' | 'recipe';
}>();

const editMealItem = ref<Partial<MealItem>>(
  props.item || {
    units: props.type === 'recipe' ? 1 : undefined,
    unitOfMeasure: props.type === 'recipe' ? findUnitOfMeasure('serving') : undefined,
  },
);
const valid = ref(false);

const isModified = computed(() => false);
</script>

<style scoped></style>
