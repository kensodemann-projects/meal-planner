import type { Recipe } from '@/models/recipe';
import { vi } from 'vitest';
import type { Ref } from 'vue';
import { ref } from 'vue';

interface RecipesData {
  addRecipe: (recipe: Recipe) => Promise<string>;
  recipes: Ref<Recipe[]>;
  getRecipe: (id: string) => Promise<Recipe | null>;
  removeRecipe: (id: string) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
}

const addRecipe = vi.fn();
const getRecipe = vi.fn().mockResolvedValue(null);
const removeRecipe = vi.fn();
const updateRecipe = vi.fn();
const recipes = ref<Recipe[]>([]);

export const useRecipesData: () => RecipesData = vi.fn().mockReturnValue({
  addRecipe,
  recipes,
  getRecipe,
  removeRecipe,
  updateRecipe,
});
