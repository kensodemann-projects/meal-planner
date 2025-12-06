<template>
  <h1>{{ recipe.name }}</h1>

  <div class="mt-4 mb-8 pre-formatted">{{ recipe.description }}</div>

  <div>
    <div><span class="font-weight-black">Difficulty:</span> {{ recipe.difficulty }}</div>
    <div><span class="font-weight-black">Category:</span> {{ recipe.category }}</div>
    <div><span class="font-weight-black">Servings:</span> {{ recipe.servings }}</div>
  </div>

  <hr class="my-4" />

  <h2>Ingredients</h2>

  <hr class="my-4" />

  <h2>Steps</h2>

  <hr class="my-4" />

  <h2>Nutritional Information</h2>

  <hr class="my-4" />
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';

defineProps<{ recipe: Recipe }>();
</script>
