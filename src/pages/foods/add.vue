<template>
  <FoodEditor @cancel="onCancel" @save="onSave" />
</template>

<script setup lang="ts">
import FoodEditor from '@/components/FoodEditor.vue';
import { useFoodsData } from '@/data/foods';
import type { FoodItem } from '@/models';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addFood } = useFoodsData();

const onCancel = () => router.replace('/foods/search-and-add');
const onSave = async (f: FoodItem) => {
  await addFood(f);
  router.replace('/foods');
};
</script>

<style scoped></style>
