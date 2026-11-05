# Meal Planner — plan the move to OutSystems Developer Cloud

This file is the brief for a later analysis. Running it produces two new files, `architecture-odc.md` and `build-odc.md`. This brief does not design the assets, and it does not build them.

`extract.md`, `modules.md`, and `build.md` are the OutSystems 11 plan. Leave them as they are and do not use them as input (ignore them for the analysis). Developer Cloud has no modules, no Architecture Canvas, and no way to keep several deployable pieces inside one shared database transaction. Design the ODC assets from the Vue code and from the ODC documentation below.

Where the README and the code disagree, follow the code. Where a test and a comment disagree, follow the test.

While producing `architecture-odc.md` and `build-odc.md`, do not call OutSystems MCP, and do not generate OML, entities, screens, or a publish. The build host those files describe is OutSystems MCP used from Claude. Do not change any file other than `architecture-odc.md` and `build-odc.md`.

The documentation pages are JavaScript-rendered. If a plain fetch returns only a script warning, open the page and read it. Follow the in-page menu when the detail is on a child page. If a link in this brief cannot be opened, stop and say so. Do not guess in its place.

## Documentation

Start here. These are section roots.

1. OutSystems Developer Cloud: https://success.outsystems.com/documentation/outsystems_developer_cloud/
2. ODC for O11 developers: https://success.outsystems.com/documentation/outsystems_developer_cloud/odc_for_o11_developers/
3. App architecture: https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/
4. Building a well-architected app: https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/building_a_well_architected_app/
5. Reuse elements across apps: https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/reuse_elements_across_apps/
6. Service actions: https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/service_actions/
7. App architecture with multiple portfolios: https://success.outsystems.com/documentation/outsystems_developer_cloud/managing_outsystems_platform_and_apps/asset_portfolios/app_architecture_with_multiple_portfolios/

Use these while placing data, logic, and screens.

8. Libraries: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/libraries/
9. Data modeling: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/data_modeling/
10. Entities: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/data_modeling/entities/
11. Static entities: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/data_modeling/static_entities/
12. Relationships between entities: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/data_modeling/relationships_between_entities/
13. Best practices for data management: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/best_practices_for_data_management/
14. Structures: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/use_structures_and_records_to_create_compound_data_types/
15. Transactions, including service actions: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/fetch_data_from_the_database_in_outsystems/query_data_using_aggregates/transactions_in_external_entities/
16. Fetching and displaying data: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/screens/best_practices_for_fetching_and_displaying_data/
17. SQL: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/fetch_data_from_the_database_in_outsystems/query_data_using_sql/
18. Timers: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/use_timers/create_and_run_timers/
19. Publishing an app and a library: https://success.outsystems.com/documentation/outsystems_developer_cloud/deploying_assets/understanding_1_click_publish/
20. Language and elements, including the system actions: https://success.outsystems.com/documentation/outsystems_developer_cloud/outsystems_language_and_elements/

Use these for the interface, sign-in, and theme.

21. Screens, blocks, and layouts: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/screens/
22. Screen access: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/screens/best_practices_for_building_screens/
23. UI flows: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/ui_flows/
24. Themes: https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/themes/
25. End users: https://success.outsystems.com/documentation/outsystems_developer_cloud/user_management/managing_authorization_and_authentication_for_end_users/
26. Roles: https://success.outsystems.com/documentation/outsystems_developer_cloud/user_management/managing_authorization_and_authentication_for_end_users/secure_your_app_with_end_user_roles/
27. Authentication actions: https://success.outsystems.com/documentation/outsystems_developer_cloud/outsystems_language_and_elements/system_actions/authentication_system_actions/

Sign-in uses the built-in identity provider. The application does not call Firebase, and it has no AI feature. Do not read the Firebase AI or agentic-app documentation, and do not add an agentic app.

The ODC web app display name is KWS Meal Planner. Use that name for the asset, the narrow app bar, and the settings heading. The Vue app bar and `package.json` description say Meal Planner. That rename is requested. Record it in the differences table.

28. OutSystems MCP, the build host: https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/outsystems_mcp/
29. Delegation to Mentor: https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/outsystems_mcp/delegation_to_mentor/
30. Evolve an existing app, including publish: https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/outsystems_mcp/evolve_an_existing_app/
31. What a delegated Mentor edit can change: https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/ai_development_in_mentor_studio/capabilities_and_patterns_for_mentor_studio/

Claude is the MCP host. The OutSystems page names the validated host Claude Code. OutSystems MCP delegates each edit to Mentor on the server. Mentor is not a feature of this product, and the Mentor Studio panel is not the host. Follow the delegation page and the evolve page, including their sections on session expiry and publish.

https://success.outsystems.com/documentation/11/outsystems_mcp/ is the OutSystems 11 Service Studio server. Do not use it. The prompts in `build.md` are part of the ignored O11 plan.

The App architecture page also points at the cloud-native overview and at Agent Workbench. Follow the cloud-native overview. Skip Agent Workbench.

## Rules the design has to satisfy

Answer the questions in [Building a well-architected app](https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/building_a_well_architected_app/) against this household, then draw the assets. The O11 names are not candidates.

- An asset is a web app or a library. Each asset has its own lifecycle. ODC has no module inside an application. There is no Reactive Web module, no Service module, no Blank module, no theme module, and no agentic app. Names do not use `_CS`, `_BL`, `_Th`, `_CW`, `_API`, or `_Lib`.
- The application does not touch Firebase. No Firebase SDK, Firebase Auth, Firestore, Firebase AI, external entity, REST API, or import job stands in for the current database. Every business read and write uses an ODC entity or static entity. A value that users can change is an entity. A fixed list, such as a category or a unit, is a static entity.
- Leave out Calculate Nutrition, the recipe generator, and every other feature that needs AI. Nutrition fields stay on the recipe and the meal item, and the user types them.
- This product is one responsive web app. A mobile app and a mobile library are out of scope.
- Keep the current look and the current navigation. The Vue app is Vuetify Material Design 3 and follows the system light and dark theme. Reproduce that hierarchy, density, and color roles in the ODC theme, on top of OutSystems UI. [Themes](https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/themes/) is the mechanism. A screen keeps the same title, the same onward links, and the same cancel, close, and save destinations as the Vue page. The menu keeps the same items in the same order: Dashboard, Planning & Logging, Recipes, then Settings, Recipe Sources, and Logout. Wide screens use a permanent rail that expands on hover. Narrow screens use an app bar titled KWS Meal Planner and a temporary menu. Login and the error page stay outside the menu. When an OutSystems UI widget cannot reproduce a Vuetify behavior, use the closest widget and record the gap. Do not invent a new information architecture or a new visual design.
- This is one portfolio, one owner, and one sponsor. The two people who use it share one set of plans, recipes, sources, and settings. Cross-portfolio REST is out of scope. [App architecture with multiple portfolios](https://success.outsystems.com/documentation/outsystems_developer_cloud/managing_outsystems_platform_and_apps/asset_portfolios/app_architecture_with_multiple_portfolios/) is background, not a split to apply.
- Persistent entities live in a web app. [Libraries](https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/libraries/) are stateless. A library static entity is an enumeration with no database table. A static entity in an app is a table and can be the target of a foreign key.
- [Relationships](https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/data_modeling/relationships_between_entities/) inside one app can use Delete Rule Protect or Delete. A relationship that crosses apps is Ignore, and the database creates no constraint. Public entities of an app are read-only to other apps. Server actions can be public only in a library. An app exposes behavior to another app with a service action.
- A service action runs in its own transaction and commits when it returns. The caller cannot roll it back. [Transactions](https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/fetch_data_from_the_database_in_outsystems/query_data_using_aggregates/transactions_in_external_entities/) states that. Any save the Vue app treats as one write stays as server actions in the app that owns the rows. That includes creating a plan, a meal, and an item together, and moving an item from one date or meal type to another and then removing the emptied meal and plan.
- A library is a strong dependency. It is released with a version in the ODC Portal, and the consuming app bundles that version. [1-Click Publish](https://success.outsystems.com/documentation/outsystems_developer_cloud/deploying_assets/understanding_1_click_publish/) and [Libraries](https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/libraries/) describe the release. Add a library when some other asset will consume a stateless piece, such as a shared theme or a shared block. One household app with one owner does not meet that test. Say so if the design still adds one, and name the consumer.
- The [architecture page](https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/) allows a single app for one business need with one web interface. Use more than one web app only when the bounded contexts have different owners or different release cycles. If a split would turn a Protect rule into Ignore, or would split one save across service actions, stop and ask before adopting it.

## What to read

Read until the behavior is specific enough to name screens, entities, and actions. The README is the product intent. The implementation is under `src/`.

| Area                    | Where to look                                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routes                  | `src/pages/`. Folder structure is the URL. `src/pages/index.vue` redirects.                                                                                           |
| Shell                   | `src/layouts/`, including `default.vue`, `standalone.vue`, and the desktop and mobile menus.                                                                          |
| Look and feel           | `src/plugins/vuetify.ts`, `src/styles/`, and the status marker in `src/components/core/NutritionalStatusMarker.vue`.                                                  |
| Screens and editors     | `src/components/`, grouped by recipes, sources, planning, meals, portions, settings, and auth.                                                                        |
| Firestore access        | `src/data/`.                                                                                                                                                          |
| Domain types            | `src/models/`.                                                                                                                                                        |
| Rules that are not CRUD | `src/core/`, especially dates, weekly summaries, validation, and authentication. `nutrition-generator.ts` and `recipe-generator.ts` are the AI features to leave out. |
| Who may open a route    | `src/router/index.ts` and each page's `<route>` block.                                                                                                                |
| Who may read and write  | `firestore.rules`.                                                                                                                                                    |
| Bootstrap data          | `seed-data/`.                                                                                                                                                         |
| Specified behavior      | Co-located `__tests__` directories.                                                                                                                                   |

Trace these behaviors from the code. Cite the file that decides each one.

- Sign-in, sign-out, password reset, and which routes skip the auth guard.
- Whether plans, recipes, sources, and settings are household-wide. Confirm there is no user id on the business documents, and confirm what `firestore.rules` actually allows.
- Categories, cuisines, units, difficulty, recipe kind, meal slots, and the week-start day. Note which lists are fixed and which rows users can edit.
- Sources, including the seeded restaurant row and the rules that block delete.
- Settings fields, defaults, validation, and the color rules for a nutrient that has a min and a max versus one that has only a max.
- Homemade and prepared recipes, ingredients, steps, and the nutrition fields. The user types the nutrition values. Leave out the Calculate Nutrition button and every call it makes.
- A meal item's snapshot: what is copied from the recipe, what scaling does, and what an override stores.
- Adding, editing, and removing an item, including a change of date or meal type and the cleanup of an empty meal or an empty plan.
- Dashboard, planning list, week, and the dashboard meal-type destination. Record the destination as it is, including a placeholder.
- The path taken after every save, cancel, close, and card click. The ODC screen goes to the same place.
- The shell for a wide screen and a narrow screen, which screens use the standalone layout, and the icon and label of each menu item. Map each Material Design icon to the icon library chosen in the theme. The theme documentation offers Phosphor and Font Awesome.
- Search: which fields, which filters, and the calorie ranges.
- Validation and confirmation copy that a screen actually shows.
- Leave out the recipe generator. Do not carry it into the design.

The ODC application does not reference Firebase.

- Sign-in, sign-out, and password reset use the built-in identity provider and the client actions in the authentication documentation. Business entities do not gain a `UserId`.
- Map each Firestore collection to an entity or a static entity in the owning web app. No data conversion and no import of `seed-data`.
- A timer that runs on publish may insert a missing bootstrap row into an ODC entity. Timers are UTC. Follow the timer documentation.
- Calculate Nutrition and the recipe generator are omitted. Record that omission in the differences table. The reason is this brief.

`seed-data/auth_export/accounts.json` contains account material. Do not copy emails, passwords, hashes, or tokens into either deliverable. Describe the seed as "the emulator has user accounts" and stop there.

## `architecture-odc.md`

Write the ODC design a person can implement without re-reading the Vue app. Replace the file if it already exists.

Include:

1. **What the application does.** Household scope, the screens a signed-in person can reach, and the writes each screen performs. Cite the Vue file for behavior that contradicts the README.
2. **The architecture answers.** Walk the seven questions in [Building a well-architected app](https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/building_a_well_architected_app/). Name the business concepts, the owner, the sponsor, the bounded contexts, and the non-functional requirements that matter here: one shared database, referential integrity, and a single transaction for a meal-item change. State the portfolio assumption.
3. **Assets.** For each asset: display name, asset type, why it exists, what it owns, and what it must not contain. A diagram of dependencies, each edge marked strong or weak. The implementation order, including a library release before any consumer can add it.
4. **Data.** Entities and static entities, the asset that owns each, attributes and data types, mandatory flags, unique indexes, and delete rules. Structures that exist only to pass a nutrition snapshot or a week summary. Public or not, and why. Follow [Best practices for data management](https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/data_management/best_practices_for_data_management/) for settings, text length, and indexes. Identifier attributes stay the platform default unless the code needs a stable natural key, and then say why.
5. **Logic.** Server actions inside the owning app for writes. Service actions only where another asset calls them, with the transaction consequence written down. Library server actions only when the action is public and stateless. Name the action, its inputs, the failure messages the Vue app shows, and which Vue function it replaces.
6. **Interface.** Screens, the UI flow, anonymous versus authenticated, blocks worth naming, and the menu. For each screen, name the Vue page it replaces and where save, cancel, close, and each card click go. Theme lives in the web app, based on OutSystems UI, unless a library is justified above. State the color roles, the light and dark behavior, the status treatment, and the icon mapping. Layout is responsive. The desktop rail and the phone menu are the same items, in the Vue order. Login and the error page have no menu.
7. **Identity.** Built-in users. Roles only if the code distinguishes them. These two people have the same access. Login, logout, and password reset use the system actions. Screens that require a signed-in user say so.
8. **Data access.** Every read and write is an ODC entity or static entity, and the design says which is which. The design contains no Firebase client, Firestore collection, external entity, REST API, AI model, or agentic app. Calculate Nutrition and the recipe generator are omitted. The user types the nutrition values.
9. **Behavior the design changes.** A table of differences from the Vue app. Omitting Firebase, Calculate Nutrition, and the recipe generator is required by this brief. A change to navigation or to the look needs an OutSystems UI limitation as its reason. Any other difference needs a reason from the ODC rules or from the code. A difference that is only a preference is a question, not a decision.
10. **Left out.** Firebase, Calculate Nutrition, the recipe generator, any other AI feature, an agentic app, native mobile, per-user data, a second portfolio, data migration, and an OutSystems 11 module layout.

## `build-odc.md`

Write the prompts that build the design in `architecture-odc.md`. Replace the file if it already exists.

The host is Claude, connected to the ODC OutSystems MCP server. The validated host name in the OutSystems MCP documentation is Claude Code. Each prompt is one edit. Claude delegates that edit to Mentor, which changes the app model on the server. Follow [OutSystems MCP](https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/outsystems_mcp/), [Delegation to Mentor](https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/outsystems_mcp/delegation_to_mentor/), and [Evolve an existing app](https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/outsystems_mcp/evolve_an_existing_app/). What the delegated edit can contain follows [Capabilities and patterns for Mentor Studio](https://success.outsystems.com/documentation/outsystems_developer_cloud/agentic_development/ai_development_in_mentor_studio/capabilities_and_patterns_for_mentor_studio/).

Work on one app in one session. A prompt does not switch assets, release a library, or deploy to another stage. The edit itself does not publish. After the turn finishes, read the summary and confirm the change was applied. Then say "Publish the change." The agent restates the publish and waits for confirmation. Publishing writes a Development revision. Wait until that publish finishes before the next prompt. A Mentor session discards unpublished edits when it goes idle, so publish before a long pause. Do not start a second publish while one is still running. Do not deploy to QA or Production from these prompts.

Setup, before the first prompt:

1. From Claude, create each asset in the design with the correct type. A web app is a web app. A library is a library. The web app name is KWS Meal Planner. Do not create an OutSystems 11 application and do not create modules.
2. Leave the assets empty of business entities and screens. The prompts add those.
3. When the design includes a library, publish it and release a version before any prompt that consumes it. An app can add a library element only after that release.
4. For each prompt: in the session for that asset, send the prompt, and wait until the turn finishes. Confirm the result, publish, and wait until the publish finishes.

Every prompt includes:

- The asset's name and type. If another asset is in the session, or the type is wrong, stop and report the name and type. Use the asset key once the agent reports it.
- The released libraries it may consume, or none.
- The elements to add, in enough detail to match `architecture-odc.md` without reading the Vue app.
- What the agent must not add: a second asset, a service action that splits a single save, a `UserId` on household data, Firebase, Firestore, an AI model, an agentic app, Calculate Nutrition, the recipe generator, a mobile app, a publish inside the edit, a deploy to another stage, a new menu, or a screen whose next step differs from `architecture-odc.md`.

Scope each prompt so the review is one coherent slice. A web app that holds the whole product gets several prompts in dependency order: reference data, then each aggregate that other data points at, then the writes that must stay in one transaction, then the shell and sign-in, then each screen group. A prompt that would fill more than one of those slices is two prompts.

## If you are unsure

Ask, then wait. In particular, ask before:

- More than one web app, or any library.
- Changing a delete, a validation message, or the unfinished dashboard meal page from what the Vue app does.
- A navigation or visual change that is not forced by an OutSystems UI limitation.
- Putting a foreign key across assets, which drops both the database constraint and Protect.
