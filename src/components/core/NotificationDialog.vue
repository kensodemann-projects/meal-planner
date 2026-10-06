<template>
  <v-card>
    <v-card-title data-testid="title">{{ title }}</v-card-title>
    <v-card-text data-testid="body">
      <div class="d-flex ga-4 align-center">
        <div><v-icon :icon="icons[type]" size="64" :color="type" /></div>
        <div>
          {{ message }}
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('confirm')" data-testid="ok-button">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
export type MessageType = 'error' | 'warning' | 'info';

const icons: Record<MessageType, string> = {
  error: 'mdi-alert-circle',
  warning: 'mdi-alert',
  info: 'mdi-information',
};

withDefaults(defineProps<{ message: string; title: string; type?: MessageType }>(), { type: 'info' });
defineEmits(['confirm']);
</script>
