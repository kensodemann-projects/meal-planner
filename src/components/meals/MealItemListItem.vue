<template>
  <div class="d-flex flex-row align-center ga-1 w-100">
    <div class="flex-grow-1 text-truncate">
      {{ mealItem.name }}
    </div>
    <div data-testid="nutrition-data">
      <v-icon icon="mdi-format-list-bulleted" />
      <v-tooltip activator="parent" location="bottom" width="350">
        <NutritionData :value="mealItem.nutrition" />
      </v-tooltip>
    </div>
    <v-btn
      density="compact"
      variant="text"
      color="primary"
      icon="mdi-pencil"
      data-testid="modify-button"
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
