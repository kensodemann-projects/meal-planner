<template>
  <h1>{{ recipe.name }}</h1>

  <div class="mt-4 mb-8 pre-formatted">{{ recipe.description }}</div>

  <div>
    <div><span class="font-weight-black">Difficulty:</span> {{ recipe.difficulty }}</div>
    <div><span class="font-weight-black">Category:</span> {{ recipe.category }}</div>
    <div><span class="font-weight-black">Servings:</span> {{ recipe.servings }}</div>
  </div>

  <hr class="my-4" />

  <section>
    <h2>Ingredients</h2>
    <ul role="list" class="mt-2">
      <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
        {{ ingredient.units }} {{ ingredient.unitOfMeasure.id === 'item' ? '' : ingredient.unitOfMeasure.id }}
        {{ ingredient.name }}
      </li>
    </ul>
  </section>

  <hr class="my-4" />

  <section>
    <h2>Steps</h2>
    <ol class="mt-2">
      <li v-for="step in recipe.steps" :key="step.id">
        {{ step.instruction }}
      </li>
    </ol>
  </section>

  <hr class="my-4" />

  <section>
    <h2>Nutritional Information</h2>
  </section>

  <hr class="my-4" />
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';

defineProps<{ recipe: Recipe }>();
</script>

<style scoped>
ul[role='list'] {
  list-style-type: none;
  padding-left: 1.5rem;
}

ol {
  padding-left: 1.5rem;
}
</style>
