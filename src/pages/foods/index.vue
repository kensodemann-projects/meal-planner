<template>
  <div>
    <h1 class="text-center">My Foods</h1>
    <v-list>
      <food-list-item v-for="food in foods" :key="food.id" :food="food as FoodItem" @click="viewFoodItem" />
    </v-list>
    <v-fab color="primary" size="48" variant="flat" location="bottom end" absolute>
      <v-icon>{{ open ? 'mdi-close' : 'mdi-plus' }}</v-icon>
      <v-speed-dial v-model="open" location="top center" transition="fade-transition" activator="parent">
        <v-btn key="1" color="secondary" variant="tonal" @click="router.push('foods/search-and-add')" icon>
          <v-icon size="24">mdi-magnify-plus-outline</v-icon>
        </v-btn>

        <v-btn key="2" color="secondary" variant="tonal" @click="router.push('foods/add')" icon>
          <v-icon size="24">mdi-pencil-plus</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-fab>
  </div>
</template>

<script lang="ts" setup>
import { useFoodsData } from '@/data/foods';
import { useRouter } from 'vue-router';
import { shallowRef } from 'vue';
import type { FoodItem } from '@/models/food';

const { foods } = useFoodsData();
const router = useRouter();

const viewFoodItem = (food: FoodItem) => router.push(`foods/${food.id}`);
const open = shallowRef(false);
</script>
