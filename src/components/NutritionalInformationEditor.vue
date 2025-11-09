<template>
  <NutritionalInformationEditGrid v-model="editPortion" />
</template>

<script setup lang="ts">
import { type Portion } from '@/models';
import { ref } from 'vue';

const props = defineProps<{ portion?: Portion }>();
const editPortion = ref(
  props.portion || {
    sodium: 0,
    sugar: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  },
);
</script>
