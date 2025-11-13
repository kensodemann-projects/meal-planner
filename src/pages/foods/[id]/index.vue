<template>
  <div v-if="food">
    <h1>Food Details</h1>
    <div>
      <div><span class="font-weight-black">Name:</span> {{ food.name }}</div>
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
import type { FoodItem } from '@/models';
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
