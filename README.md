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

# TODO: need a name for this section

## Categories

TODO: explain that categories define the type of recipe, list them from @./src/data/recipe-categories.ts combined with @./src/data/food-categories.ts

## Cuisine

TODO: Define cuisines, list them from @./src/data/cuisines.ts

## Unit of measure

TODO: Define units of measure, list them from @./src/data/units-of-measure.ts

## Recipes

TODO: explain the following about recipes:

- all individual items commonly eaten at a meal is a "recipe"
  - traditional recipes (ingredients, steps, etc)
  - food items (for example "milk", or "orange")
- the following information is stored for each recipe:
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

TODO: Explain that meals consist of one or more recipes

TODO: Explain that the following meals can be created for each date:

- Breakfast
- Lunch
- Dinner
- Snacks
