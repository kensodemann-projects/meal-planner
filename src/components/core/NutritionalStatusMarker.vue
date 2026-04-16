<template>
  <span>
    <span v-if="status === 'green'" role="img" aria-label="Green nutritional status" title="Green nutritional status"
      >🟢</span
    >
    <span v-if="status === 'yellow'" role="img" aria-label="Yellow nutritional status" title="Yellow nutritional status"
      >🟡</span
    >
    <span v-if="status === 'red'" role="img" aria-label="Red nutritional status" title="Red nutritional status"
      >🔴</span
    >
  </span>
</template>

<script setup lang="ts">
import { type NutritionalStatus } from '@/core/nutritional-status';

defineProps<{
  status?: NutritionalStatus | null;
}>();
</script>
