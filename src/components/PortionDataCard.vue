<template>
  <v-card>
    <v-card-text>
      <PortionData :value="value" compact />
    </v-card-text>
    <v-card-actions>
      <ModifyButton @click="$emit('modify')" />
      <DeleteButton @click="showConfirmDelete = true" />
    </v-card-actions>
  </v-card>
  <v-dialog v-model="showConfirmDelete" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this portion?"
      icon-color="error"
      @confirm="
        () => {
          showConfirmDelete = false;
          $emit('delete');
        }
      "
      @cancel="showConfirmDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import type { Portion } from '@/models/food';
import { shallowRef } from 'vue';

defineProps<{ value: Portion }>();
defineEmits(['modify', 'delete']);

const showConfirmDelete = shallowRef(false);
</script>
