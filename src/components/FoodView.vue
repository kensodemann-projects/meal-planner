<template>
  <h1>{{ food.name }}</h1>
  <div>
    <div><span class="font-weight-black">Brand:</span> {{ food.brand || 'No specific brand' }}</div>
    <div><span class="font-weight-black">Category:</span> {{ food.category }}</div>
  </div>
</template>

<script setup lang="ts">
import type { FoodItem } from '@/models/food';

defineProps<{ food: FoodItem }>();
</script>
