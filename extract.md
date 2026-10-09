Use the following OutSystems 11 documentation as grounding. Each link is a section root. Follow the in-page menu when the answer is on a child page. These pages are JavaScript-rendered. If a plain fetch returns only a script warning, open the page and read it. If you cannot use a link, stop and say so. Do not guess in its place.

1. Getting started: https://success.outsystems.com/documentation/11/getting_started/
2. Architecture: https://success.outsystems.com/documentation/11/app_architecture/
3. Building apps: https://success.outsystems.com/documentation/11/building_apps/
4. OutSystems MCP: https://success.outsystems.com/documentation/11/outsystems_mcp/
5. Service modules: https://success.outsystems.com/documentation/11/building_apps/reusing_and_refactoring/use_services_to_expose_functionality/

Read this project until you understand the code and what the application does. Where the README and the code disagree, follow the code.

Then do both tasks below. `modules.md` and `build.md` are the deliverables. Replace them if they already exist. Do not change any other file. Do not connect to the OutSystems MCP, and do not generate OutSystems code.

## Modules

Write `modules.md`.

Report the OutSystems 11 modules required, with properly formatted names, the application each module belongs to, the module type, and the planned contents of each module. This is a greenfield application. Firebase will not be used. Represent the current Firestore data as OutSystems entities or static entities. No data conversion is required.

Module type is part of the design, not a default:

- A module that contains screens, blocks, client actions, or a theme is a Reactive Web module.
- A module that contains only server-side elements, such as entities, static entities, structures, server actions, and timers, is a Service module. Do not make that module Reactive Web merely because the end-user application is Reactive Web.
- Inside a Service module, expose public Server Actions for this application. Do not expose Service Actions. There is one consumer and one release cycle, and a change such as moving a meal item must stay in the caller's transaction. Service Actions are a later choice for a large portfolio with independent release cycles, as described in the service-module documentation.

## Build prompts

Write `build.md`.

Report the distinct prompts required to build the application with Claude Code and the OutSystems MCP. Each prompt runs against the single module open in Service Studio. Make every prompt complete enough to run on its own.

Scope each prompt so a person can review the result before the next one. When one module needs two large, distinct tasks, write two prompts in the order they must be run. Say which module must be open, which published modules it references, and what the agent must not do. Tell the agent to stop if the open module has the wrong name or the wrong module type.

The setup steps must tell the person to create Service modules and Reactive Web modules correctly before the first prompt.

## If you are unsure

Do not choose silently. Ask, then wait.
