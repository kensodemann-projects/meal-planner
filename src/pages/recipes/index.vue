<template>
  <h2>This is the recipe list page</h2>
  <v-container fluid>
    <IngredientEditorRow :foods="foods" v-model="i1" />
    <IngredientEditorRow :foods="foods" v-model="i2" />
    <IngredientEditorRow :foods="foods" v-model="i3" />
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
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { useFoodsData } from '@/data/foods';
import type { RecipeIngredient } from '@/models/recipe';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const i1 = ref<RecipeIngredient>({ units: 8, unitOfMeasure: findUnitOfMeasure('oz'), name: 'Large Sea Scallops' });
const i2 = ref<RecipeIngredient>({
  units: 2.5,
  unitOfMeasure: findUnitOfMeasure('tbsp'),
  name: 'Something Bogus',
  foodId: 'FG9je9i8bfvYmL0PJzCR',
});
const i3 = ref<RecipeIngredient>({ units: 0.25, unitOfMeasure: findUnitOfMeasure('tbsp'), name: 'Olive Oil' });

watch(i2, (x) => console.log(x));

const { foods } = useFoodsData();
</script>
