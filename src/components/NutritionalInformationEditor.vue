<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <NutritionalInformationEditGrid v-model="editPortion" />
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified() && valid)" @click="$emit('save', editPortion as Portion)" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { type Portion } from '@/models';
import { ref } from 'vue';

const props = defineProps<{ portion?: Portion }>();
defineEmits<{ (event: 'save', payload: Portion): void; (event: 'cancel'): void }>();
const valid = ref(false);
const editPortion = ref<Partial<Portion>>(
  props.portion || {
    sodium: 0,
    sugar: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  },
);

const isModified = () =>
  !props.portion ||
  editPortion.value.units !== props.portion.units ||
  editPortion.value.unitOfMeasure?.id !== props.portion.unitOfMeasure.id ||
  editPortion.value.grams !== props.portion.grams ||
  editPortion.value.calories !== props.portion.calories ||
  editPortion.value.sodium !== props.portion.sodium ||
  editPortion.value.sugar !== props.portion.sugar ||
  editPortion.value.carbs !== props.portion.carbs ||
  editPortion.value.fat !== props.portion.fat ||
  editPortion.value.protein !== props.portion.protein;
</script>
