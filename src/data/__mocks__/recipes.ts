import type { Recipe } from '@/models/recipe';
import { vi } from 'vitest';
import type { Ref } from 'vue';
import { ref } from 'vue';

interface RecipesData {
  addRecipe: (recipe: Recipe) => Promise<string>;
  recipes: Ref<Recipe[]>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  getRecipe: (id: string) => Promise<Recipe | null>;
  removeRecipe: (id: string) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
}

const addRecipe = vi.fn();
const getRecipe = vi.fn().mockResolvedValue(null);
const removeRecipe = vi.fn();
const updateRecipe = vi.fn();
const recipes = ref<Recipe[]>([]);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useRecipesData: () => RecipesData = vi.fn().mockReturnValue({
  addRecipe,
  error,
  getRecipe,
  loading,
  recipes,
  removeRecipe,
  updateRecipe,
});
