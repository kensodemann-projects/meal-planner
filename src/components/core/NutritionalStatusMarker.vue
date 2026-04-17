<template>
  <span>
    <v-icon v-if="status === 'in-zone'" icon="mdi-circle" color="success" />
    <v-icon v-if="status === 'low-warn'" icon="mdi-arrow-down-bold" color="warning" />
    <v-icon v-if="status === 'low-danger'" icon="mdi-arrow-down-bold" color="error" />
    <v-icon v-if="status === 'high-warn'" icon="mdi-arrow-up-bold" color="warning" />
    <v-icon v-if="status === 'high-danger'" icon="mdi-arrow-up-bold" color="error" />
  </span>
</template>

<script setup lang="ts">
import { type NutritionalStatus } from '@/core/nutritional-status';

defineProps<{
  status?: NutritionalStatus | null;
}>();
</script>
