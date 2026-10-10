# Meal Planner — Claude Code prompts for OutSystems 11

These prompts build the greenfield application described in `modules.md`. Every module belongs to the application **Meal Planner**. `MealPlanner_Th` and `MealPlanner` are Reactive Web modules. `Source_CS`, `Settings_CS`, `Recipe_CS`, `MealPlan_CS`, and `Planning_BL` are Service modules. Each prompt changes one module. Run them in order. Review the Compare and Merge result, fix anything you do not want, publish that module, and only then run the next prompt.

The prompts assume [OutSystems MCP for O11](https://success.outsystems.com/documentation/11/outsystems_mcp/). Claude Code is the MCP host. The OutSystems skill for O11 is installed from the `outsystems11-mcp` repository. The Service Studio MCP server is running against the module you have open. Reads are generally available. Writes are a Beta capability. Leave Write permissions on **Manual review** so nothing merges until you accept it in Compare and Merge. Do not turn on automatic merge and publish.

These are build prompts. They are not the read-only [prompt blueprints](https://success.outsystems.com/documentation/11/outsystems_mcp/prompt_blueprints/).

Do not ask the agent to publish, to open a different module, or to recreate Firebase.

## Before the first prompt

1. Use Service Studio 11.55.91 or later. In **Edit > MCP Server**, start the server. Register the endpoint shown in that window (`http://127.0.0.1:PORT/mcp`) in Claude Code, using the steps in the `outsystems11-mcp` README. Install the OutSystems skill for O11 before the first session.
2. In Service Studio, select **New Application**. Choose **From scratch**, then **Reactive Web App**. Name the application **Meal Planner**. Create the app. Do not create a second application.
3. Create `MealPlanner_Th` with module type **Reactive Web**. A theme is a Reactive Web module.
4. Create `MealPlanner` with module type **Reactive Web**.
5. Create `Source_CS`, `Settings_CS`, `Recipe_CS`, `MealPlan_CS`, and `Planning_BL` with module type **Service**. Do not create them as Reactive Web, and do not create them as Blank. Blank only omits the UI framework. A Service module has no screens, blocks, client actions, session variables, or local storage, and that is what these five modules are. Expose public Server Actions, not Service Actions: there is one consumer and one release cycle, and a meal-item change must stay in the caller's transaction.
6. Do not add entities or screens by hand. The prompts do that.
7. For each prompt: open that module, start a new Claude Code session, approve the Service Studio connection, paste the prompt, and wait until the agent stops.

If a later prompt says a reference is missing, publish the producer module and refresh references before asking the agent to continue.

## Sequence

| #   | Module open in Service Studio | Prompt                             |
| --- | ----------------------------- | ---------------------------------- |
| 1   | `MealPlanner_Th`              | Theme                              |
| 2   | `Source_CS`                   | Sources                            |
| 3   | `Settings_CS`                 | Application settings               |
| 4   | `Recipe_CS`                   | Recipe data model                  |
| 5   | `Recipe_CS`                   | Recipe actions                     |
| 6   | `MealPlan_CS`                 | Meal plan data model               |
| 7   | `MealPlan_CS`                 | Add, update, and remove meal items |
| 8   | `Planning_BL`                 | Nutrition and week calculations    |
| 9   | `MealPlanner`                 | Shell, login, and menu             |
| 10  | `MealPlanner`                 | Sources screens                    |
| 11  | `MealPlanner`                 | Settings screen                    |
| 12  | `MealPlanner`                 | Recipe list and detail             |
| 13  | `MealPlanner`                 | Recipe create and update           |
| 14  | `MealPlanner`                 | Planning list, week, and delete    |
| 15  | `MealPlanner`                 | Add and edit a meal item           |
| 16  | `MealPlanner`                 | Dashboard                          |

---

## Prompt 1 — MealPlanner_Th

Open `MealPlanner_Th` before you paste this. It must be a Reactive Web module.

```text
You are building a greenfield OutSystems 11 Reactive Web module. The module open in Service Studio must be MealPlanner_Th, and it must be a Reactive Web module. If any other module is open, or if this module is not Reactive Web, stop and tell me the name and the module type. Do not switch modules, publish, or change any other module.

Use the OutSystems skill for O11 and the Service Studio MCP. Read the module before you change it. Make the smallest change that satisfies this prompt. When you finish, list what you added and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

This module is the theme only. Base it on the OutSystems UI theme. Do not create screens, entities, actions, or roles. Do not create a menu or a login flow.

Add stylesheet classes for five nutritional statuses so later screens can color a value without inventing colors:

- in-zone: green
- low-warn and high-warn: amber
- low-danger and high-danger: red

Set the module description to: Theme for the shared household Meal Planner. Status colors only.
```

---

## Prompt 2 — Source_CS

Open `Source_CS`. It must be a Service module. Publish nothing else first. This module has no factory references.

```text
You are building a greenfield OutSystems 11 Service module. The module open in Service Studio must be Source_CS. If any other module is open, or if this module is not a Service module, stop and tell me. Do not switch modules, publish, or change any other module. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Read the module before you change it. When you finish, list the public elements you created and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

This is a core service. Data is application-wide, not per user. Do not add a UserId. Do not reference Recipe_CS or any other Meal Planner module.

Create public entity Source, Expose Read Only = Yes:

- Name, Text(100), mandatory
- IsProtected, Boolean, mandatory, default False

Add a unique index on Name. Also enforce uniqueness in the actions below, case-insensitive, after trimming. The duplicate message is "{name}" already exists, using the trimmed name.

Create a bootstrap timer that runs on publish and inserts one row when it is missing: Name "Generic Restaurant", IsProtected True. Do not insert a second row if that name already exists.

Public server actions, all with a success flag and a user-facing message:

- Source_Create(Name). Trim the name. Reject a blank name. Reject a duplicate name, ignoring case.
- Source_Update(SourceId, Name). Same name rules. IsProtected does not block the rename.
- Source_Delete(SourceId). Reject the delete when IsProtected is True, with the message "This source cannot be deleted." Do not query recipes. A later module decides whether a source is in use.

Set the module description to: Sources for prepared foods, including the protected Generic Restaurant record.
```

---

## Prompt 3 — Settings_CS

Open `Settings_CS`. It must be a Service module.

```text
You are building a greenfield OutSystems 11 Service module. The module open in Service Studio must be Settings_CS. If any other module is open, or if this module is not a Service module, stop and tell me. Do not switch modules, publish, or change any other module. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Read the module before you change it. When you finish, list the public elements and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

This is a core service for one shared settings record. Do not add a UserId. Do not reference any other Meal Planner module.

Create public static entity WeekDay with a DayIndex integer attribute. Records, in order: Sunday 0, Monday 1, Tuesday 2, Wednesday 3, Thursday 4, Friday 5, Saturday 6.

Create public entity ApplicationSetting, Expose Read Only = Yes. The module must keep exactly one row.

Attributes, all mandatory:

- MinDailyCalories Decimal, default 1950
- MaxDailyCalories Decimal, default 2150
- MinDailyProtein Decimal, default 140
- MaxDailyProtein Decimal, default 160
- MinDailyCarbs Decimal, default 210
- MaxDailyCarbs Decimal, default 235
- MinDailyFat Decimal, default 60
- MaxDailyFat Decimal, default 75
- MinDailySodium Decimal, default 1500
- MaxDailySodium Decimal, default 2300
- MaxDailySugar Decimal, default 38
- Tolerance Decimal, default 10
- WeekStartDayId, WeekDay identifier, default Sunday

Public server actions:

- ApplicationSetting_Get. If no row exists, create the default row and return it. If more than one row exists, return the oldest and do not create another.
- ApplicationSetting_Update with every attribute above. Update the existing row. Never insert a second row. Reject the update unless all of these hold, and return a specific message for the first failure:
  - each minimum and each maximum, including sugar, is positive
  - each minimum is less than its matching maximum
  - Tolerance is from 0 through 100 inclusive
  - WeekStartDayId is a real WeekDay

Set the module description to: Shared daily nutrition targets and the day the week starts.
```

---

## Prompt 4 — Recipe_CS data model

Publish `Source_CS` first. Open `Recipe_CS`. It must be a Service module. Add a reference to the published `Source_CS` if the agent cannot see it. This prompt creates data only. Do not add create, update, delete, or search actions yet.

```text
You are building a greenfield OutSystems 11 Service module. The module open in Service Studio must be Recipe_CS. If any other module is open, or if this module is not a Service module, stop and tell me. Do not switch modules, publish, or change any other module. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published Source_CS module. If that reference is not available, stop and tell me to publish Source_CS. Read the module before you change it. This prompt is the data model only. Do not create Recipe_Create, Recipe_Update, Recipe_Delete, Recipe_Get, Recipe_Search, or Source_DeleteIfUnused. When you finish, list the entities, static records, and validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Data is application-wide. Do not add a UserId.

Create these public static entities and records.

RecipeKind: Homemade, Prepared.

RecipeDifficulty: Easy, Normal, Advanced.

RecipeCategory, labels exactly: Appetizer, Beverage, Breakfast, Bread, Grain, Pasta, Beef, Pork, Lamb, Poultry, Seafood, Vegetarian, Side Dish, Soup, Salad, Sauce, Dessert.

Cuisine: American, Chinese, French, Greek, Indian, Italian, Japanese, Mediterranean, Mexican, Middle Eastern, Thai.

UnitType: Weight, Volume, Quantity.

UnitSystem: Metric, Customary, None.

UnitOfMeasure with attributes Code Text(10), Label Text(50), UnitTypeId, and UnitSystemId. Records:

- ml, Milliliter, Volume, Metric
- l, Liter, Volume, Metric
- tsp, Teaspoon, Volume, Customary
- tbsp, Tablespoon, Volume, Customary
- floz, Fluid Ounce, Volume, Customary
- cup, Cup, Volume, Customary
- pint, Pint, Volume, Customary
- quart, Quart, Volume, Customary
- gallon, Gallon, Volume, Customary
- mg, Milligram, Weight, Metric
- g, Gram, Weight, Metric
- kg, Kilogram, Weight, Metric
- oz, Ounce, Weight, Customary
- lb, Pound, Weight, Customary
- piece, Piece, Quantity, None
- item, Item, Quantity, None
- each, Each, Quantity, None
- pinch, Pinch, Quantity, None
- serving, Serving, Quantity, None

Create public entity Recipe, Expose Read Only = Yes. Unique index on Name.

- Name Text(150) mandatory
- Description Text(2000) optional
- RecipeKindId mandatory
- SourceId, Source identifier from Source_CS, optional, Delete Rule Protect
- RecipeCategoryId mandatory
- CuisineId mandatory
- RecipeDifficultyId mandatory
- Servings Decimal mandatory
- PrepTimeMinutes Integer mandatory
- CookTimeMinutes Integer mandatory
- Calories, Sodium, Sugar, Carbs, Fat, Protein: Decimal mandatory

Create public entity RecipeIngredient, Expose Read Only = Yes, Delete Rule Delete on RecipeId:

- RecipeId mandatory
- Order Integer mandatory
- Units Decimal mandatory
- UnitOfMeasureId mandatory
- Name Text(200) mandatory

Create public entity RecipeStep, Expose Read Only = Yes, Delete Rule Delete on RecipeId:

- RecipeId mandatory
- Order Integer mandatory
- Instruction Text(2000) mandatory

Index RecipeIngredient and RecipeStep by RecipeId and Order.

Set the module description to: Recipe library for homemade meals and prepared foods.
```

---

## Prompt 5 — Recipe_CS actions

Stay in `Recipe_CS` after Prompt 4 is merged. Do not redesign the entities.

```text
You are extending the OutSystems 11 Service module open in Service Studio. It must be Recipe_CS, and it must already contain Recipe, RecipeIngredient, RecipeStep, and the static entities from the data-model prompt. If that is not true, or if this module is not a Service module, stop and tell me what is missing. Do not switch modules, publish, or change any other module. Do not rename or delete the entities. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Read the current actions before you add new ones. When you finish, list the public actions and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Add structures the actions can accept and return:

- RecipeIngredientInput: Order, Units, UnitOfMeasureId, Name
- RecipeStepInput: Order, Instruction
- RecipeData: every Recipe attribute except the id, plus the two input lists

Public server actions. Each write action returns success and a user-facing message.

Recipe_Create(RecipeData) and Recipe_Update(RecipeId, RecipeData):

- Trim Name. Reject a blank name.
- Reject a duplicate name, ignoring case. The message is "{name}" already exists. On update, ignore the recipe being saved.
- Category, cuisine, kind, and servings are required.
- The six nutrition fields are required.
- Homemade: PrepTimeMinutes and CookTimeMinutes are required and zero or greater. Store SourceId as null. Store the submitted difficulty, prep, and cook. Replace ingredients and steps with the submitted lists, in Order. Skip ingredient rows that have no units, no unit, or a blank name. Skip steps with a blank instruction. Empty lists are allowed.
- Prepared: SourceId is required and must exist. Store difficulty as Easy, prep 0, and cook 0. Delete any ingredients and steps.
- Update replaces child lists; it does not append.

Recipe_Get(RecipeId) returns the recipe, its ingredients ordered by Order, and its steps ordered by Order. Return a clear failure when the id does not exist.

Recipe_Delete(RecipeId) deletes that recipe. Do not reference MealPlan_CS. If the database rejects the delete because a meal item still points at the recipe, return success false and the message "This recipe is used in a meal plan and cannot be deleted."

Recipe_Search(Keywords, RecipeCategoryId, CuisineId, MinCalories, MaxCalories) returns recipes. A null filter is ignored. Split Keywords on spaces, ignore empty tokens, and keep a recipe only when every token appears, case-insensitive, in the name, the description, or an ingredient name. Apply the calorie bounds to the recipe's per-serving calories. Do not filter by kind.

Source_DeleteIfUnused(SourceId):

- If any recipe has this SourceId, return success false and the message "This source is used in recipes and cannot be deleted."
- Otherwise call Source_Delete from Source_CS and return that result.

Do not add a Calculate Nutrition action and do not call an external API.
```

---

## Prompt 6 — MealPlan_CS

Publish `Recipe_CS` first. Open `MealPlan_CS`. It must be a Service module.

```text
You are building a greenfield OutSystems 11 Service module. The module open in Service Studio must be MealPlan_CS. If any other module is open, or if this module is not a Service module, stop and tell me. Do not switch modules, publish, or change any other module. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published Recipe_CS module. If that reference is not available, stop and tell me to publish Recipe_CS. Do not reference Settings_CS or Planning_BL. Read the module before you change it. When you finish, list the public elements and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Data is application-wide. Do not add a UserId. Do not implement nutrition scaling or settings comparisons in this module.

Create public static entity MealType with records Breakfast, Lunch, Dinner, Snack.

Create public entity MealPlan, Expose Read Only = Yes:

- PlanDate Date, mandatory, unique

Create public entity Meal, Expose Read Only = Yes, Delete Rule Delete on MealPlanId:

- MealPlanId mandatory
- MealTypeId mandatory
- Unique on MealPlanId plus MealTypeId

Create public entity MealItem, Expose Read Only = Yes, Delete Rule Delete on MealId:

- MealId mandatory
- RecipeId, Recipe identifier, mandatory, Delete Rule Protect
- Name Text(150) mandatory
- Servings Decimal mandatory
- Calories, Sodium, Sugar, Carbs, Fat, Protein: Decimal mandatory

Index MealPlan.PlanDate, Meal.MealPlanId, MealItem.MealId, and MealItem.RecipeId.

Public server actions and functions only:

- MealPlan_GetByDate(PlanDate) returns the plan, its meals, and its items, in stored order. Return an empty result when that date has no plan.
- MealPlan_GetForPeriod(StartDate, EndDate) returns the same shape for every plan whose PlanDate is inside the inclusive range.
- MealPlan_RecipeIsUsed(RecipeId) returns true when any MealItem points at that recipe.
- MealItem_Get(MealItemId) returns the item, its MealTypeId, and its PlanDate, or a failure when it does not exist.

Do not add actions that create, move, or delete meal items. Those are the next prompt, still in this module.

Set the module description to: One shared meal plan per date, with breakfast, lunch, dinner, and snack items.
```

---

## Prompt 7 — MealPlan_CS meal item commands

Stay in `MealPlan_CS` after Prompt 6 is merged. Publish `Recipe_CS` if this module cannot see it.

```text
You are extending the OutSystems 11 Service module open in Service Studio. It must be MealPlan_CS and it must already contain MealPlan, Meal, MealItem, and MealType. If that is not true, or if this module is not a Service module, stop and tell me what is missing. Do not switch modules, publish, or change any other module. Do not reference Settings_CS or Planning_BL. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Read the current actions before you add new ones. These writes stay in this module because the entities are expose-read-only to other modules. When you finish, describe the three new actions and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Add three public server actions. Each returns success and a message. Each one performs its whole change in a single server action so a move cannot leave two copies or an empty plan behind.

Shared rules:

- Servings must be positive. All six nutrition values are required. PlanDate, MealTypeId, and RecipeId are required. RecipeId must exist.
- The stored item Name is the recipe name at save time. Do not update older items when a recipe is later renamed.
- Store the Nutrition argument as the snapshot. Do not rescale it inside these actions. The screen asks Planning_BL for a proposed snapshot and may override it before save.
- After a remove or a move, delete a meal that has no items. Then delete a plan that has no meals.

MealItem_Add(PlanDate, MealTypeId, RecipeId, Servings, Nutrition):

- Find the plan for PlanDate. Create it when it does not exist.
- Find the meal of that type on the plan. Create it when it does not exist.
- Create the meal item.

MealItem_Update(MealItemId, PlanDate, MealTypeId, RecipeId, Servings, Nutrition):

- Load the existing item, its meal, and its plan. Fail with a clear message when the item does not exist.
- If the plan date and meal type are unchanged, update the item in place.
- If either changed, create or reuse the destination plan and meal, create the item there with the same values, and delete the original item. Then clean up the original meal and plan when they are empty. The destination must not be cleaned up.

MealItem_Remove(MealItemId):

- Delete the item. Clean up the meal and the plan when they are empty. Fail with a clear message when the item does not exist.

Do not add screens. Do not call an external API.
```

---

## Prompt 8 — Planning_BL calculations

Publish `Settings_CS`, `Recipe_CS`, and `MealPlan_CS`. Open `Planning_BL`. It must be a Service module. This prompt is calculations only.

```text
You are building a greenfield OutSystems 11 Service module. The module open in Service Studio must be Planning_BL. If any other module is open, or if this module is not a Service module, stop and tell me. Do not switch modules, publish, or change any other module. Do not create screens, blocks, client actions, session variables, or local storage entities. Expose public Server Actions, not Service Actions.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published modules Settings_CS, Recipe_CS, and MealPlan_CS. If any reference is missing, stop and name it. Read the module before you change it. This prompt adds calculations only. Do not create, move, or delete meal items. Those actions belong to MealPlan_CS. When you finish, list the public elements and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Create public static entity NutritionalStatus with records InZone, LowWarn, LowDanger, HighWarn, HighDanger.

Create structure Nutrition with Decimal attributes Calories, Sodium, Sugar, Carbs, Fat, Protein.

Create structure WeeklySummary with StartDate, EndDate, DaysWithMeals Integer, and Decimal averages AverageCalories, AverageProtein, AverageCarbs, AverageFat, AverageSugar, AverageSodium.

Public functions:

Nutrition_RangeStatus(Value, Min, Max, Tolerance) returns a NutritionalStatus identifier. Return NullIdentifier when any input is null. Let allowed equal ((Max + Min) / 2) multiplied by (the greater of Tolerance and 0, divided by 100).

- Value from Min through Max inclusive: InZone
- Value below Min and greater than or equal to Min minus allowed: LowWarn
- Value above Max and less than or equal to Max plus allowed: HighWarn
- Otherwise below Min: LowDanger
- Otherwise: HighDanger

Nutrition_MaxOnlyStatus(Value, Max, Tolerance) returns a NutritionalStatus identifier. Return NullIdentifier when any input is null. Let allowed equal Max multiplied by (the greater of Tolerance and 0, divided by 100).

- Value less than or equal to Max: InZone
- Value less than or equal to Max plus allowed: HighWarn
- Otherwise: HighDanger

Nutrition_Scale(Nutrition, Factor) returns a Nutrition with each field multiplied by Factor.

Nutrition_ForServings(RecipeId, Servings) reads the recipe and returns its per-serving nutrition multiplied by Servings. Return a failure when the recipe does not exist or Servings is not positive.

MealPlan_DailyNutrition(PlanDate) sums the nutrition snapshots of every meal item on that date. A date with no plan returns all zeros.

Planning_WeekRange(ReferenceDate) reads ApplicationSetting_Get and returns the start and end dates of the week that contains ReferenceDate. The start weekday is WeekStartDay.DayIndex. The end date is start plus 6 days.

Planning_WeeklySummary(WeekStartDate) loads meal plans from WeekStartDate through WeekStartDate plus 6 days inclusive. DaysWithMeals is the number of those plans that contain at least one meal. Divide each nutrition sum by DaysWithMeals, or by 1 when DaysWithMeals is 0, then round each average to the nearest integer. EndDate is WeekStartDate plus 6 days.

Set the module description to: Nutrition status and weekly summaries for the shared planner.
```

---

## Prompt 9 — MealPlanner shell

Publish `MealPlanner_Th`. Open `MealPlanner`. It must be a Reactive Web module. Later prompts fill the screens. This prompt creates the shell and empty screens so navigation can be reviewed.

```text
You are building a greenfield OutSystems 11 Reactive Web module. The module open in Service Studio must be MealPlanner, and it must be a Reactive Web module. If any other module is open, or if it is not Reactive Web, stop and tell me. Do not switch modules, publish, or change any other module.

Use the OutSystems skill for O11 and the Service Studio MCP. Set the module theme's base theme to MealPlanner_Th. Reference Users. If MealPlanner_Th is not available, stop and tell me to publish it. Do not reference the core modules yet. Do not create entities. Read the module before you change it. When you finish, list the screens and the validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Create site properties AppDescription = "Meal Planner" and AppVersion = "2.0.0". Set the module description to AppDescription.

Anonymous screens: Login and InvalidLink. Every other screen requires the Registered role.

Login:
- Title "Login to Your Account".
- Email and password. Email is required. If it does not contain an @ and a dot, show "Invalid e-mail". Password is required.
- The Login button stays disabled until the form is valid.
- Call the Users login action. Read the Users module and use the real action; do not guess a name. If you cannot find it, stop.
- On failure show "Login failed. Please try again."
- On success navigate to Dashboard.
- "Forgot Password?" switches the same screen to reset mode. Title "Get Password Reset Instructions". Helper text: "Please enter your email address. If your email is associated with a valid active account, we will send an instructional email with a password reset link. Use that link to reset your password." Hide the password field. The button label is "Send Reset Instructions". Cancel returns to the login form without sending.
- Send calls the Users password-reset action. Success message: "Password reset email sent. Please check your inbox for further instructions. Be sure to look in your spam folder if you do not see it right away." Failure message: "Failed to send password reset email. Please try again."

InvalidLink, anonymous:
- Title: "I find this failure to load to be disturbing."
- Subtitle: "This is not the page you are looking for."

Create these Registered screens with a heading and no business data yet: Dashboard, DashboardRecipes, Planning, Week, MealItemAdd, MealItemEdit, Recipes, RecipeType, RecipeDetail, RecipeEdit, Sources, SourceEdit, Settings.

Headings: Dashboard "Today's Outlook", Planning "Planning & Logging", Week "Weekly Plan", MealItemAdd "Add Meal Item", MealItemEdit "Update Meal Item", Recipes "My Recipes", RecipeType "Pick a Recipe Type", Sources "Sources for Recipes".

Week and MealItemAdd each have an input WeekStartDate of type Date, mandatory. A missing or invalid WeekStartDate on those two screens redirects to InvalidLink. MealItemEdit has an input WeekStartDate and does not redirect when it is missing. RecipeDetail and RecipeEdit have an input RecipeId. SourceEdit has an input SourceId. MealItemEdit also has an input MealItemId. Leave the inputs unused for now except for the Week and MealItemAdd redirect.

Layout:
- A menu with Dashboard, Planning & Logging, Recipes, then a divider, then Settings, Recipe Sources, and Logout.
- Logout calls the Users logout action and returns to Login.
- On a wide screen the menu is a permanent rail that expands on hover. On a phone the bar title is "Meal Planner" and the same menu opens from a menu button.
- Login and InvalidLink do not show that menu.

The home entry of the module opens Dashboard when the user is registered and Login otherwise.

Do not build the page contents in this prompt.
```

---

## Prompt 10 — Sources screens

Publish `Source_CS` and `Recipe_CS`. Open `MealPlanner`.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain the Sources and SourceEdit screens from the shell prompt. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module. Do not change Login or the menu except to make sure Recipe Sources opens Sources.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published Source_CS and Recipe_CS modules. If either reference is missing, stop and name it. Reuse the public actions. Do not write Source or Recipe entities from this module. When you finish, describe the two screens and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Sources screen, title "Sources for Recipes":
- If recipes cannot be loaded, show "Recipes have failed to load, deletion of sources is disabled" and do not show delete icons.
- While sources or the usage check are loading, show a progress indicator.
- When the list is empty, show "No sources found".
- Otherwise list each source name. Clicking a row opens SourceEdit for that id.
- An add button opens SourceEdit for a new source.
- The protected source, IsProtected True, has no delete icon. That is the Generic Restaurant row, even if it has been renamed.
- Delete on any other source calls Source_DeleteIfUnused. When it reports the source is in use, show title "Source in use" and message "This source is used in recipes and cannot be deleted." Otherwise ask "Are you sure you want to delete {name}?" and call the action only after confirmation.

SourceEdit screen:
- Input SourceId, optional. No id means create.
- One required name field. The name must be unique, ignoring case, among the other sources. Show the duplicate message "{name}" already exists, using the trimmed name.
- Save is disabled until the form is valid. On update it is also disabled until the name changed.
- Save trims the name and calls Source_Create or Source_Update. Show the action's message on failure. On success return to Sources.
- Cancel returns to Sources without saving.
- The protected row can be renamed. Delete remains blocked on the list.
```

---

## Prompt 11 — Settings screen

Publish `Settings_CS`. Open `MealPlanner`.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain the Settings screen. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published Settings_CS module. If it is missing, stop. Use ApplicationSetting_Get and ApplicationSetting_Update. Do not write the entity from this module. When you finish, describe the screen and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Settings screen:
- Title "{AppDescription} - v{AppVersion}" using the site properties.
- Load the single ApplicationSetting row.
- Fields, in this order, all required:
  - Minimum and maximum daily calories, protein, fat, carbs, and sodium. Units: kcal, grams, grams, grams, mg.
  - Maximum daily sugar in grams. There is no sugar minimum.
  - Tolerance percent.
  - Week start day, bound to WeekDay.
- Minimum must be positive and less than its maximum. Maximum must be positive and greater than its minimum. Sugar maximum must be positive. Tolerance must be from 0 through 100 inclusive. Use these messages:
  - "Minimum {nutrient} must be less than maximum {nutrient}"
  - "Maximum {nutrient} must be greater than minimum {nutrient}"
  - "Tolerance must be 100 or less"
  - "Must be a positive number" when a bound is not positive
  - "Must be zero or greater" when tolerance is negative
- Reset restores the values from the last successful load, not the factory defaults.
- Save is disabled until the form is valid and at least one value differs from the loaded record.
- Save calls ApplicationSetting_Update and shows its message on failure. On success, the loaded snapshot becomes the new reset baseline.
```

---

## Prompt 12 — Recipe list and detail

Publish `Recipe_CS` and `MealPlan_CS`. Open `MealPlanner`.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain Recipes, RecipeDetail, and RecipeType. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module. Do not build the recipe editor in this prompt. RecipeType may stay a heading for now.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published Recipe_CS and MealPlan_CS modules. If either is missing, stop and name it. Call the public actions. Do not write recipe entities from this module. When you finish, describe the screens and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Recipes screen, title "My Recipes":
- A keyword box with placeholder "Search for a recipe..." and three optional filters: Category, Cuisine, and Calorie Range.
- Calorie ranges: 0-500, 501-750, 751-1000, and 1001+. 1001+ has no upper bound. Do not add a kind filter.
- Call Recipe_Search with the current filters.
- Show "Displaying {filtered} of {total} recipe" and add an "s" when the total is not 1. The total is the unfiltered recipe count. Show this even when the library is empty.
- No recipes in the library: "No recipes found."
- Recipes exist but none match: "No recipes match your search criteria."
- Otherwise show cards. Each card shows the name, category, cuisine, difficulty, description, servings, prep minutes plus cook minutes, and "{calories} kcal". Clicking a card opens RecipeDetail.
- An add button opens RecipeType.

RecipeDetail, input RecipeId:
- Call Recipe_Get. If it fails, show the failure message.
- Show the name, description, cuisine, category, difficulty, servings, prep time in minutes, and cook time in minutes.
- Ingredients as a list. When the unit code is "item", show "{units} {name}". Otherwise show "{units} {code} {name}".
- Steps as an ordered list of instructions.
- Per-serving nutrition: calories, protein in g, carbs in g, sodium in mg, fat in g, sugar in g. No status colors on this screen.
- Close returns to Recipes.
- Edit opens RecipeEdit with this RecipeId.
- Delete asks "Are you sure you want to delete {name}?" On confirm, call MealPlan_RecipeIsUsed. If true, show "This recipe is used in a meal plan and cannot be deleted." If false, call Recipe_Delete and return to Recipes. Also show that same message if Recipe_Delete fails because of the protect rule.
```

---

## Prompt 13 — Recipe create and update

Stay in `MealPlanner` after Prompt 12 is merged.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain RecipeType, RecipeEdit, and a working RecipeDetail. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module. Do not add a Calculate Nutrition button or an external API.

Use the OutSystems skill for O11 and the Service Studio MCP. Use Recipe_Create, Recipe_Update, Recipe_Get, Recipe_Search, and the Source entity's read-only data. When you finish, describe the screens and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

RecipeType:
- Title "Pick a Recipe Type".
- Homemade card, title "Homemade", text "Simple to complex, some assembly is required." Opens RecipeEdit with kind Homemade and no RecipeId.
- Prepared card, title "Prepared", text "Premade meals from a delivery service or restaurant." Opens RecipeEdit with kind Prepared and no RecipeId.
- Cancel returns to Recipes.

RecipeEdit inputs: optional RecipeId, and RecipeKindId. When RecipeId is set, load Recipe_Get and ignore the kind input in favor of the saved kind.

Common fields: Name, Description, Category, Cuisine, Servings, and the six per-serving nutrients. Name is required and unique among other recipes, ignoring case. The duplicate message is "{name}" already exists. Category, cuisine, and servings are required. Description is optional. Nutrients are required.

Homemade also shows Difficulty, Preparation Time (minutes), Cooking Time (minutes), an ingredient list, and a step list.
- Difficulty is required.
- Both times are required and zero or greater.
- An ingredient row has units, a unit of measure, and a name. The user can add, edit, reorder, and delete rows.
- A step row has an instruction. The user can add, edit, reorder, and delete rows.
- Do not show Source.

Prepared also shows a required Source dropdown of existing sources.
- Do not show difficulty, times, ingredients, or steps.
- On save, the action stores Easy, zero times, and empty lists. Do not show those defaults as fields.

Save is disabled until the form is valid. On update it is also disabled until something changed, including a list change.
Cancel from a new recipe returns to RecipeType. Cancel from an existing recipe returns to RecipeDetail.
Save calls Recipe_Create or Recipe_Update. Show the action message on failure. On success of a new recipe, open Recipes. On success of an existing recipe, open RecipeDetail for that recipe.
```

---

## Prompt 14 — Planning list, week, and delete

Publish `Planning_BL` and `Settings_CS`. Open `MealPlanner`.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain Planning and Week. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module. Do not build MealItemAdd or MealItemEdit contents in this prompt. You may link to them.

Use the OutSystems skill for O11 and the Service Studio MCP. Reference the published Planning_BL, MealPlan_CS, and Settings_CS modules. If a reference is missing, stop and name it. Call public actions. Do not write meal-plan entities from this module. When you finish, describe the screens and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Use the theme status classes: in-zone, low-warn, low-danger, high-warn, high-danger. Protein, carbs, fat, sodium, and calories use Nutrition_RangeStatus against that nutrient's minimum and maximum. Sugar uses Nutrition_MaxOnlyStatus against the sugar maximum. Tolerance comes from application settings.

A week summary shows the title, the start and end as M/d/yyyy - M/d/yyyy, "Days with Meals: {n}", and the six averages prefixed with "Average". Each nutrient shows its status marker. In zone is a circle. Below the range is a down arrow. Above the range is an up arrow.

Planning, title "Planning & Logging":
- Section "Current Weeks" with a card "This Week" and a card "Next Week (Planning)".
- Section "Recent Weeks" with the four previous weeks, newest first. Title each "Weeks Ago: {n}" where n is the number of weeks before this week.
- Compute week bounds with Planning_WeekRange and summaries with Planning_WeeklySummary.
- Clicking a card opens Week with that week's start date.

Week, input WeekStartDate:
- If WeekStartDate is missing or not a real date, redirect to InvalidLink.
- Title "Weekly Plan".
- Show a progress indicator while the week's plans load.
- Seven day cards, from WeekStartDate through the next six days. The day title is the full date. When the day has at least one meal, the title has a tooltip with that day's six nutrition totals and status markers. Otherwise the card says "No meals have been entered".
- For each meal that has items, show the meal type, then each item's name, a nutrition tooltip of the item snapshot, an edit link, and a delete link. Show meals in the order they are stored. Do not sort them.
- Edit opens MealItemEdit with the week start and the meal item id. Leave that screen's form to the next prompt.
- Delete asks "Are you sure you want to delete this item from the meal?" On confirm call MealItem_Remove from MealPlan_CS and refresh the week.
- Close goes back.
- An add button opens MealItemAdd with this WeekStartDate.
```

---

## Prompt 15 — Add and edit a meal item

Stay in `MealPlanner` after Prompt 14 is merged. Publish `Recipe_CS` if MealPlanner cannot yet read recipes.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain MealItemAdd, MealItemEdit, and a working Week screen. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module.

Use the OutSystems skill for O11 and the Service Studio MCP. MealItem_Add, MealItem_Update, and MealItem_Get are in MealPlan_CS. Nutrition_ForServings and Nutrition_Scale are in Planning_BL. Read recipes through the public Recipe entity or Recipe_Get. When you finish, describe both screens and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Both screens share one form:
- Date, required, choices limited to the seven dates of WeekStartDate. Show each as "Weekday, Month day".
- Meal type, required: Breakfast, Lunch, Dinner, Snack.
- Recipe, required, showing recipe names.
- Servings, required and positive. Default 1 on create.
- The six nutrients, required. The user may override them after they are proposed.

When the user selects a recipe, set nutrition to Nutrition_ForServings for the current servings.
When the user changes servings from a previous positive value, replace nutrition with Nutrition_Scale of the current nutrition by (new servings / previous servings). Do not jump back to the recipe baseline on a servings change.
The values sent to save are whatever is on the form at that moment, including overrides.

MealItemAdd, title "Add Meal Item":
- If WeekStartDate is missing or not a real date, redirect to InvalidLink.
- Save is disabled until the form is valid.
- Save calls MealItem_Add. The item name is copied inside that action. On success return to Week for the same WeekStartDate.
- Cancel returns to that Week without saving.

MealItemEdit, title "Update Meal Item", input MealItemId:
- A missing WeekStartDate does not redirect.
- Load MealItem_Get. If it fails, show the message and do not save.
- Save is disabled until the form is valid and something changed: date, meal type, recipe, servings, or any nutrient.
- Save calls MealItem_Update. A new date or meal type moves the item. On success return to Week.
- Cancel returns to Week without saving.
```

---

## Prompt 16 — Dashboard

Stay in `MealPlanner` after Prompts 14 and 15 are merged.

```text
You are extending the OutSystems 11 Reactive Web module open in Service Studio. It must be MealPlanner and it must already contain Dashboard, DashboardRecipes, and a working Week screen. If not, or if this module is not Reactive Web, stop. Do not switch modules, publish, or change any other module. Do not invent a finished meal-recipe browser. That page is intentionally unfinished.

Use the OutSystems skill for O11 and the Service Studio MCP. Use ApplicationSetting_Get, MealPlan_DailyNutrition, Planning_WeekRange, Planning_WeeklySummary, Nutrition_RangeStatus, and Nutrition_MaxOnlyStatus. When you finish, describe both screens and list validation errors and warnings. Leave the result for Compare and Merge. Do not publish.

Dashboard, title "Today's Outlook":
- Six cards for today, in this order: Protein (g), Sugar (g), Carbs (g), Sodium (mg), Fat (g), Calories.
- Values come from MealPlan_DailyNutrition for today's date. A day with no plan shows zeros.
- Protein, carbs, fat, sodium, and calories use Nutrition_RangeStatus with that nutrient's minimum, maximum, and the tolerance. Sugar uses Nutrition_MaxOnlyStatus with the sugar maximum and the tolerance.
- Color each status with the theme classes in-zone, low-warn, low-danger, high-warn, and high-danger. In zone is a circle. Below the range is a down arrow. Above the range is an up arrow.
- Four more cards: Breakfast, Lunch, Dinner, and Snacks. Snacks is the label for MealType Snack. The value is that meal's calorie snapshot total, or "N/A" when that meal is absent. Clicking a card opens DashboardRecipes and passes the meal type in lowercase: breakfast, lunch, dinner, or snack.
- Below a divider, show a "This Week" summary card and a "Next Week (Planning)" summary card, using the same summary layout as the Planning screen, including the date range M/d/yyyy - M/d/yyyy. Clicking a card opens Week for that start date.
- Do not show previous weeks on the dashboard.

DashboardRecipes:
- Show only this sentence: "The meal recipes page is under construction. Please check back later."
- Ignore the meal type passed on the link. Do not list recipes and do not add edit actions.

Do not add a UserId anywhere. Do not call Firebase or any external nutrition service.
```

---

## After the last prompt

Review `MealPlanner` in the browser as a registered user:

- Log in, fail a login, send a password reset, and cancel back to the login form.
- Create a source, rename Generic Restaurant, and confirm the renamed protected source still has no delete icon.
- Create a prepared recipe that uses a source, then a homemade recipe with ingredients. Cancel from the editor and confirm you return to Pick a Recipe Type. Save and confirm you return to the recipe list.
- Confirm a used source cannot be deleted.
- Add the recipes to a week, scale servings, override one nutrient, move an item to another day, and delete the last item so the plan disappears.
- Compare today's dashboard colors with the settings ranges and the tolerance.
- Open a meal card and confirm the placeholder is still the placeholder, including when the link carries a meal type.
