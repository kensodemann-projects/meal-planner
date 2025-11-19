<template>
  <FoodEditor ref="editor" @cancel="onCancel" @save="onSave" />

  <v-snackbar v-model="showMessage" :color="messageColor" :timeout="2000">
    {{ message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import FoodEditor from '@/components/FoodEditor.vue';
import { useFoodsData } from '@/data/foods';
import type { FoodItem } from '@meal-planner/common';
import { ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addFood } = useFoodsData();

const editor = ref<InstanceType<typeof FoodEditor> | null>(null);
const showMessage = shallowRef(false);
const messageColor = shallowRef('success');
const message = shallowRef('');

const onCancel = () => router.replace('/foods');
const onSave = async (f: FoodItem) => {
  try {
    await addFood(f);
    message.value = 'The food has been added to your food list.';
    messageColor.value = 'success';
    showMessage.value = true;
    if (editor.value) {
      editor.value.reset();
    }
  } catch (error) {
    console.error('Failed to add food:', error);
    message.value = 'Failed to add food. Please try again.';
    messageColor.value = 'error';
    showMessage.value = true;
  }
};
</script>

<style scoped></style>
