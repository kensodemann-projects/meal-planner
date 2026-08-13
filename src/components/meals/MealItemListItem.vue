<template>
  <div class="d-flex flex-row align-center ga-1 w-100 pl-6">
    <div class="flex-grow-1">{{ mealItem.name }}</div>
    <v-btn
      density="compact"
      variant="text"
      color="primary"
      icon="mdi-pencil"
      data-testid="edit-button"
      @click="$emit('modify', mealItem)"
    ></v-btn>
    <v-btn
      density="compact"
      variant="text"
      color="error"
      icon="mdi-delete"
      data-testid="delete-button"
      @click="$emit('delete', mealItem)"
    ></v-btn>
  </div>
</template>

<script setup lang="ts">
import type { MealItem } from '@/models/meal';

defineEmits<{
  (event: 'modify', value: MealItem): void;
  (event: 'delete', value: MealItem): void;
}>();
defineProps<{ mealItem: MealItem }>();
</script>

<style scoped></style>
