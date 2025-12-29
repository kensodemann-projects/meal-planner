<template>
  <div class="d-flex flex-column ga-1">
    <div><span class="font-weight-black">Calories:</span> {{ value.calories }}</div>
    <div><span class="font-weight-black">Sodium:</span> {{ value.sodium }}mg</div>
    <div><span class="font-weight-black">Sugar:</span> {{ value.sugar }}g</div>
    <div><span class="font-weight-black">Total Carbs:</span> {{ value.carbs }}g</div>
    <div><span class="font-weight-black">Fat:</span> {{ value.fat }}g</div>
    <div><span class="font-weight-black">Protein:</span> {{ value.protein }}g</div>
  </div>
</template>

<script setup lang="ts">
import type { Nutrition } from '@/models/nutrition';

defineProps<{ value: Nutrition }>();
</script>

<style scoped></style>
