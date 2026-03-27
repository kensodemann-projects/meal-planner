<template>
  <v-form v-model="valid">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <MealItemEditorRows v-model="editMealItem" :items="items" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <CancelButton @click="$emit('cancel')" />
        <SaveButton :disabled="!(isModified && valid)" @click="$emit('save', editMealItem as MealItem)" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import type { MealItem } from '@/models/meal';
import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import { computed, ref } from 'vue';

const props = defineProps<{
  mealItem: Partial<MealItem>;
  items: Recipe[];
}>();

defineEmits<{
  (e: 'save', value: MealItem): void;
  (e: 'cancel'): void;
}>();

const editMealItem = ref<Partial<MealItem>>(
  props.mealItem.id
    ? props.mealItem
    : {
        id: globalThis.crypto.randomUUID(),
        servings: 1,
      },
);
const valid = ref(false);

const isModified = computed(() => {
  if (!props.mealItem) return true;
  const fields: (keyof Nutrition)[] = ['calories', 'sodium', 'sugar', 'carbs', 'fat', 'protein'];
  if (
    editMealItem.value.recipeId !== props.mealItem?.recipeId ||
    editMealItem.value.servings !== props.mealItem?.servings
  ) {
    return true;
  }
  return fields.some((field) => editMealItem.value.nutrition?.[field] !== props.mealItem?.nutrition?.[field]);
});
</script>

<style scoped></style>
