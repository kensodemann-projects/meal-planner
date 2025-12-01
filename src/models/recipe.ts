import type { UnitOfMeasure } from './unit-of-measure';

export type RecipeCategory =
  | 'Appetizer'
  | 'Beverage'
  | 'Breakfast'
  | 'Bread'
  | 'Pasta'
  | 'Beef'
  | 'Pork'
  | 'Lamb'
  | 'Poultry'
  | 'Seafood'
  | 'Vegetarian'
  | 'Side Dish'
  | 'Soup'
  | 'Salad'
  | 'Sauce'
  | 'Dessert';

export type RecipeDifficulty = 'Easy' | 'Normal' | 'Advanced';

export interface RecipeIngredient {
  id: string;
  units: number;
  unitOfMeasure: UnitOfMeasure;
  name: string;
  foodId?: string | null;
}

export interface Recipe {
  id?: string;
  name: string;
  description: string | null;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  servings: number;
  servingSize: number;
  servingSizeUnits: UnitOfMeasure;
  servingGrams: number | null;
  calories: number;
  sodium: number;
  sugar: number;
  totalCarbs: number;
  fat: number;
  protein: number;
  ingredients: RecipeIngredient[];
  steps: string[];
}
