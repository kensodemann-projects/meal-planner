<template>
  <span>
    <span v-if="status === 'in-zone'" role="img" aria-label="Green nutritional status" title="Green nutritional status"
      >🟢</span
    >
    <span
      v-if="status === 'high-warn' || status === 'low-warn'"
      role="img"
      aria-label="Yellow nutritional status"
      title="Yellow nutritional status"
      >🟡</span
    >
    <span
      v-if="status === 'high-danger' || status === 'low-danger'"
      role="img"
      aria-label="Red nutritional status"
      title="Red nutritional status"
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
