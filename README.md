# Meal Planner

The meal planner application aims to promote healthier eating habits by making meal planning more convenient and simplifying
the grocery shopping experience. It will achieve this by providing users with an intelligent, easy to use, assisted planner
that helps them to select meals for each day, adhering to user-defined daily maximums for calories and sugars as well as a
minimum protein requirement. Using the coming week's plan, it will generate a categorized shopping list to help users
ensure they have the ingredients needed for the week's meals.

The purpose of this README is to serve as a guidepost as development tasks are created and scheduled.

# Key Goals

- Simplify daily and weekly meal planning.
- Track the daily meal plan against targets.
- Simplify the process of determining a grocery list.

**Note:** This application is shared by my wife and I without anyone else having intentional access to it. As such,
none of the workflows, settings, plans, or other artifacts created within the application shall apply on a per-user
basis. They are all application wide for all users.

# Core Concepts

## Categories

A category classifies the type of recipe. The following categories are supported:

- Beef, Pork, Lamb, Poultry, Seafood
- Vegetarian, Beans, Produce, Nuts & Seeds
- Bread & Bakery, Grains, Pasta
- Appetizer, Breakfast, Soup, Salad, Side Dish, Sauce
- Dairy, Snack, Dessert, Beverage

## Cuisine

Cuisine identifies the cultural or regional style of a recipe. The following cuisines are supported:

- American, Chinese, French, Greek, Indian, Italian, Japanese
- Mediterranean, Mexican, Middle Eastern, Thai

## Unit of Measure

Units of measure are used to specify ingredient quantities in recipes. The following units are supported:

| Unit    | Name        | Type     | System    |
| ------- | ----------- | -------- | --------- |
| ml      | Milliliter  | Volume   | Metric    |
| l       | Liter       | Volume   | Metric    |
| tsp     | Teaspoon    | Volume   | Customary |
| tbsp    | Tablespoon  | Volume   | Customary |
| floz    | Fluid Ounce | Volume   | Customary |
| cup     | Cup         | Volume   | Customary |
| pint    | Pint        | Volume   | Customary |
| quart   | Quart       | Volume   | Customary |
| gallon  | Gallon      | Volume   | Customary |
| mg      | Milligram   | Weight   | Metric    |
| g       | Gram        | Weight   | Metric    |
| kg      | Kilogram    | Weight   | Metric    |
| oz      | Ounce       | Weight   | Customary |
| lb      | Pound       | Weight   | Customary |
| piece   | Piece       | Quantity | —         |
| item    | Item        | Quantity | —         |
| each    | Each        | Quantity | —         |
| pinch   | Pinch       | Quantity | —         |
| serving | Serving     | Quantity | —         |

## Recipes

Everything commonly eaten at a meal is modeled as a "recipe." This includes both traditional recipes (with ingredients, steps, etc.) and simple food items (e.g., "Milk" or "Orange").

Each recipe stores the following information:

- Name
- Description
- Category
- Cuisine
- Number of Servings
- Cooking Time
- Difficulty
- Ingredients list
  - Quantity
  - Unit of Measure
  - Name
- Steps
- Calories
- Sodium (mg)
- Sugar (g)
- Total Carbs (g)
- Fat (g)
- Protein (g)

## Meals

A meal consists of one or more recipes. For each date, the following meal slots can be populated:

- Breakfast
- Lunch
- Dinner
- Snacks
