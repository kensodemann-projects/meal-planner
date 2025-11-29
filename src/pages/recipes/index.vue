<template>
  <h2>This is the recipe list page</h2>
  <v-container fluid>
    <IngredientEditorRow :foods="foods" />
    <IngredientEditorRow :foods="foods" />
    <IngredientEditorRow :foods="foods" />
    <IngredientEditorRow :foods="foods" />
    <IngredientEditorRow :foods="foods" />
  </v-container>

  <v-fab
    color="primary"
    icon="mdi-plus"
    variant="tonal"
    location="bottom end"
    absolute
    @click="router.push('recipes/add')"
    data-testid="add-button"
  ></v-fab>
</template>

<script lang="ts" setup>
import IngredientEditorRow from '@/components/IngredientEditorRow.vue';
import { useFoodsData } from '@/data/foods';
import { useRouter } from 'vue-router';

const router = useRouter();

const { foods } = useFoodsData();
</script>
