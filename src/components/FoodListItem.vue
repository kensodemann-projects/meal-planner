<template>
  <div class="food-list-item">
    <v-list-item @click="$emit('click', food)">
      <v-list-item-title>{{ food.name }}</v-list-item-title>
      <v-list-item-subtitle class="d-flex flex-column ga-1">
        <div v-if="food.brand">{{ food.brand }}</div>
        <div v-else>No specific brand</div>
        <div>
          {{ food.category }}
        </div>
      </v-list-item-subtitle>
    </v-list-item>
  </div>
</template>

<script lang="ts" setup>
import type { FoodItem } from '@meal-planner/common';

defineProps<{
  food: FoodItem;
}>();

defineEmits<{
  (event: 'click', payload: FoodItem): void;
}>();
</script>
