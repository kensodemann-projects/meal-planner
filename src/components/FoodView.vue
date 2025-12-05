<template>
  <h1>{{ food.name }}</h1>
</template>

<script setup lang="ts">
import type { FoodItem } from '@/models/food';

defineProps<{ food: FoodItem }>();
</script>
