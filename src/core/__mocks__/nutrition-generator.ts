import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import type { Source } from '@/models/source';
import { vi } from 'vitest';

const generateNutritionData = vi.fn().mockResolvedValue({
  calories: 0,
  sodium: 0,
  sugar: 0,
  carbs: 0,
  fat: 0,
  protein: 0,
});

export const useNutritionGenerator: () => {
  generateNutritionData: (recipe: Recipe, source?: Source) => Promise<Nutrition>;
} = () => {
  return {
    generateNutritionData,
  };
};
