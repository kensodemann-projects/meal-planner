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
- Allow for cheat days. A "cheat day" shall be defined as ones where minimums in sugar and/or calories are violated or where a meal is not tracked / specified (typically because eating out is planned)
- Simplify the process of determining a grocery list.

**Note:** This application is shared by my wife and I without anyone else having intentional access to it. As such,
none of the workflows, settings, plans, or other artifacts created within the application shall apply on a per-user
basis. They are all application wide for all users.

# User Workflows

## Primary Workflows

These are workflows that are required in order to directly support the specified purpose of the application.

### Specifying Daily Goals

From within the "Settings" area the following values are allowed to be set:

- **Calories**: target maximum for calories per day
- **Sugars**: target maximum in grams for sugars per day
- **Proteins**: target minimum in grams for proteins per day
- **Tolerance**: percentage by which values can exceed their max before this is considered a "cheat"
- **Cheat Days**: the number of allowable cheat days per week
- **Week Start Day**: default to Sunday

Other settings will be added as they are surfaced through the implementation of various goals.

### Planning Meals

#### Definitions

The user can add the following meals:

- Breakfast
- Lunch
- Dinner
- Snacks (multiple snacks can be added)

Each meal consists of at least one recipe or food item.

#### Goals

- Plan meals for the next week
- View existing meal plans
  - Past weeks
  - Current week
  - Next week (the week in planning)
- View what I plan on eating today

#### Decisions

- These are plans not actual results
- Current and future plans can change but past plans are what they are
- Actual meals should be tracked via a dedicated food tracking app at this time

### Creating Shopping Lists

#### Definitions

- A shopping check-list is list of ingredients and food items that will be required for the next week.

#### Goals

- Generate a list of ingredients and food items required for a specified week
  - Default to "this week" if today is in the first two days of the week
  - Default to "next week" otherwise
- Allow the user to check off items that they already have
- Allow the user to check off items as they acquire them
- Allow the user to regenerate the list as needed and at their own discretion

#### Decisions

- An item being on the shopping list means it is needed for the next week's meals and make no assumptions about whether or not it is in the house's inventory (there is no inventory data in this app).
- This is a supplemental list and not a primary list. As such, there is no need to provide edit capabilities.
- If the user regenerates a list, checked items will not be kept.
- Only one list is active at a time, there is no need to store or retrieve previous lists

### Cooking a Meal

#### Definitions

- A meal can consist of multiple recipes and stand-alone food items. For example:
  - Meatloaf (recipe)
  - Mashed Potatoes (recipe)
  - Glass of Milk (stand-alone food item)

#### Goals

- The user has the information that they need in order to prepare the meal

#### Decisions

- For recipes, only display the information required to prepare the meal. That limits the information to:
  - Name
  - Ingredients
  - Steps
- There is no reason at this point to display nutritional information or other ancillary data for recipes or food items.

### Dashboard

#### Definitions

- None at this time

#### Goals

- Display the information that will be most useful to the user right away

#### Decisions

- These are not decisions per se, but should be taken as ideas for potential items:
  - Today's meals (list, link to "today" full page view)
  - This Week at a Glance (day by day calories w/ cheat days noted)
  - Next Week at a Glance (day by day calories w/ cheat days and unplanned days noted)
  - Daily calories trend over X past days plus the future

## Supporting Workflows

These are workflows that are required in order to support the execution of the primary actions.

### Managing Recipes

#### Definitions

- None at this time

#### Goals

- Browse recipes by category in an organized fashion
  - full browse
  - by category
  - by cuisine
  - by calorie ranges (TBD on range definitions)
- Users can perform a keyword search to find a recipe
  - The keyword search should apply to all textual fields
  - The keyword search should apply keywords individually, for example:
    - **Rice** should return foods with "rice" or "Rice" "Rice-a-Roni"
    - **Itanlian Rice** should return foods with "Italian" somewhere in them and "rice" somewhere in them
- Easily add new recipes
  - manually
  - automatically via a search (likely an AI search)

#### Decisions

- Ingredients in the recipe shall not reference food items.
- While perhaps a cool feature for later, the search will not find related words. That is, "rice" will not find recipes that use "risotto" without referencing "rice."

### Managing Food Items

#### Definitions

- None at this time

#### Goals

- Enter commonly consumed food items so they can be added to a meal
- Automatically fill in the data when possible

#### Decisions

- The intention is that these are foods eaten as an item (Milk, Apple), etc.
  r There is nothing to stop a user from entering what would commonly be considered "ingredients" as "food items."
