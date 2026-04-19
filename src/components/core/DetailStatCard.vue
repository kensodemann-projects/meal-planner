<template>
  <v-card>
    <template #append>
      <NutritionalStatusMarker v-if="status" :status="status" />
    </template>
    <v-card-text>
      <div class="d-flex flex-column align-center ga-2">
        <v-icon size="large">{{ icon }}</v-icon>
        <div>
          <span class="font-weight-black">{{ label }}:</span> {{ value }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { NutritionalStatus } from '@/core/nutritional-status';

defineProps<{
  icon: string;
  label: string;
  status?: NutritionalStatus | null;
  value: number | string;
}>();
</script>
