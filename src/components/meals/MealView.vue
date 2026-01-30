<template>
  <v-card>
    <v-card-text>
      <v-list v-if="meal.items.length > 0">
        <v-list-item v-for="item in meal.items" :key="item.id" data-testid="meal-item">
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.nutrition.calories }} calories</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <div v-else class="text-center text-grey" data-testid="empty-meal">No items in this meal</div>
    </v-card-text>
    <v-card-actions>
      <ModifyButton @click="$emit('modify')" />
      <DeleteButton @click="$emit('delete')" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Meal } from '@/models/meal';

defineProps<{
  meal: Meal;
}>();

defineEmits<{
  modify: [];
  delete: [];
}>();
</script>
