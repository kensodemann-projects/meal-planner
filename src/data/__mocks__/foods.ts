import { vi } from 'vitest';
import { ref } from 'vue';

const addFood = vi.fn();
const getFood = vi.fn().mockResolvedValue(null);
const removeFood = vi.fn();
const updateFood = vi.fn();
const foods = ref([]);

export const useFoodsData: () => any = vi.fn().mockReturnValue({
  addFood,
  foods,
  getFood,
  removeFood,
  updateFood,
});
