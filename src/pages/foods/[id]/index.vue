<template>
  <div v-if="food">
    <FoodView :food="food" />

    <div class="page-actions mt-4">
      <CloseButton @click="router.push('/foods')" />
      <ModifyButton class="ml-8" @click="router?.push(`/foods/${id}/update`)" />
      <DeleteButton class="ml-8" @click="showConfirmDialog = true" />
    </div>

    <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
      <ConfirmDialog
        :question="`Are you sure you want to delete ${food.name}?`"
        icon-color="error"
        @confirm="doRemove"
        @cancel="showConfirmDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useFoodsData } from '@/data/foods';
import type { FoodItem } from '@/models/food';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { params } = useRoute();
const router = useRouter();
const id = (params as { id: string }).id;
const food = ref<FoodItem | null>();
const showConfirmDialog = ref(false);

const { getFood, removeFood } = useFoodsData();
getFood(id).then((f) => (food.value = f));

const doRemove = async () => {
  showConfirmDialog.value = false;
  if (food.value) {
    await removeFood(food.value.id!);
  }
  router.replace('/foods');
};
</script>
