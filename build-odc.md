# Build KWS Meal Planner from Claude

The host is Claude, connected to the ODC OutSystems MCP server at the tenant. The OutSystems documentation names the validated host Claude Code. Each prompt is one edit to the KWS Meal Planner web app. Claude delegates that edit to Mentor, which changes the app model on the server. Work on this one app in one session. A turn runs one at a time, so wait until it finishes.

The edit prompt does not publish, switch assets, release a library, or deploy. When the turn finishes, read the summary and confirm the change was applied. A turn can finish without applying the edit. Then say "Publish the change." The agent restates the publish and waits for confirmation. Confirm it against the app's asset key. Publishing uploads the model, builds it, and deploys that revision to the Development stage connected to the Mentor session. Wait until that publish finishes, and confirm the revision number increased, before the next prompt. Do not start another publish while one is still running. If the result is reported as indeterminate, ask for the publish status again. A Mentor session discards unpublished edits after inactivity, so publish before a long pause. Do not deploy to QA or Production from these prompts. The bootstrap timer runs when the app is published.

The design these prompts implement is `architecture-odc.md`. The prompts repeat the detail Mentor needs so it does not read the Vue app.

## Setup, before the first prompt

1. From Claude, create one web app named KWS Meal Planner. Do not create an OutSystems 11 application. Do not create a module. Do not create a library, a mobile app, or an agentic app.
2. Leave the app empty of business entities and screens. The default OutSystems UI theme can stay. Do not add a library dependency other than the OutSystems UI the new app already uses.
3. There is no library to publish or release.
4. For each prompt: keep the session on KWS Meal Planner, send the prompt, and wait until the turn finishes. Confirm the result, then publish, and wait until the publish finishes.

## Prompt 1 — Reference data

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none. Do not add a library.

Add only static entities, in this web app. A static entity in an app is a database table. Use the default attributes Id, Label, Order, and Is_Active. Set Is_Active true on every record. Add the custom attributes named below. Do not turn off AutoNumber and do not replace the Id attribute.

WeekDay. Records in this order, Order 0 through 6, Label the English name: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.

MealType. Records Breakfast, Lunch, Dinner, Snack. Order 1 through 4. Label Snack is Snack, not Snacks.

RecipeKind. Custom attribute Code, Text, length 20. Record Homemade, Label Homemade, Code homemade. Record Prepared, Label Prepared, Code prepared.

RecipeCategory. Labels and order: Appetizer, Beverage, Breakfast, Bread, Grain, Pasta, Beef, Pork, Lamb, Poultry, Seafood, Vegetarian, Side Dish, Soup, Salad, Sauce, Dessert.

Cuisine. Labels and order: American, Chinese, French, Greek, Indian, Italian, Japanese, Mediterranean, Mexican, Middle Eastern, Thai.

RecipeDifficulty. Labels and order: Easy, Normal, Advanced.

UnitType. Labels: Volume, Weight, Quantity.

UnitSystem. Labels: Metric, Customary, None.

UnitOfMeasure. Custom attributes: Code Text length 20, UnitType of type UnitType Identifier, UnitSystem of type UnitSystem Identifier. Delete Rule Protect on both references. Records, in this order, with Label, Code, UnitType, and UnitSystem:

- Milliliter, ml, Volume, Metric
- Liter, l, Volume, Metric
- Teaspoon, tsp, Volume, Customary
- Tablespoon, tbsp, Volume, Customary
- Fluid Ounce, floz, Volume, Customary
- Cup, cup, Volume, Customary
- Pint, pint, Volume, Customary
- Quart, quart, Volume, Customary
- Gallon, gallon, Volume, Customary
- Milligram, mg, Weight, Metric
- Gram, g, Weight, Metric
- Kilogram, kg, Weight, Metric
- Ounce, oz, Weight, Customary
- Pound, lb, Weight, Customary
- Piece, piece, Quantity, None
- Item, item, Quantity, None
- Each, each, Quantity, None
- Pinch, pinch, Quantity, None
- Serving, serving, Quantity, None

Set Public to No on every static entity.

Do not add a second asset, a service action, a screen, a business entity, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, or a publish inside this edit. Do not add a menu.
```

## Prompt 2 — Settings, sources, and bootstrap

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

The static entities from the previous prompt already exist. Reuse WeekDay. Do not create it again.

Add two private entities. Identifiers stay Id, Long Integer, AutoNumber. Public is No. Text has no null; store an omitted description or URL as an empty string.

Settings. One household row, not one row per user. No UserId. Attributes, all mandatory: MinDailyCalories, MaxDailyCalories, MinDailyProtein, MaxDailyProtein, MinDailyFat, MaxDailyFat, MinDailyCarbs, MaxDailyCarbs, MinDailySodium, MaxDailySodium, and MaxDailySugar, each Decimal; Tolerance Decimal; WeekStartDay, WeekDay Identifier, Delete Rule Protect. Do not index the Boolean-free singleton beyond its primary key.

Source. Attributes: Name Text length 200, mandatory; Description Text length 2000; Url Text length 500; IsProtected Boolean, mandatory, default false. Do not add a unique index on Name. Do not index IsProtected.

Add a server action UpdateSettings. Input the Settings attributes. It updates the existing Settings row and does not insert a second row. Enforce: each minimum, maximum, and the sugar maximum is a positive number; each minimum is less than its maximum; Tolerance is from 0 through 100 inclusive; WeekStartDay is set. Failure messages, using the lower-case nutrient name: "Required"; "Must be a positive number"; "Must be a valid positive number"; "Minimum {nutrient} must be less than maximum {nutrient}"; "Maximum {nutrient} must be greater than minimum {nutrient}"; "Must be zero or greater"; "Must be a valid number zero or greater"; "Tolerance must be 100 or less".

Add server actions AddSource and UpdateSource. Inputs: Name, Description, Url, and for update the Source id. Trim Name, Description, and Url. Store an empty description or URL as "". AddSource sets IsProtected false. UpdateSource does not change IsProtected. Empty name fails with "Required". A non-empty URL that is not http or https fails with "Must be an http or https URL". A trimmed name that matches another source, ignoring case, fails with the message quote, the trimmed name, quote, space, already exists. For example, a typed name "Cafe" that matches an existing "cafe" fails with "Cafe" already exists. Update excludes the source being edited.

Add server action DeleteSource. Input the Source id. If IsProtected is true, do not delete and do not show a message. Recipe does not exist yet, so this prompt only implements the protected-source check. The next prompt adds the in-use check.

Add server action BootstrapReferenceData. It is safe to run again. If no Settings row exists, insert one: MinDailyCalories 1950, MaxDailyCalories 2150, MinDailyProtein 140, MaxDailyProtein 160, MinDailyCarbs 210, MaxDailyCarbs 235, MinDailyFat 60, MaxDailyFat 75, MinDailySodium 1500, MaxDailySodium 2300, MaxDailySugar 38, Tolerance 10, WeekStartDay Sunday. If no Source has IsProtected true, insert Name "Generic Restaurant", empty description, empty URL, IsProtected true. Do not import accounts, emails, or seed files.

Add timer BootstrapOnPublish. It runs BootstrapReferenceData. Schedule it to run when the app is published. Timeout 20 minutes. Do not give it a clock time. Timers are UTC, and this one has no clock. If the Schedule property cannot be set in development, say so in the plan and leave the action ready for the Portal schedule "when published". Do not publish inside this edit.

Do not add a second asset, a service action, a screen, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, or a menu.
```

## Prompt 3 — Recipes

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Reuse Source, RecipeKind, RecipeCategory, Cuisine, RecipeDifficulty, and UnitOfMeasure. Do not recreate them.

Add a private structure Nutrition with Decimal attributes Calories, Sodium, Fat, Protein, Carbs, and Sugar. It is not an entity and it is not public.

Add private entities. Id stays Long Integer AutoNumber. Public No.

Recipe. Attributes: Name Text 200 mandatory; Description Text 2000; Kind RecipeKind Identifier mandatory, Delete Rule Protect; SourceId Source Identifier, not mandatory, Delete Rule Protect; Category RecipeCategory Identifier mandatory, Delete Rule Protect; Cuisine Cuisine Identifier mandatory, Delete Rule Protect; Difficulty RecipeDifficulty Identifier mandatory, Delete Rule Protect; Servings Decimal mandatory; PrepTimeMinutes Integer mandatory; CookTimeMinutes Integer mandatory; Calories, Sodium, Sugar, Carbs, Fat, and Protein, each Decimal mandatory. Index SourceId only through the relationship index. No unique index on Name. No UserId.

Ingredient. RecipeId Recipe Identifier mandatory, Delete Rule Delete; Order Integer mandatory; Units Decimal mandatory; UnitOfMeasureId UnitOfMeasure Identifier mandatory, Delete Rule Protect; Name Text 200 mandatory.

Step. RecipeId Recipe Identifier mandatory, Delete Rule Delete; Order Integer mandatory; Instruction Text 2000 mandatory.

Finish DeleteSource so it refuses when any Recipe.SourceId equals the source, with the message "This source is used in recipes and cannot be deleted." A protected source is still not deleted.

Add server actions AddRecipe and UpdateRecipe. Each receives the recipe fields plus the ingredient list and the step list, in order. One action writes the recipe and replaces that recipe's ingredient and step rows, so they commit or roll back together. Do not call a service action.

Homemade requires category, cuisine, servings, difficulty, both times, and all six nutrition numbers. Prepared requires those shared fields except difficulty and the times, plus a source. Prepared stores Difficulty Easy, both times 0, and no ingredient or step rows. Kind is always set. Do not store a null kind.

Name is trimmed and required. It is unique, ignoring case, among recipes of the same kind. A prepared name is unique among prepared recipes with the same source. Exclude the recipe being updated. Failure message is quote, the trimmed name, quote, space, already exists. Empty name fails with "Required". Servings fails with "Must be a positive number" or "Must be a valid positive number". Each time fails with "Must be zero or greater" or "Must be a valid number zero or greater". Each nutrition number is required and zero or greater, with "Required", "Must be zero or greater", or "Must be a valid number zero or greater".

Keep an ingredient only when Units is a number greater than 0, the trimmed name is not empty, and a unit is selected. Keep a step only when the trimmed instruction is not empty. Empty lists are allowed. Order starts at 1 in the kept order. Trim ingredient names and step instructions.

Add server action DeleteRecipe. It deletes the recipe. Child delete rules remove ingredients and steps. Meal items do not exist yet, so this prompt does not check them. A later prompt adds that check to this action. Do not drop the action.

Do not add a second asset, a service action, a screen, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a menu.
```

## Prompt 4 — Plans, meals, and items

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Reuse MealType, Recipe, and Nutrition. Do not recreate them.

Add private entities. Id stays Long Integer AutoNumber. Public No. No UserId.

MealPlan. Date, type Date, mandatory. Unique index on Date. One plan per calendar date. Date is stored as the calendar date, with no time-zone conversion.

Meal. MealPlanId MealPlan Identifier mandatory, Delete Rule Delete. MealTypeId MealType Identifier mandatory, Delete Rule Protect. Unique index on MealPlanId plus MealTypeId. One meal of each type on a plan.

MealItem. MealId Meal Identifier mandatory, Delete Rule Delete. RecipeId Recipe Identifier mandatory, Delete Rule Protect. Name Text 200 mandatory. Servings Decimal mandatory. Calories, Sodium, Sugar, Carbs, Fat, and Protein, each Decimal mandatory. These six numbers are a copy. They are not read from Recipe when the item is displayed. Protect on RecipeId stops a recipe delete while a meal item still points at it. Do not use Ignore or Delete on RecipeId.

Do not add server actions in this prompt. Do not add a second asset, a service action, a screen, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a menu.
```

## Prompt 5 — Meal-item writes

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Add three server actions in this app. Each action performs its whole plan, meal, and item change in that one action. Do not split a save across service actions. A service action would commit before the caller could roll it back. Do not add a service action.

AddMealItem. Inputs: Date, MealType, Recipe id, Name, Servings, and the six nutrition numbers. Servings must be a positive number. Date and meal type are required. If no MealPlan exists for the date, create the plan, one meal of that type, and the item. If the plan exists without that meal type, add the meal and the item. If the meal exists, append the item. Do not create a second meal of the same type.

UpdateMealItem. Inputs: the original date, the original meal type, and the new date, meal type, recipe id, name, servings, and six nutrition numbers. If the source plan is gone, write nothing and raise no user-facing message. If the date and meal type are unchanged, replace the item's name, recipe, servings, and nutrition. If only the meal type changes, remove the item from the old meal, delete that meal when it has no items, and append the item to the destination meal, creating that meal when needed. Do not delete the plan. If the date changes, remove the item from the source meal, delete an empty meal, delete the source plan when it has no meals, and add the item on the destination date, creating the destination plan and meal when needed. The source cleanup and the destination write are one action.

RemoveMealItem. Inputs: Date, MealType, and MealItem id. If the plan is gone, write nothing and raise no user-facing message. Remove the item, delete the meal when it has no items, and delete the plan when it has no meals.

Update DeleteRecipe, which already exists. Before it deletes, it checks MealItem. If any meal item has this RecipeId, it does not delete and it fails with the message "This recipe is used in meals and cannot be deleted." If none do, it deletes the recipe, and the child delete rules remove its ingredients and steps. Do not switch RecipeId to Ignore or Delete.

Do not add screens. Do not add a second asset, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a menu.
```

## Prompt 6 — Week summary and status

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Add a private structure WeeklySummary. It is not an entity and it is not public. Attributes: StartDate Date, EndDate Date, DaysWithMeals Integer, AverageCalories, AverageProtein, AverageCarbs, AverageFat, AverageSugar, AverageSodium, each Decimal.

Add a data action BuildWeeklySummary. Input: StartDate, a Date the screen has already aligned to the household week start, using the device's local date. Do not call a server CurrDate for "today". EndDate is six days after StartDate. Read MealPlan rows whose Date is in that inclusive range, with their meals and items. DaysWithMeals is the number of those plans that have at least one meal. Each average is that nutrient summed across the plans, divided by DaysWithMeals, or by 1 when DaysWithMeals is 0, then rounded to an integer. Output one WeeklySummary. Use aggregates. Do not add a SQL query. Do not store the summary.

Add two client actions, RangeStatus and MaxOnlyStatus. They do not write the database.

RangeStatus(value, min, max, tolerance) returns an empty status when any input is missing or not a number. Otherwise deviation is ((max + min) / 2) * (max(tolerance, 0) / 100). From min through max inclusive is InZone. Below min but at least min - deviation is LowWarning. Above max but at most max + deviation is HighWarning. Further below is LowDanger. Further above is HighDanger.

MaxOnlyStatus(value, max, tolerance) uses deviation max * (max(tolerance, 0) / 100). At or below max is InZone. At or below max + deviation is HighWarning. Above that is HighDanger. It never returns a low status.

Represent the five statuses so a screen can pick an icon. Do not add screens in this prompt.

Do not add a second asset, a service action, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a menu.
```

## Prompt 7 — Theme, menu, and sign-in

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none. Use the app theme that is already based on OutSystems UI. Do not add a library and do not create a theme library.

Set the app theme's icon library to Phosphor 2.0. Leave Public No. Do not add a second theme. Do not add CSS that tries to follow the operating-system light and dark setting. The theme documentation describes one theme.

Use two UI flows. AnonymousFlow uses LayoutBlank, which has no menu. MainFlow uses LayoutSideMenu.

On a wide screen the side menu stays available. On a narrow screen the same items are in a temporary menu, and the bar title is KWS Meal Planner, using the primary color. If LayoutSideMenu cannot expand on hover, keep the closest side menu that stays open on a wide screen and say that in the plan. Content column maximum width 1024 pixels, centered, padding 2rem, and 1rem below 600 pixels.

Menu items, in this order, with a divider before Settings. Phosphor Regular weight:

1. Dashboard, squares-four
2. Planning & Logging, clipboard-text
3. Recipes, fork-knife
4. Settings, gear
5. Recipe Sources, storefront
6. Logout, sign-out

If fork-knife or storefront is missing in the picker, pick the closest Phosphor icon and name the gap in the plan. Logout calls the Logout client system action, then opens Login.

Screens to add now. Do not add the business screens yet. You may add empty Dashboard, Planning, Recipes, Settings, and Sources screens only so the menu links resolve, with no business widgets. Mark Dashboard as the default screen. Those five require a signed-in user. Do not create a custom role.

Login, in AnonymousFlow, LayoutBlank, anonymous access. Title "Login to Your Account". Email and password. Email is required and must look like an email; otherwise "Required" or "Invalid e-mail". Password is required; otherwise "Required". The button says Login and is enabled only when the form is valid. It calls the Login client system action. Success opens Dashboard. Failure shows "Login failed. Please try again." and stays on Login. Forgot Password? opens RecoverPasswordRequest. Focus starts in Email. Do not call an external identity provider.

RecoverPasswordRequest and RecoverPasswordReset, anonymous, LayoutBlank. Use the platform's pre-built password screens. Request calls StartResetPassword. Reset calls FinishResetPassword. Cancel on the request screen opens Login. Do not invent a Firebase email message.

Error, in MainFlow, so it keeps the menu. Anonymous access, so a signed-out person can open it. Title "I find this failure to load to be disturbing." Subtitle "This is not the page you are looking for." Icon: Phosphor warning-circle, large. No buttons. There is no Death Star icon in Phosphor.

Do not add a second asset, a service action, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, or a publish inside this edit. Do not add menu items beyond the six above. Do not change Logout so that it opens a different screen.
```

## Prompt 8 — Dashboard

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Reuse Settings, MealPlan, Meal, MealItem, Recipe, BuildWeeklySummary, RangeStatus, and MaxOnlyStatus. Both screens require a signed-in user, live in MainFlow, and use the existing menu. Do not add a menu item.

Replace the empty Dashboard screen. Title "Today's Outlook". Compute today on the client from the device's local date. Do not use the server's UTC date.

Show six stat cards, in this order: Protein (g), Sugar (g), Carbs (g), Sodium (mg), Fat (g), Calories. The value is today's total for that nutrient, or 0 when today has no plan. Sugar uses MaxOnlyStatus against MaxDailySugar and Tolerance. The other five use RangeStatus against that nutrient's minimum, maximum, and Tolerance. Status icons, Phosphor: InZone circle Regular success, "In zone"; LowWarning arrow-down Bold warning, "Low warning"; LowDanger arrow-down Bold error, "Low danger"; HighWarning arrow-up Bold warning, "High warning"; HighDanger arrow-up Bold error, "High danger". The food icons on these cards have no close Phosphor name. Use the closest food icon the picker offers and name each gap in the plan. The Vue names were steak, candy, baguette, shaker, fries, and fire. Fire maps to Phosphor fire.

Show four meal cards: Breakfast, Lunch, Dinner, and Snacks. Breakfast, Lunch, and Dinner use those MealType records. Snacks uses the MealType Snack record. The displayed value is that meal's calories, or the text N/A when that meal is absent. A meal card opens DashboardMeal for that type. Phosphor coffee for Breakfast. The lunch, dinner, and snacks icons are gaps; pick the closest and record them.

Below the cards, show This Week and Next Week (Planning). Each uses BuildWeeklySummary for the week that starts on Settings.WeekStartDay. The client computes that start from the device date. A card shows the title, the range as M/d/yyyy - M/d/yyyy, "Days with Meals" and the count, and the six averages with the prefix Average and the same status icons. This Week opens the weekly plan for its start date. Next Week (Planning) opens the weekly plan for the following week. The weekly plan screen does not exist yet. Link to the screen name WeekPlan and pass the start date. Do not link to a different screen.

Add DashboardMeal. Input the meal type code breakfast, lunch, dinner, or snack. Headings Breakfast, Lunch, Dinner, and Snacks. Any other code shows "This meal type is not recognized." and no list. A known type with no items shows "No recipes planned for this meal today." Each item shows "Planned servings: {n}". When the recipe still exists, show the recipe name, description, cuisine, category, and the homemade or prepared metadata from the recipe screen's view, without status icons on nutrition. When the recipe is gone, show the item name as the heading and the text "Recipe unavailable." Close opens Dashboard.

Do not show previous weeks on Dashboard. Do not add Calculate Nutrition or the recipe generator. Do not add a second asset, a service action, a UserId, Firebase, Firestore, an AI model, an agentic app, a mobile app, or a publish inside this edit.
```

## Prompt 9 — Planning

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Reuse the menu, Settings, the meal entities, Recipe, Source, AddMealItem, UpdateMealItem, RemoveMealItem, and BuildWeeklySummary. Screens require a signed-in user and stay in MainFlow. Do not add a menu item.

Replace the empty Planning screen. Title "Planning & Logging". Section "Current Weeks" contains This Week and Next Week (Planning). Section "Recent Weeks" contains the four previous weeks, newest first. Week boundaries use Settings.WeekStartDay and the device's local date. A previous card's title is "Weeks Ago: {n}". Each card shows the same range, day count, and averages as Dashboard, and opens WeekPlan with that start date.

Add WeekPlan. Input the week start date. If it is missing or not a real date, open Error. Title "Weekly Plan". Show seven days starting on that date. A day with no meals shows "No meals have been entered". Otherwise list each meal that has items, in stored order, using the MealType label, so Snack is shown as Snack. Each item shows its stored name. Modify opens UpdateMealItemScreen with the week start, the plan, the meal type, and the item. Delete asks "Are you sure you want to delete this item from the meal?" with title "Are you sure?", buttons Yes and No, and the question icon. Yes calls RemoveMealItem and stays on WeekPlan. The day title's tooltip shows that day's six totals with status icons. The item's tooltip shows the item's six stored numbers with no status icons. Close opens the screen that opened WeekPlan, which is Dashboard or Planning. Add opens AddMealItemScreen and keeps the week start. The add icon is Phosphor plus.

Add AddMealItemScreen. Title "Add Meal Item". If the week start is missing or invalid, open Error. The editor offers the seven dates of that week, labeled like "Thursday, November 5", value as a Date. Meal types are Breakfast, Lunch, Dinner, Snack. Recipes show the recipe name, or the recipe name, a space, and the source name in parentheses when the recipe has a source. Servings defaults to 1. Changing the recipe sets the six nutrition inputs to the recipe's per-serving values multiplied by the current servings. Changing servings multiplies the current six values, including a typed override, by the new servings divided by the previous servings. Save is enabled when the form is valid. Save calls AddMealItem. The stored item name is the recipe name, not the label that includes the source. Save and Cancel both open WeekPlan for the same week start.

Add UpdateMealItemScreen. Title "Update Meal Item". It opens with the item's date, type, recipe, servings, and stored nutrition. Save is enabled when the form is valid and something changed. Save calls UpdateMealItem with the original date and original meal type plus the edited values, then opens WeekPlan for the same week start. Cancel opens that same WeekPlan. Use the same date limit, recipe labels, and scaling rules as add.

Nutrition inputs fail with "Required", "Must be zero or greater", or "Must be a valid number zero or greater". Servings must be a positive number. Date and meal type are required.

Do not add a second asset, a service action that splits the save, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a new menu. Do not send Save, Cancel, or Close anywhere other than the screens named here.
```

## Prompt 10 — Recipes

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Reuse Recipe, Ingredient, Step, Source, the static entities, AddRecipe, UpdateRecipe, and DeleteRecipe. Screens require a signed-in user and stay in MainFlow. The Recipes menu item already exists. Do not add another one.

Replace the empty Recipes screen. Title "My Recipes". Search placeholder "Search for a recipe...". Filters Category, Cuisine, and Calorie Range, each clearable. The ranges are 0-500, 501-750, 751-1000, and 1001+ with no upper bound. Split the search text on spaces. Every keyword must match. A keyword matches the name, the description, or an ingredient name by contains, ignoring case. It matches the kind only when the whole keyword equals homemade or prepared. It matches a source name by contains. Category, cuisine, and the calorie bounds are additional exact filters. Show "Displaying {shown} of {total} recipe" or "recipes" when the total is not 1. When the library is empty: "No recipes found." When the library is not empty and nothing matches: "No recipes match your search criteria." A card opens RecipeDetail. Add, Phosphor plus, opens PickRecipeType.

A card shows the name, category, cuisine, description, servings, and "{calories} kcal". Homemade also shows difficulty and the sum of prep and cook minutes. Prepared shows the source name, or UNKNOWN when the name is missing, and does not show difficulty or time. Chips use primary, secondary, and tertiary for the calorie chip.

Add PickRecipeType. Title "Pick a Recipe Type". Homemade, with Phosphor flame, text "Homemade" and "Simple to complex, some assembly is required.", opens AddHomemadeRecipe. Prepared, with Phosphor chef-hat, text "Prepared" and "Premade meals from a delivery service or restaurant.", opens AddPreparedRecipe. Cancel opens Recipes. If flame or chef-hat is missing, pick the closest Phosphor icon and record the gap.

Add AddHomemadeRecipe and AddPreparedRecipe. Cancel opens PickRecipeType. Save calls AddRecipe and opens Recipes.

Add RecipeDetail. Show the recipe. Close opens Recipes. Modify opens UpdateRecipe. Delete checks usage first. When any meal item still points at this recipe, show a notification titled "Recipe in use", message "This recipe is used in meals and cannot be deleted.", button OK, and stay on RecipeDetail. Do not ask for confirmation in that case, and do not delete. When no meal item uses it, ask "Are you sure you want to delete {name}?" with title "Are you sure?", buttons Yes and No. Yes calls DeleteRecipe and opens Recipes. Homemade shows difficulty, servings, prep minutes, cook minutes, ingredients, and steps. Prepared shows the source name and servings, and hides ingredients, steps, difficulty, and times. Description keeps line breaks. An ingredient whose unit Code is item prints the quantity and the name only. Every other ingredient prints the quantity, the unit Code, and the name. Nutrition on this screen has no status icons. Icons: chef-hat for difficulty, users for servings, clock for prep, timer for cook, storefront for source. Record a gap if a name is missing in the picker.

Add UpdateRecipe. Cancel opens RecipeDetail when the recipe still exists, otherwise Recipes. Save calls UpdateRecipe and opens RecipeDetail.

The editor sections are Basic Information, then Ingredients and Steps for homemade only, then Nutritional Information Per Serving. There is no Calculate Nutrition button and no recipe generator. Name is focused on open. Fields: Name placeholder "Enter the name of the recipe...", Description, Category, Cuisine, Servings, and for homemade Difficulty, Preparation Time (minutes), and Cooking Time (minutes). Prepared shows Source instead of Difficulty. Save is enabled when the form is valid and, on update, something changed. Buttons are Cancel and Save.

Validation messages: "Required"; while recipes are still loading, "Recipes are still loading"; duplicate name, quote, trimmed name, quote, space, already exists; servings "Must be a positive number"; times "Must be zero or greater"; nutrition "Required" and "Must be zero or greater". Ingredient units are required and positive. Ingredient name and unit are required. Step instruction is required. Deleting an ingredient asks "Are you sure you want to delete this ingredient?" Deleting a step asks "Are you sure you want to delete this step?" Yes and No. Enter in the ingredient name or the step instruction adds the next row.

Do not add a second asset, a service action, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a new menu. Do not send Save, Cancel, Close, Modify, or a card click anywhere other than the screens named here.
```

## Prompt 11 — Settings and sources

```text
Use Mentor to apply this change to the web app KWS Meal Planner. If another asset is in the session, or the type is not a web app, stop and report that asset's name and type. Use the asset key once it has been reported. Do not publish inside this edit, and do not deploy to another stage.

Released libraries this prompt may consume: none.

Reuse Settings, Source, Recipe, UpdateSettings, AddSource, UpdateSource, and DeleteSource. Screens require a signed-in user and stay in MainFlow. The Settings and Recipe Sources menu items already exist. Do not add a menu item.

Replace the empty Settings screen. Heading "KWS Meal Planner". Do not append a version number. Show one row of inputs for each of calories, protein, fat, carbs, and sodium, with Minimum Daily {Nutrient} and Maximum Daily {Nutrient} and the unit kcal, grams, grams, grams, and mg. Sugar is Maximum Daily Sugar (grams) only. Then Tolerance (%) and Week Start Day, the seven WeekDay labels. Reset restores the values last loaded from the Settings row. Save calls UpdateSettings and stays on Settings. There is no Cancel and no navigation after save. Save is enabled only when the form is valid and a value changed. Use the messages already enforced by UpdateSettings.

Replace the empty Sources screen. Title "Sources for Recipes". When the list is empty: "No sources found". A row opens UpdateSourceScreen. Hide the remove icon on a source with IsProtected true. If recipes fail to load, show "Recipes have failed to load, deletion of sources is disabled" and hide every remove icon. The remove icon is Phosphor x. If the source is used by a recipe, show a notification titled "Source in use", message "This source is used in recipes and cannot be deleted.", button OK, and do not delete. Otherwise ask "Are you sure you want to delete {name}?", title "Are you sure?", buttons Yes and No. Yes calls DeleteSource and stays on Sources. Add, Phosphor plus, opens AddSourceScreen.

Add AddSourceScreen. Labels Name, Description, and URL. Name placeholder "Enter the name of the food source...". Cancel opens Sources. Save calls AddSource and opens Sources.

Add UpdateSourceScreen. Same editor, loaded with the source. Cancel opens Sources. Save calls UpdateSource and opens Sources. Save is enabled when the form is valid and a value changed. The editor does not show or change IsProtected.

Name is required. A duplicate trimmed name, ignoring case, shows quote, the trimmed name, quote, space, already exists. A non-empty URL that is not http or https shows "Must be an http or https URL".

Do not add a second asset, a service action, a UserId, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside this edit, or a new menu. Do not send Save or Cancel anywhere other than Sources. Do not leave Settings after save.
```

## After the last prompt

The publish after prompt 11 is the Development revision that should run BootstrapOnPublish, if its schedule is "when published". If development would not accept that schedule, set it in the ODC Portal on the app's timer configuration, then publish again or run the timer once. Confirm one Settings row and one protected Generic Restaurant source. Do not import emulator accounts. Do not deploy KWS Meal Planner to another stage from these prompts.
