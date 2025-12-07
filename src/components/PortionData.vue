<template>
  <div class="d-flex flex-column ga-1">
    <div>
      <span class="font-weight-black">Serving Size:</span> {{ value.units }} {{ value.unitOfMeasure.name }} ({{
        value.grams
      }}g)
    </div>
    <div><span class="font-weight-black">Calories:</span> {{ value.calories }}</div>
    <div v-if="!compact"><span class="font-weight-black">Sodium:</span> {{ value.sodium }}mg</div>
    <div v-if="!compact"><span class="font-weight-black">Sugar:</span> {{ value.sugar }}g</div>
    <div v-if="!compact"><span class="font-weight-black">Total Carbs:</span> {{ value.carbs }}g</div>
    <div v-if="!compact"><span class="font-weight-black">Fat:</span> {{ value.fat }}g</div>
    <div v-if="!compact"><span class="font-weight-black">Protein:</span> {{ value.protein }}g</div>
  </div>
</template>

<script setup lang="ts">
import type { Portion } from '@/models/portion';

defineProps<{ value: Portion; compact?: boolean }>();
</script>

<style scoped></style>
