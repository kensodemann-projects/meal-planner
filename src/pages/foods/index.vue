<template>
  <div>
    <h1 class="text-center">My Foods</h1>
    <v-list>
      <food-list-item v-for="food in foods" :key="food.fdcId" :food="food as FoodItem" @click="viewFoodItem" />
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { type FoodItem } from '@/models';
import { useFoodsData } from '@/data/foods';
import { useRouter } from 'vue-router';

const { foods } = useFoodsData();
const router = useRouter();

const viewFoodItem = (food: FoodItem) => router.push(`foods/${food.id}`);
</script>
