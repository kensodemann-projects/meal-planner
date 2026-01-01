<template>
  <v-list-item :disabled="!food.name" @click="$emit('click', food)">
    <v-list-item-title>{{
      food.name || 'This food item is being created, please check back later.'
    }}</v-list-item-title>
    <v-list-item-subtitle class="d-flex flex-column ga-1">
      <div v-if="food.brand">{{ food.brand }}</div>
      <div v-else>No specific brand</div>
      <div>
        {{ food.category }}
      </div>
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script lang="ts" setup>
import type { FoodItem } from '@/models/food';

defineProps<{
  food: FoodItem;
}>();

defineEmits<{
  (event: 'click', payload: FoodItem): void;
}>();
</script>
