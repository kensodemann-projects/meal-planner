import { vi } from 'vitest';
import { ref } from 'vue';

const addRecipe = vi.fn();
const getRecipe = vi.fn().mockResolvedValue(null);
const removeRecipe = vi.fn();
const updateRecipe = vi.fn();
const recipes = ref([]);

export const useRecipesData: () => any = vi.fn().mockReturnValue({
  addRecipe,
  recipes,
  getRecipe,
  removeRecipe,
  updateRecipe,
});
