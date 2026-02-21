# Meal Planner Project Instructions

This is a Vue 3 + TypeScript + Vuetify + Firebase meal planning application using Vite and pnpm.

## Architecture

### Tech Stack

- **Frontend**: Vue 3 (Composition API with `<script setup>`), TypeScript, Vuetify 3 (Material Design components)
- **Backend**: Firebase (Authentication, Firestore)
- **Build**: Vite with auto-imports for components, pages, and routes
- **Testing**: Vitest + @vue/test-utils

### Project Structure

- `src/components/`: Auto-imported Vue components (use multi-word names, no manual imports needed)
- `src/pages/`: Auto-converted to routes via `unplugin-vue-router` (e.g., `foods/[id]/index.vue` → `/foods/:id`)
- `src/layouts/`: Reusable layouts (`default` for main app, `standalone` for login)
- `src/data/`: Composables for Firestore operations (prefix with `use*`, e.g., `useFoodsData()`)
- `src/core/`: Business logic composables (`useAuthentication()`, `useRecipeGenerator()`)
- `src/models/`: TypeScript interfaces for domain entities (`FoodItem`, `Recipe`, `Portion`)

### Key Patterns

#### Composables Pattern

All data access and business logic uses composable functions returning reactive state:

```typescript
// Data layer example (src/data/foods.ts)
export const useFoodsData = () => {
  const db = useFirestore();
  const foods = useCollection<FoodItem>(collection(db, 'foods'));
  const addFood = async (food: FoodItem) => {
    /* ... */
  };
  return { foods, addFood, updateFood, removeFood };
};
```

#### Auto-imports

- Components in `src/components/` are globally available (no import statements)
- Pages in `src/pages/` become routes automatically (folder structure = URL structure)
- Use `<route lang="yaml">` block in page components to set metadata (e.g., `meta: { layout: standalone }`)

#### Testing Mocks

- Create manual mocks in `src/data/__mocks__/` and `src/core/__mocks__/`
- Use `vi.mock('@/data/foods')` to auto-swap real composables with mocks
- Example: `src/data/__mocks__/foods.ts` exports mocked `useFoodsData` with vi.fn() methods

#### Firebase Integration

- Use VueFire composables: `useFirestore()`, `useCollection()`, `useCurrentUser()`
- Authentication via `useAuthentication()` composable in `src/core/authentication.ts`
- Router has `checkAuthStatus` guard (routes need `meta: { allowAnonymous: true }` to skip auth)

## Development Workflow

### Commands

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm test             # Run tests once
pnpm test:dev         # Watch mode for tests
pnpm test:cov         # Generate coverage reports
pnpm lint             # ESLint check
pnpm build            # Production build
pnpm emulate          # Firebase emulators with seed data
```

### Testing

- Vitest with jsdom environment
- Vuetify components require manual vuetify instance in tests:

```typescript
const vuetify = createVuetify({ components, directives });
mount(Component, { global: { plugins: [vuetify] } });
```

- Mock Firebase/VueFire composables: `vi.mock('@/core/authentication')`
- Coverage excludes: `.d.ts`, config files, models, plugins, router, root-level `.vue`/`.ts`

### Release Process

1. `pnpm changeset` - Document changes in branch
2. Code, test, commit, PR, merge
3. When ready to release: `pnpm bump` (updates version), commit, tag (`vX.Y.Z`), push with tags
4. `pnpm release` - builds and deploys to Firebase

## Code Conventions

- **Components**: Multi-word PascalCase names (e.g., `FoodListItem.vue`), except pages (lowercase OK for URL paths)
- **Composables**: Prefix with `use`, return reactive state + methods: `const { user, login, logout } = useAuthentication()`
- **Tests**: Co-located in `__tests__/` folders, named `*.spec.ts`
- **Types**: Centralized in `src/models/`, use TypeScript interfaces for domain entities
- **Minimal comments**: Explain "why", not "what" (code should be self-documenting)

## ESLint Rules

- `no-console/debugger`: Warn in production only
- `vue/multi-word-component-names`: Off for pages/layouts (single-word OK for routes)
- `@typescript-eslint/no-explicit-any`: Off (pragmatic for rapid development)

## GitHub Issue Templates

### Feature Request Structure

```markdown
---
name: Feature
about: I have an awesome idea
title: ''
type: feature
assignees: ''
---

# Synopsis

[Brief description of the feature]

# User stories

1. As a user, I would like to...

# Processes

[Key workflows or processes affected]

# Components

[Components/files that will be created or modified]

# Acceptance Criteria

- [ ] [Testable criteria for completion]
```

### Task Structure

```markdown
---
name: Task
about: Just do it!
title: ''
type: task
assignees: ''
---

# User Story

As a user, I would like to...

# Details

[Implementation details, technical considerations]

# Acceptance Criteria

- [ ] [Testable criteria for completion]
```

**Subtasks**: When generating subtasks, **DO NOT create files**. Instead, output the complete markdown for each subtask in the chat only. The user will manually create GitHub issues from the provided markdown. Link subtasks to the parent Feature/Task using GitHub's task list syntax or by referencing the issue number (e.g., "Related to #123").

## Pull Request Reviews

### Focus Areas

- **Security**: No hardcoded secrets, proper input validation, auth checks
- **Performance**: Avoid inefficient algorithms (watch for O(n²) operations)
- **Testing**: Adequate coverage for new features, especially data operations
- **Comments**: Minimal, explain "why" not "what"

### Review Style

- Provide specific, actionable feedback with code examples
- Acknowledge good patterns and creative solutions
- Link to best-practices documentation when relevant
- Focus on improvement, not criticism

### Review Comment Format

**Issue:** Describe what needs attention  
**Suggestion:** Provide specific improvement with code example  
**Why:** Explain reasoning and benefits  
**Documentation:** Link to best-practices if applicable

### Review Labels

- 🔒 Security concerns (immediate attention)
- ⚡ Performance issues/optimizations
- 🧹 Code cleanup and maintainability
- 📚 Documentation gaps
- ✅ Positive feedback
- 🚨 Critical blockers
- 💭 Questions for discussion

## Test Planning Workflow

When asked to create a test plan for TODO comments (e.g., "create a test plan for TODOs in @file"):

### Process

1. **Search for TODO comments**: Look for comments matching the pattern `TODO: Copilot <description>` in the specified file(s)
2. **Analyze context**: Examine the surrounding test structure:
   - Parent describe blocks and their purpose
   - Related test cases (before/after the TODO)
   - Setup and teardown code (beforeEach/afterEach)
   - Mock configurations and test data used
3. **Find reference patterns**: Search the same test file for similar test cases that:
   - Test comparable functionality
   - Use similar component interactions
   - Follow the same assertion patterns
4. **Understand component behavior**: If testing Vue components, examine the source component file to understand:
   - Event handlers and emitted events
   - Props and their usage
   - Conditional rendering logic (v-if, v-show)
   - Data flow between components
5. **Determine implementation status**: Check if the feature being tested exists in the source code
   - If feature exists: Tests can be implemented immediately
   - If feature missing: Note that tests will fail until feature is implemented (TDD approach)
6. **Create PLAN.md**: Generate a detailed plan file in the same directory as the test file

### PLAN.md Structure

For each TODO test case, include:

#### Test Location

- Line number and nesting context (describe block hierarchy)
- Test case name

#### Context

- What scenario is being tested
- What user workflow or interaction is covered
- Where in the test suite it fits (e.g., "within add button > click > on save")
- **Implementation status**: Whether feature exists or needs to be built (TDD)

#### Implementation Plan

**Setup:**

- List all setup steps needed (mock data, component mounting, state preparation)
- Include specific method calls with parameters
- Note any async operations requiring `await` or `flushPromises()`

**Test Actions:**

- Specific user interactions to simulate (button clicks, event emissions)
- Component queries needed (findComponent, findAllComponents)
- Event emissions with their payloads

**Assertions:**

- Expected component visibility states
- Expected prop values
- Expected DOM states
- Expected method calls (for TDD)
- Use specific matcher syntax from the test framework

**Pattern Reference:**

- Link to similar tests in the same file (by line number)
- Note any test patterns being followed
- Reference test data structures used

#### Key Implementation Notes

- Component behavior excerpts from source code
- Test data structures and their contents
- Testing utilities and their usage patterns
- Similar patterns in other parts of the test suite
- **If TDD**: Code changes required for tests to pass

#### Why This Test Matters

- Explain the user workflow being validated
- Note what could break without this test
- Clarify the relationship to other tests

### TDD vs. Testing Existing Functionality

When planning tests, clearly indicate whether:

- **TDD Mode**: Feature doesn't exist yet
  - Tests will fail initially (this is expected)
  - Include code snippets showing what needs to be implemented
  - Mark tests as "failing" in the plan
  - Example: "This test will fail until `updateMealPlan` is called instead of `addMealPlan`"

- **Testing Existing Functionality**: Feature already exists
  - Tests should pass immediately (or reveal bugs)
  - Reference existing code that implements the behavior
  - Example: "The component already has `setMeal` which sets `isDirty = true`"

### Output Format

- Create a single PLAN.md file (do not modify any code)
- Use clear markdown formatting with headers and code blocks
- Include code examples from existing tests where helpful
- Provide specific line number references
- Make the plan detailed enough that implementation is straightforward
- **Clearly label** whether tests are for TDD (will fail initially) or existing functionality (should pass)

### Example Request Patterns

These phrases should trigger this workflow:

- "create a test plan for TODOs in @file"
- "plan the TODO tests in @file"
- "generate a plan for the TODO comments in @file"
- "help me plan the missing tests in @file"

### Implementation After Planning

When asked to implement tests from a plan:

- **If user requests TDD style**: Create failing tests first, note what needs to be implemented
- **If user requests implementation**: Create tests that should pass for existing functionality
- Always verify if tests pass or fail and explain why
- For TDD tests that fail, provide clear guidance on what code changes are needed
