<template>
  <div>
    <h1 class="text-center">My Foods</h1>
    <v-list>
      <food-list-item v-for="food in foods" :key="food.fdcId" :food="food as FoodItem" />
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { type FoodItem } from '@/models';
import { useFoodsData } from '@/data/foods';

const { foods } = useFoodsData();
</script>
