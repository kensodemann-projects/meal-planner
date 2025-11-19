<template>
  <FoodEditor @cancel="onCancel" @save="onSave" />
</template>

<script setup lang="ts">
import FoodEditor from '@/components/FoodEditor.vue';
import { useFoodsData } from '@/data/foods';
import type { FoodItem } from '@meal-planner/common';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addFood } = useFoodsData();

const onCancel = () => router.replace('/foods');
const onSave = async (f: FoodItem) => {
  try {
    await addFood(f);
  } catch (error) {
    // Handle error - show message to user
    console.error('Failed to add food:', error);
  }
};
</script>

<style scoped></style>
