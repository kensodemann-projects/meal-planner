<template>
  <h1>{{ recipe.name }}</h1>

  <section data-testid="description-section">
    <div class="mt-4 mb-8 pre-formatted">{{ recipe.description }}</div>
    <div class="d-flex ga-4">
      <v-chip color="primary">{{ recipe.cuisine }}</v-chip>
      <v-chip color="secondary">{{ recipe.category }}</v-chip>
    </div>
    <v-container fluid dense>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex flex-column align-center ga-2">
                <v-icon large>mdi-chef-hat</v-icon>
                <div><span class="font-weight-black">Difficulty:</span> {{ recipe.difficulty }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex flex-column align-center ga-2">
                <v-icon large>mdi-account-multiple-outline</v-icon>
                <div><span class="font-weight-black">Servings:</span> {{ recipe.servings }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex flex-column align-center ga-2">
                <v-icon large>mdi-clock-outline</v-icon>
                <div><span class="font-weight-black">Prep Time:</span> {{ recipe.prepTimeMinutes }} minutes</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex flex-column align-center ga-2">
                <v-icon large>mdi-timer-outline</v-icon>
                <div><span class="font-weight-black">Cook Time:</span> {{ recipe.cookTimeMinutes }} minutes</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <hr class="my-4" />

  <section data-testid="ingredients-section">
    <h2>Ingredients</h2>
    <ul class="mt-2">
      <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
        <template v-if="ingredient.unitOfMeasure.id === 'item'">
          {{ ingredient.units }} {{ ingredient.name }}
        </template>
        <template v-else> {{ ingredient.units }} {{ ingredient.unitOfMeasure.id }} {{ ingredient.name }} </template>
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
    <NutritionData :value="recipe" />
  </section>

  <hr class="my-4" />
</template>

<script setup lang="ts">
import type { Recipe } from '@/models/recipe';

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
