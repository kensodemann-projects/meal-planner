<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid> </v-container>
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified && valid)" @click="$emit('save')" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const valid = ref(false);
const isModified = ref(false);

defineEmits<{
  (event: 'cancel'): void;
  (event: 'save'): void;
}>();
</script>

<style scoped></style>
