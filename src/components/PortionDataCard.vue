<template>
  <v-card>
    <v-card-text>
      <PortionData :value="value" compact />
    </v-card-text>
    <v-card-actions>
      <ModifyButton @click="$emit('modify')" />
      <DeleteButton @click="$emit('delete')" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Portion } from '@/models/food';

defineProps<{ value: Portion }>();
defineEmits(['modify', 'delete']);
</script>
