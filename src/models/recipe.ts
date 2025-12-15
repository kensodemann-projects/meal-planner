import type { Portion } from './portion';
import type { UnitOfMeasure } from './unit-of-measure';

export type Cuisine =
  | 'American'
  | 'Chinese'
  | 'French'
  | 'Greek'
  | 'Indian'
  | 'Italian'
  | 'Japanese'
  | 'Mediterranean'
  | 'Mexican'
  | 'Middle Eastern'
  | 'Thai';

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
}

export interface RecipeStep {
  id: string;
  instruction: string;
}

export interface Recipe extends Portion {
  id?: string;
  name: string;
  description: string | null;
  category: RecipeCategory;
  cuisine: Cuisine;
  difficulty: RecipeDifficulty;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}
