<template>
  <RecipeEditor @cancel="router.replace('/recipes')" />
</template>

<script setup lang="ts">
import RecipeEditor from '@/components/RecipeEditor.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
