<template>
  <h1>{{ recipe.name }}</h1>
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';

defineProps<{ recipe: Recipe }>();
</script>
