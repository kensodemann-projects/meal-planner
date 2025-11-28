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
  ingredients: RecipeIngredient[];
  steps: string[];
}
