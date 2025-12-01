import type { FoodItem } from '@/models/food';
import { vi } from 'vitest';
import { ref } from 'vue';

const addFood = vi.fn();
const fdcFoodItemExists = vi.fn().mockReturnValue(false);
const getFood = vi.fn().mockResolvedValue(null);
const removeFood = vi.fn();
const updateFood = vi.fn();
const foods = ref<FoodItem[]>([]);

export const useFoodsData: () => any = vi.fn().mockReturnValue({
  addFood,
  fdcFoodItemExists,
  foods,
  getFood,
  removeFood,
  updateFood,
});
