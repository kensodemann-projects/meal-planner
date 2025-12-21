import type { FoodItem } from '@/models/food';
import { vi } from 'vitest';
import { ref, type Ref } from 'vue';

interface FoodsData {
  addFood: (food: FoodItem) => Promise<string>;
  foods: Ref<FoodItem[]>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  getFood: (id: string) => Promise<FoodItem | null>;
  removeFood: (id: string) => Promise<void>;
  updateFood: (food: FoodItem) => Promise<void>;
  fdcFoodItemExists: (fdcId: number) => boolean;
}

const addFood = vi.fn();
const fdcFoodItemExists = vi.fn().mockReturnValue(false);
const getFood = vi.fn().mockResolvedValue(null);
const removeFood = vi.fn();
const updateFood = vi.fn();
const foods = ref<FoodItem[]>([]);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useFoodsData: () => FoodsData = vi.fn().mockReturnValue({
  addFood,
  error,
  fdcFoodItemExists,
  foods,
  getFood,
  loading,
  removeFood,
  updateFood,
});
