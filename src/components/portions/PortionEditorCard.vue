<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <PortionEditorRows v-model="editPortion" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified && valid)" @click="$emit('save', editPortion as Portion)" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import type { Portion } from '@/models/portion';
import { computed, ref } from 'vue';

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

const isModified = computed(() => {
  if (!props.portion) return true;
  const fields: (keyof Portion)[] = ['units', 'grams', 'calories', 'sodium', 'sugar', 'carbs', 'fat', 'protein'];
  if (editPortion.value.unitOfMeasure?.id !== props.portion.unitOfMeasure.id) {
    return true;
  }
  return fields.some((field) => editPortion.value[field] !== props.portion![field]);
});
</script>
