<template>
  <h1>{{ food.name }}</h1>
  <div>
    <div><span class="font-weight-black">Brand:</span> {{ food.brand || 'No specific brand' }}</div>
    <div><span class="font-weight-black">Category:</span> {{ food.category }}</div>
  </div>

  <hr class="mt-4" />

  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <v-col class="mt-4" cols="12" sm="6" md="4">
        <h2>Standard Portion</h2>
        <PortionData :value="food" />
      </v-col>

      <v-col class="mt-4" cols="12" sm="6" md="4" v-for="(portion, index) in food.alternativePortions" :key="index">
        <h2>Alternative Portion</h2>
        <PortionData :value="portion" />
      </v-col>
    </v-row>
  </v-container>

  <hr class="my-4" />
</template>

<script setup lang="ts">
import type { FoodItem } from '@/models/food';

defineProps<{ food: FoodItem }>();
</script>
