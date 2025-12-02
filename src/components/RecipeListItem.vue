<template>
  <v-list-item @click="$emit('click', recipe)">
    <v-list-item-title>{{ recipe.name }}</v-list-item-title>
    <v-list-item-subtitle>
      {{ recipe.category }}
    </v-list-item-subtitle>
    {{ recipe.description }}
  </v-list-item>
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';

defineProps<{
  recipe: Recipe;
}>();
</script>
