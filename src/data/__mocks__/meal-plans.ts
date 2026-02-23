import type { MealPlan } from '@/models/meal-plan';
import { vi } from 'vitest';
import { ref, type Ref } from 'vue';

interface MealPlansData {
  addMealPlan: (mealPlan: MealPlan) => Promise<string>;
  mealPlans: Ref<MealPlan[]>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  getMealPlan: (id: string) => Promise<MealPlan | null>;
  getMealPlanForDate: (dt: string) => Promise<MealPlan | null>;
  removeMealPlan: (id: string) => Promise<void>;
  updateMealPlan: (id: string, fields: Omit<MealPlan, 'id'>) => Promise<void>;
}

const addMealPlan = vi.fn();
const getMealPlan = vi.fn().mockResolvedValue(null);
const getMealPlanForDate = vi.fn().mockResolvedValue(null);
const removeMealPlan = vi.fn();
const updateMealPlan = vi.fn();
const mealPlans = ref<MealPlan[]>([]);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useMealPlansData: () => MealPlansData = vi.fn().mockReturnValue({
  addMealPlan,
  error,
  mealPlans,
  getMealPlan,
  getMealPlanForDate,
  loading,
  removeMealPlan,
  updateMealPlan,
});
