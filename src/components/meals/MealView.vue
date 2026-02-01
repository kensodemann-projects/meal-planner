<template>
  <v-card>
    <v-card-text>
      <v-list v-if="meal.items.length > 0" density="compact">
        <v-list-item v-for="item in meal.items" :key="item.id" data-testid="meal-item">
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div v-else class="text-center text-grey" data-testid="empty-meal">No items in this meal</div>

      <v-divider v-if="meal.items.length > 0" class="my-3" />

      <NutritionData v-if="meal.items.length > 0" :value="totalNutrition" />
    </v-card-text>
    <v-card-actions>
      <ModifyButton @click="$emit('modify')" />
      <DeleteButton @click="$emit('delete')" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Meal } from '@/models/meal';
import { computed } from 'vue';

const props = defineProps<{
  meal: Meal;
}>();

defineEmits<{
  modify: [];
  delete: [];
}>();

const totalNutrition = computed(() => {
  return props.meal.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      carbs: acc.carbs + item.nutrition.carbs,
      fat: acc.fat + item.nutrition.fat,
      sodium: acc.sodium + item.nutrition.sodium,
      sugar: acc.sugar + item.nutrition.sugar,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, sugar: 0 },
  );
});
</script>
