<template>
  <h1>{{ recipe.name }}</h1>

  <section data-testid="description-section">
    <div class="ma-4 pre-formatted">{{ recipe.description }}</div>
    <div class="d-flex ga-4 mx-4">
      <v-chip color="primary">{{ recipe.cuisine }}</v-chip>
      <v-chip color="secondary">{{ recipe.category }}</v-chip>
    </div>
    <v-container fluid>
      <v-row density="compact">
        <v-col
          v-for="metadataItem in metadataItems"
          :key="metadataItem.label"
          cols="12"
          sm="6"
          :md="isHomemade ? 3 : 6"
        >
          <DetailStatCard :icon="metadataItem.icon" :label="metadataItem.label" :value="metadataItem.value" />
        </v-col>
      </v-row>
    </v-container>
  </section>

  <v-divider v-if="isHomemade" class="my-4" />

  <v-container v-if="isHomemade" fluid>
    <v-row density="compact">
      <v-col cols="12" md="6">
        <section data-testid="ingredients-section">
          <h2>Ingredients</h2>
          <ul class="mt-2">
            <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
              <template v-if="ingredient.unitOfMeasure.id === 'item'">
                {{ ingredient.units }} {{ ingredient.name }}
              </template>
              <template v-else>
                {{ ingredient.units }} {{ ingredient.unitOfMeasure.id }} {{ ingredient.name }}
              </template>
            </li>
          </ul>
        </section>
      </v-col>

      <v-col cols="12" md="6">
        <section data-testid="steps-section">
          <h2>Steps</h2>
          <ol class="mt-2">
            <li v-for="step in recipe.steps" :key="step.id">
              {{ step.instruction }}
            </li>
          </ol>
        </section>
      </v-col>
    </v-row>
  </v-container>

  <v-divider class="my-4" />

  <section data-testid="nutritional-information-section">
    <h2 class="mx-4">Nutritional Information</h2>
    <NutritionData :value="recipe" />
  </section>

  <v-divider class="my-4" />
</template>

<script setup lang="ts">
import { useSourcesData } from '@/data/sources';
import type { Recipe } from '@/models/recipe';
import { computed } from 'vue';

const props = defineProps<{ recipe: Recipe }>();
const { sources } = useSourcesData();

const isHomemade = computed(() => props.recipe.kind !== 'prepared');
const sourceName = computed(() => sources.value.find((s) => s.id === props.recipe.sourceId)?.name || '');

const metadataItems = computed(() =>
  isHomemade.value
    ? [
        { icon: 'mdi-chef-hat', label: 'Difficulty', value: props.recipe.difficulty },
        { icon: 'mdi-account-multiple-outline', label: 'Servings', value: props.recipe.servings },
        { icon: 'mdi-clock-outline', label: 'Prep Time', value: `${props.recipe.prepTimeMinutes} minutes` },
        { icon: 'mdi-timer-outline', label: 'Cook Time', value: `${props.recipe.cookTimeMinutes} minutes` },
      ]
    : [
        { icon: 'mdi-storefront', label: 'Source', value: sourceName.value },
        { icon: 'mdi-account-multiple-outline', label: 'Servings', value: props.recipe.servings },
      ],
);
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
