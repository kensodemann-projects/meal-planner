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

export interface Recipe {
  id?: string;
  name: string;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
}
