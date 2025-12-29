<template>
  <v-card @click="$emit('click', recipe)">
    <v-card-title>{{ recipe.name }}</v-card-title>
    <v-card-subtitle>
      {{ recipe.category }}
    </v-card-subtitle>
    <v-card-text>
      <div>
        <v-chip size="small" color="primary">{{ recipe.cuisine }}</v-chip>
        <v-chip size="small" color="secondary">{{ recipe.difficulty }}</v-chip>
      </div>
      <div class="my-4">{{ recipe.description }}</div>
      <div>
        <v-chip size="small" color="primary" prepend-icon="mdi-account-multiple-outline">{{ recipe.servings }}</v-chip>
        <v-chip size="small" color="secondary" prepend-icon="mdi-clock-time-four-outline">{{
          recipe.prepTimeMinutes + recipe.cookTimeMinutes
        }}</v-chip>
        <v-chip size="small" color="tertiary" prepend-icon="mdi-fire">{{ recipe.calories }} kcal</v-chip>
      </div>
    </v-card-text>
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

<style scoped>
.v-chip {
  margin-right: 4px;
  border-radius: 14px;
}

.v-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  height: 100%;
}
</style>
