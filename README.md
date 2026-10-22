# Meal Planner

The meal planner application aims to promote healthier eating habits by making meal planning more convenient. It provides
users with an intelligent, easy to use, assisted planner that helps them to select meals for each day, adhering to
user-defined daily targets for calories, sugars, and protein.

The purpose of this README is to serve as a guidepost as development tasks are created and scheduled.

# Key Goals

- Simplify daily and weekly meal planning.
- Track the daily meal plan against targets.

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

Everything commonly eaten at a meal is modeled as a "recipe." A recipe is either **homemade** or **prepared**.

Recipes saved before the type existed have no stored kind and are treated as homemade.

Every recipe stores:

- Name
- Description
- Category
- Cuisine
- Number of Servings
- Calories
- Sodium (mg)
- Sugar (g)
- Total Carbs (g)
- Fat (g)
- Protein (g)

A homemade recipe is one you assemble yourself, from a simple item such as "Milk" or "Orange" to a full dish. It also stores:

- Difficulty
- Preparation Time
- Cooking Time
- Ingredients list
  - Quantity
  - Unit of Measure
  - Name
- Steps

A prepared recipe is a ready-to-eat item from a meal service, the grocery store, or a restaurant. It requires a source, and it does not ask for difficulty, preparation time, cooking time, ingredients, or steps.

**Calculate Nutrition** fills in the per-serving values:

- A homemade recipe is estimated from its ingredients and steps.
- A named source prefers published per-serving numbers for that source. The source URL is included when the source has one. If published numbers are unavailable, the values are estimated.
- Generic Restaurant asks for a typical restaurant serving of the dish. That estimate does not use the source name or URL, and it does not assume a specific restaurant chain unless the dish name clearly includes one.

## Sources for Recipes

A source identifies where a prepared recipe comes from. Each source stores:

- Name
- Description (optional)
- URL (optional)

Sources are maintained from the sidebar **Recipe Sources** page: the list, an add page, and an update page for each source. A source that is used by a recipe cannot be deleted.

The emulator seed includes a single source, Generic Restaurant (`id` `restaurant`). That source cannot be deleted. Additional sources, such as a meal-delivery service, are created in the app.

## Meals

A meal consists of one or more recipes. For each date, the following meal slots can be populated:

- Breakfast
- Lunch
- Dinner
- Snacks

Meals can be recorded in two ways: entered as-consumed on the day they are eaten, or planned ahead of time for a future date. Because plans don't always survive contact with reality, meals are editable at any time — what was planned can be revised to reflect what was actually eaten.

When adding a recipe to a meal, the nutritional values can be adjusted in one of two ways:

- **By servings** — changing the number of servings scales all nutritional values proportionally from the recipe's defaults.
- **By individual values** — each nutritional item (calories, sodium, sugar, etc.) can be overridden directly for cases where the actual amount differs from what the recipe would calculate.

## Nutritional Targets

Daily nutritional targets are configured in Settings. Any view that displays a nutritional summary for a day uses
color coding to indicate how actual intake compares to those targets:

- 🟡 **Yellow** — under the target range
- 🟢 **Green** — within the target range
- 🔴 **Red** — above the target range

The target range is defined by a configurable tolerance percentage applied symmetrically around each target value.
For example, a 10% tolerance on a 2,000 kcal calorie target means the green range is 1,800–2,200 kcal.

# Navigation

The application is organized into the following main sections, accessible from the sidebar:

## Dashboard

The landing page after login. Displays a summary of the current and upcoming week's meal plans, including stats like total days planned, highest calories, protein, and carbs. Each stat is color coded against the configured daily targets. Previous weeks are also shown for historical reference. Clicking a week card navigates directly to the weekly planning view.

## Planning

Where meal plans are created and managed. The landing page offers quick links to this week and next week, plus recent weeks.

- **Weekly view** — Shows all 7 days at a glance. Each day lists the meal slots that have been filled (Breakfast, Lunch, Dinner, Snacks) along with a color-coded nutritional summary. Items are added and modified from this view.

## Recipes

Browse, search, and manage the recipe library. Recipes can be filtered by category, cuisine, and calorie range. Clicking a recipe shows its full details. New recipes are added from the action button, which first asks whether the recipe is homemade or prepared. Prepared recipes show their source on the summary card and in the recipe detail. The search box also matches the recipe type, so searching for `prepared` or `homemade` narrows the library.

## Settings

Configure app-wide preferences, including:

- Which day the week starts on
- Daily nutritional targets: calorie limit, sugar limit, and protein target
- Tolerance percentage used to define the acceptable range around each target for color coding

Also displays the current app version.

## Recipe Sources

Maintain the sources used by prepared recipes. The page lists every source. New sources are added from the action button, and clicking a source opens it for editing. The seeded Generic Restaurant source cannot be deleted. Any other source that is still used by a recipe cannot be deleted either.
