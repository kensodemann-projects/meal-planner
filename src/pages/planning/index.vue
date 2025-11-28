<template>
  <h2>This is the meal planning page</h2>
  <pre>{{ text }}</pre>
</template>

<script lang="ts" setup>
import { useRecipeGenerator } from '@/core/recipe-generator';
import { ref } from 'vue';

const text = ref('Working...');

const { generate } = useRecipeGenerator();

generate()
  .then((x) => (text.value = x))
  .catch((error) => {
    console.error('Recipe generation failed:', error);
    text.value = 'Error generating recipe. Please try again.';
  });
</script>
