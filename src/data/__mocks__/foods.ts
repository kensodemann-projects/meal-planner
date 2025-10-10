import { vi } from 'vitest';
import { ref } from 'vue';

const addFood = vi.fn();
const removeFood = vi.fn();
const updateFood = vi.fn();
const foodsCollection = ref([]);

export const useDailyLogsData = vi.fn().mockReturnValue({
  addFood,
  foodsCollection,
  removeFood,
  updateFood,
});
