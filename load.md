# Load the homemade recipes into Recipe_CS

The entities are already in the `Recipe_CS` module. Load the five recipes in `recipes.txt` into `Recipe`, `RecipeIngredient`, and `RecipeStep` there. Work in OutSystems 11 through the Service Studio MCP server, with `Recipe_CS` open in Service Studio. Follow the OutSystems skill for O11, and read the live tool list before the first change. Tool names can change between releases.

## Platform facts to rely on

- An OutSystems 11 application is built in Service Studio from modules. Publishing a module creates or updates the database tables for its entities. See [Getting started](https://success.outsystems.com/documentation/11/getting_started/).
- `Recipe`, `RecipeIngredient`, and `RecipeStep` are in `Recipe_CS`, along with the static entities `RecipeKind`, `RecipeDifficulty`, `RecipeCategory`, `Cuisine`, and `UnitOfMeasure`. The Architecture Canvas keeps that data in this core module. Load the rows there. See [The Architecture Canvas](https://success.outsystems.com/documentation/11/app_architecture/designing_the_architecture_of_your_outsystems_applications/the_architecture_canvas/).
- A database table is an entity. Records that change at runtime belong in an entity, which supports create, read, update, and delete. A static entity is a fixed set of named values, and its only action is Get. Recipes, ingredients, and steps are entities. Kind, difficulty, category, cuisine, and unit of measure are static entities. See [Entities](https://success.outsystems.com/documentation/11/building_apps/data_management/data_modeling/entities/) and [Static Entities](https://success.outsystems.com/documentation/11/building_apps/data_management/data_modeling/static_entities/).
- The Service Studio MCP server reads and changes the module open in Service Studio. It does not insert database rows by itself. A timer whose Schedule is `When Published` runs after each 1-Click Publish, which is how a module bootstraps entity data. See [OutSystems MCP](https://success.outsystems.com/documentation/11/outsystems_mcp/), [OutSystems MCP capabilities](https://success.outsystems.com/documentation/11/outsystems_mcp/outsystems_mcp_capabilities/), and [Create and Run Timers](https://success.outsystems.com/documentation/11/building_apps/using_timers/create_and_run_timers/).
- Reads of the open module are generally available. Writes are a Beta Feature. The first time you change the module, tell the user that write capabilities are a Beta Feature and share https://www.outsystems.com/legal/beta-features-agreement.
- The default write permission sends the change to the Compare and Merge window. Leave it there. Do not publish, and do not turn on automatic merge and publish. See [Get started with OutSystems MCP](https://success.outsystems.com/documentation/11/outsystems_mcp/get_started_with_outsystems_mcp/).

## Before you change the module

1. Service Studio 11.55.91 or later must be open, with the Service Studio MCP server running, and `Recipe_CS` must be the open module. The entities are in that module. If another module is open, stop and say so. See [Understand a module](https://success.outsystems.com/documentation/11/outsystems_mcp/understand_a_module/).
2. Read `Recipe_CS`. Use the entities and static entities already there. Do not create them, and do not look for them in another module.
3. Read `Recipe_Create` if it exists, and read any bootstrap timer already in `Recipe_CS`. Match that pattern.
4. Read the static-entity records and use their real identifiers. A static record is referenced as `Entities.<StaticEntity>.<RecordIdentifier>`. Match category, cuisine, and difficulty by the label in `recipes.txt`. Match each unit of measure by its Label. The file uses the label (Pound, Cup, Item), not the code (lb, cup, item).

## What to add

Add both of these to `Recipe_CS` only:

- A public server action, `Bootstrap_HomemadeRecipes`, that inserts the five recipes.
- A timer with the same name whose Schedule is `When Published`, and whose action is that server action.

`Recipe`, `RecipeIngredient`, and `RecipeStep` are exposed read-only, so other modules cannot create their rows. Create the rows inside `Recipe_CS`. Call `Recipe_Create` when that action already exists. When it does not, use the entity Create actions that exist inside this module: one `Recipe` row, then its `RecipeIngredient` rows, then its `RecipeStep` rows.

The action must be safe to run every time the module is published. `Recipe.Name` is unique without regard to case. For each recipe, look for an existing row with the same name, ignoring case. When that row exists, leave it unchanged and continue with the next recipe.

## How to map recipes.txt

A blank line separates recipes. Preparation Time and Cooking Time are minutes. Nutrition values are already per serving. Store them as written. Every recipe in this file is homemade, so set `RecipeKindId` to Homemade and leave `SourceId` null.

| File label       | Entity attribute          |
| ---------------- | ------------------------- |
| Name             | Recipe.Name               |
| Description      | Recipe.Description        |
| Category         | Recipe.RecipeCategoryId   |
| Cuisine          | Recipe.CuisineId          |
| Servings         | Recipe.Servings           |
| Difficulty       | Recipe.RecipeDifficultyId |
| Preparation Time | Recipe.PrepTimeMinutes    |
| Cooking Time     | Recipe.CookTimeMinutes    |
| Calories         | Recipe.Calories           |
| Protein          | Recipe.Protein            |
| Carbs            | Recipe.Carbs              |
| Fat              | Recipe.Fat                |
| Sugar            | Recipe.Sugar              |
| Sodium           | Recipe.Sodium             |

Under `Ingredients`, each ingredient is three lines: `Units`, `Unit of measure`, and `Name`. Store them on `RecipeIngredient` as `Units`, `UnitOfMeasureId`, and `Name`, with `RecipeId` set to the new recipe. Set `Order` to 1 for the first ingredient and increase by 1 in file order, unless `Recipe_Create` already uses a different starting number. Use that existing convention when it does.

Under `Steps`, each remaining line is one `RecipeStep.Instruction`, in file order, with the same `Order` rule. Copy every instruction exactly, including the stray trailing numbers in the Kung Pao Chicken and Miso Ramen steps. Copy ingredient names exactly too, including the spellings already in the file.

These lengths are the attribute limits. Stop and report the field if a value does not fit. Do not truncate it.

- Recipe.Name: 150
- Recipe.Description: 2000
- RecipeIngredient.Name: 200
- RecipeStep.Instruction: 2000

## When you finish

List the action, the timer, and the five recipe names. Tell the user to review the result in Compare and Merge and then publish `Recipe_CS`. The timer inserts any missing recipes when that publish finishes. The rows can then be checked with View Data on `Recipe` in Service Studio, or on the Recipes screen.
