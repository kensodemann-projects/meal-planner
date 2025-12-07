<template>
  <div v-if="recipe">
    <RecipeView :recipe="recipe" />
    <ViewPageActionButtons
      @close="router.push('/recipes')"
      @modify="router.push(`/recipes/${id}/update`)"
      @delete="showConfirmDialog = true"
    />

    <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
      <ConfirmDialog
        :question="`Are you sure you want to delete ${recipe?.name}?`"
        icon-color="error"
        @confirm="doRemove"
        @cancel="showConfirmDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useRecipesData } from '@/data/recipes';
import { ref } from 'vue';
import type { Recipe } from '@/models/recipe';

const recipe = ref<Recipe | null>(null);
const showConfirmDialog = ref(false);
const router = useRouter();
const { params } = useRoute();
const id = (params as { id: string }).id;

const { getRecipe, removeRecipe } = useRecipesData();
getRecipe(id).then((r) => {
  recipe.value = r;
});

const doRemove = async () => {
  showConfirmDialog.value = false;
  if (recipe.value) {
    await removeRecipe(recipe.value.id!);
  }
  router.replace('/recipes');
};
</script>
