<template>
  <span>
    <span v-if="status === 'green'">🟢</span>
    <span v-if="status === 'yellow'">🟡</span>
    <span v-if="status === 'red'">🔴</span>
  </span>
</template>

<script setup lang="ts">
import { type NutritionalStatus } from '@/core/nutritional-status';

defineProps<{
  status?: NutritionalStatus | null;
}>();
</script>

<style scoped></style>
