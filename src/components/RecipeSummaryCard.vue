<template>
  <v-card @click="$emit('click', recipe)">
    <v-card-title>{{ recipe.name }}</v-card-title>
    <v-card-subtitle>
      {{ recipe.description }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';

defineProps<{
  recipe: Recipe;
}>();

defineEmits<{
  (event: 'click', payload: Recipe): void;
}>();
</script>
