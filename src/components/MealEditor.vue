<template>
  <div>This is the meal editor</div>

  <v-container fluid>
    <v-row class="pa-4" justify="end">
      <CancelButton class="mr-4" @click="$emit('cancel')" />
      <SaveButton :disabled="!(valid && isModified)" @click="save" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Meal } from '@/models/meal';
import { computed, ref } from 'vue';

const emit = defineEmits<{ (event: 'save', payload: Meal): void; (event: 'cancel'): void }>();
const props = defineProps<{ meal?: Meal }>();

const valid = ref(false);

const isModified = computed((): boolean => false);

const save = () => {
  const mealToSave: Meal = {
    // Populate meal data
  };
  emit('save', mealToSave);
};
</script>

<style scoped></style>
