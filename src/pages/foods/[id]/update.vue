<template>
  <FoodEditor v-if="food" :food="food" @cancel="onCancel" @save="onSave" />
</template>

<script setup lang="ts">
import FoodEditor from '@/components/FoodEditor.vue';
import { useFoodsData } from '@/data/foods';
import type { FoodItem } from '@/models/food';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const { params } = useRoute();
const id = (params as { id: string }).id;
const food = ref<FoodItem | null>();

const { getFood, updateFood } = useFoodsData();
getFood(id).then((f) => (food.value = f));

const onCancel = () => router.replace(`/foods/${food.value?.id}`);

const onSave = async (item: FoodItem) => {
  await updateFood(item);
  router.replace(`/foods/${item.id}`);
};
</script>
