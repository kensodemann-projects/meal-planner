<template>
  <RecipeEditor v-if="recipe" :recipe="recipe" @cancel="onCancel" @save="onSave" />
</template>

<script setup lang="ts">
import RecipeEditor from '@/components/RecipeEditor.vue';
import { useRecipesData } from '@/data/recipes';
import type { Recipe } from '@/models/recipe';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const { params } = useRoute();
const id = (params as { id: string }).id;
const recipe = ref<Recipe | null>();

const { getRecipe, updateRecipe } = useRecipesData();
getRecipe(id).then((r) => (recipe.value = r));

const onCancel = () => router.replace(`/recipes/${recipe.value?.id}`);

const onSave = async (item: Recipe) => {
  await updateRecipe(item);
  router.replace(`/recipes/${item.id}`);
};
</script>
