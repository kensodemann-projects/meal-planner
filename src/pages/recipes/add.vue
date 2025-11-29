<template>
  <RecipeEditor @cancel="router.replace('/recipes')" @save="saveRecipe" />
</template>

<script setup lang="ts">
import RecipeEditor from '@/components/RecipeEditor.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const saveRecipe = () => {
  router.replace('/recipes');
};
</script>
