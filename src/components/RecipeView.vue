<template>
  <h1>{{ recipe.name }}</h1>

  <section data-testid="description-section">
    <div class="mt-4 mb-8 pre-formatted">{{ recipe.description }}</div>
    <div>
      <div><span class="font-weight-black">Difficulty:</span> {{ recipe.difficulty }}</div>
      <div><span class="font-weight-black">Category:</span> {{ recipe.category }}</div>
      <div><span class="font-weight-black">Servings:</span> {{ recipe.servings }}</div>
    </div>
  </section>

  <hr class="my-4" />

  <section data-testid="ingredients-section">
    <h2>Ingredients</h2>
    <ul role="list" class="mt-2">
      <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
        {{ ingredient.units }} {{ ingredient.unitOfMeasure.id === 'item' ? '' : ingredient.unitOfMeasure.id }}
        {{ ingredient.name }}
      </li>
    </ul>
  </section>

  <hr class="my-4" />

  <section data-testid="steps-section">
    <h2>Steps</h2>
    <ol class="mt-2">
      <li v-for="step in recipe.steps" :key="step.id">
        {{ step.instruction }}
      </li>
    </ol>
  </section>

  <hr class="my-4" />

  <section data-testid="nutritional-information-section">
    <h2>Nutritional Information</h2>
    <PortionData :value="recipe" />
  </section>

  <hr class="my-4" />
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';
import PortionData from './PortionData.vue';

defineProps<{ recipe: Recipe }>();
</script>

<style scoped>
ul {
  list-style-type: square;
  padding-left: 1rem;
}

ol {
  padding-left: 1rem;
}
</style>
