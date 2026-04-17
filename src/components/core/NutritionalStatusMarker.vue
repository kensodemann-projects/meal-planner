<template>
  <span>
    <v-icon
      v-if="status === 'in-zone'"
      icon="mdi-circle"
      color="success"
      aria-label="In zone"
      title="In zone"
    />
    <v-icon
      v-if="status === 'low-warn'"
      icon="mdi-arrow-down-bold"
      color="warning"
      aria-label="Low warning"
      title="Low warning"
    />
    <v-icon
      v-if="status === 'low-danger'"
      icon="mdi-arrow-down-bold"
      color="error"
      aria-label="Low danger"
      title="Low danger"
    />
    <v-icon
      v-if="status === 'high-warn'"
      icon="mdi-arrow-up-bold"
      color="warning"
      aria-label="High warning"
      title="High warning"
    />
    <v-icon
      v-if="status === 'high-danger'"
      icon="mdi-arrow-up-bold"
      color="error"
      aria-label="High danger"
      title="High danger"
    />
  </span>
</template>

<script setup lang="ts">
import { type NutritionalStatus } from '@/core/nutritional-status';

defineProps<{
  status?: NutritionalStatus | null;
}>();
</script>
