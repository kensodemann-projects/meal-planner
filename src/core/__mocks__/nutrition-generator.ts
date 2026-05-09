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
  generateNutritionData: () => Promise<{
    calories: number;
    sodium: number;
    sugar: number;
    carbs: number;
    fat: number;
    protein: number;
  }>;
} = () => {
  return {
    generateNutritionData,
  };
};
