<template>
  <v-card>
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
defineProps<{
  icon: string;
  label: string;
  value: number | string;
}>();
</script>
