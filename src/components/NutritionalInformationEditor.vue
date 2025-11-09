<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <NutritionalInformationEditGrid v-model="editPortion" />
      </v-card-text>
      <v-card-actions>
        <CancelButton />
        <SaveButton :disabled="!(isModified() && valid)" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { type Portion } from '@/models';
import { ref } from 'vue';

const props = defineProps<{ portion?: Portion }>();
const valid = ref(false);
const editPortion = ref(
  props.portion || {
    sodium: 0,
    sugar: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  },
);

const isModified = () => !props.portion;
</script>
