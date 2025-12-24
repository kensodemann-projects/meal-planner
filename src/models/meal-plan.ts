import type { Meal } from './meal';

export interface MealPlan {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  meals: Meal[]; // Array of Meal IDs
}
