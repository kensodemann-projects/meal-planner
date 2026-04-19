<template>
  <v-card>
    <template #append>
      <NutritionalStatusMarker
        v-if="status != null"
        :status="status"
      />
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
  status?: NutritionalStatus;
  value: number | string;
}>();
</script>
