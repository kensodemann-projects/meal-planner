In @src/data/**tests**/test-data.ts, several `TEST_MEAL_PLAN` objects have `items` values that look like this:

```
          {
            id: 'item-1-1-1',
            name: 'Rolled Oats',
            recipeId: 'food-test-1',
            units: 1,
            unitOfMeasure: { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
            nutrition: {
              calories: 300,
              sodium: 100,
              fat: 6,
              protein: 10,
              carbs: 54,
              sugar: 2,
            },
          },

```

The items I am concerned with will all have a `recipeId` in the form of "food-test-X" where "X" is an integer value of 1 or greater

These used to be food items, and they will now be represented by a "recipe"

I need you to create distinct objects in `TEST_RECIPES` for them following these rules:

1. They will be single ingredient recipes with no steps.
2. The single ingredient will be the name ("Rolled Oats" in this case)
3. Use the first item of any given name as the model and change the `recipeId` in subsequent entries. That is, if two meals have "Rolled Oats" but use different `recipeId` values, create the recipe based on the first meal and change the second meal's `recipeId` for the "Rolled Oats"
4. The `servings` is always 1.
5. `prepTimeMinutes` and `cookTimeMinutes` are always 0
6. Choose a `cuisine` and `category` from @src/models/recipe.ts. Default to "American" if the food is not specific to a cuisine.
7. If you can find a commonly specified number of units and unit of measure, specify it in the ingredients. Otherwise use "100 grams"
8. Generate a unique GUID for the `id` of the `ingredient`

As an example, for the previously shared meal item, the recipe to create looks like this:

```
  {
    id: '1',
    name: 'Rolled Oats',
    description: 'Rolled Oats'
    category: 'Grain',
    cuisine: 'American',
    difficulty: 'Normal',
    servings: 1,
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    calories: 300,
    sodium: 100,
    sugar: 2,
    carbs: 54,
    fat: 6,
    protein: 10,
    ingredients: [
      {
        id: '5967bf30-dc15-463a-97a3-aa43bb411c59',
        units: 0.5,
        unitOfMeasure: findUnitOfMeasure('cup'),
        name: 'Spaghetti',
      }
    ],
    steps: [
    ],
  },

```
