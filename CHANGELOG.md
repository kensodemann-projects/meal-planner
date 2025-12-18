# meal-planner

## 0.5.1

### Patch Changes

- daab3e3: Make the ingredients and steps sortable
- 3b0cd51: add cuisines to recipes
- 45589cf: remove foodId from RecipeIngredient - make ingredients text-only

## 0.5.0

### Minor Changes

- a381032: view a recipe
- ed9135e: list the recipes on the recipes page
- 5fa171e: add the recipe data service

### Patch Changes

- 51773ce: add the update route for recipes
- 16ca557: add a list of ingredients to the recipe editor
- 55b5082: add testing around the deletion of a food item
- 8cf25c7: add a description text area to the recipe editor
- 55b5082: move the confirmation code into the portion component to make the logic cleaner and more self-contained
- 10c033c: Improve food editor user experience by disabling save/cancel buttons during alternative portion editing and adding confirmation dialog when discarding unsaved changes to existing food items
- e8c030e: move repetitive tests for components into a test-utils file
- f552893: add nutritional information to the recipe editor
- 826158c: add the recipe add page
- c6b04a1: remove unused portion of addFood signature
- e56ae8d: add experiment with AI
- 6eaf2a9: allow the entry of recipe steps

## 0.4.0

### Minor Changes

- 94bd9d9: revert to a single project without Firebase functions
- 8462cf1: add the ability to edit recipes

## 0.3.0

### Minor Changes

- cd2b845: push food items out with just the FDC ID and expand them in the background

### Patch Changes

- fa8e7df: fix the food categories based on the USDA FDC data sheet
- Updated dependencies [cd2b845]
  - @meal-planner/common@1.1.0

## 0.2.0

### Minor Changes

- 12a9cbb: add the portion editor
- 837850c: display existing alternative portions in the food editor
- b178c54: allow the user to make changes to a food item
- 85cfa48: create the food item editor component
- 5f3dd22: create the food item view page
- f5d309c: perform the delete of a portion
- f08ef67: implement the add food item via search functionality
- f3c06c1: create a route to manually add a food item
- 053c1b2: add unit conversion utilities
- 90c3adf: allow alternative portions to be modified
- 1552495: add foods list page
- 5f3a281: create the workflow to add a new alternative portion

### Patch Changes

- 058e83e: add compact mode to the nutrition information component
- 950d6bb: add recipe categories
- 1a53fb2: fix the scrolling for the desktop layout

## 0.1.0

### Minor Changes

- d13376b: add the full authentication flow
- e21b7a1: add firebase app and hosting
