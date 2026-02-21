# Test Plan: Delete Meal Functionality (TDD)

## Overview

There are **20 TODO test cases** in `day.spec.ts` that need to be implemented for the meal deletion functionality. All tests should be created **TDD style** - the feature does not yet exist in the component, so tests will fail initially.

The delete functionality pattern is repeated for all 4 meal types (Breakfast, Lunch, Dinner, Snack), each with 5 tests.

## Implementation Status: ❌ NOT IMPLEMENTED (TDD)

The `day.vue` component does NOT currently handle the `@delete` event from MealView. Tests will fail until the component is updated to:

1. Handle delete events from MealView
2. Display a confirmation dialog
3. Remove the meal on confirm
4. Restore the add button after deletion
5. Track dirty state when deleting meals

---

## Test Pattern (Repeated for Each Meal Type)

### Test Location Pattern

Each meal type (breakfast/lunch/dinner/snack) has 5 delete tests:

- **Breakfast**: Lines 270-294
- **Lunch**: Lines 466-490
- **Dinner**: Lines 662-686
- **Snack**: Lines 858-882

### Context

These tests are within each meal type's "view" describe block. They test the complete deletion workflow:

1. User clicks delete button on a meal view
2. Confirmation dialog appears
3. User confirms or denies
4. Meal is removed (or not) based on confirmation

---

## Test 1: "displays the confirmation dialog"

### Location (per meal type)

- Breakfast: Line 271
- Lunch: Line 467
- Dinner: Line 663
- Snack: Line 859

### Context

In the "[meal] view > the delete event" describe block. Tests that clicking delete shows a confirmation dialog.

### Implementation Plan

**Setup:**

1. Mock `getMealPlanForDate` to return `FULL_MEAL_PLAN` (has existing meals)
2. Mount the page with `await renderPage()`
3. This loads the meal view for the specific meal type

**Test Actions:**

1. Find the meal view: `wrapper.findComponent('[data-testid="breakfast-view"]')` (adjust for each meal)
2. Cast to `VueWrapper<any>` to access vm
3. Emit delete event: `await mealView.vm.$emit('delete')`
4. Flush promises: `await flushPromises()`

**Assertions:**

1. Find ConfirmDialog: `const confirmDialog = wrapper.findComponent(ConfirmDialog)`
2. Verify it exists: `expect(confirmDialog.exists()).toBe(true)`

**Pattern Reference:**

- Similar to `/src/pages/recipes/[id]/__tests__/index.spec.ts` lines 97-105
- Imports ConfirmDialog component at top of file
- Uses `flushPromises()` after emitting delete

**Example (Breakfast):**

```typescript
import ConfirmDialog from '@/components/core/ConfirmDialog.vue';

it('displays the confirmation dialog', async () => {
  const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
  getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
  wrapper = await renderPage();
  const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
  await breakfastView.vm.$emit('delete');
  await flushPromises();
  const confirmDialog = wrapper.findComponent(ConfirmDialog);
  expect(confirmDialog.exists()).toBe(true);
});
```

---

## Test 2: "removes the view" (on confirm)

### Location (per meal type)

- Breakfast: Line 276
- Lunch: Line 472
- Dinner: Line 668
- Snack: Line 864

### Context

In the "[meal] view > the delete event > on confirm" describe block. Tests that confirming deletion removes the meal view from display.

### Implementation Plan

**Setup:**

1. Mock `getMealPlanForDate` to return `FULL_MEAL_PLAN`
2. Mount the page with `await renderPage()`

**Test Actions:**

1. Find the meal view: `wrapper.findComponent('[data-testid="breakfast-view"]')`
2. Emit delete: `await breakfastView.vm.$emit('delete')`
3. Flush promises: `await flushPromises()`
4. Find confirmation dialog: `wrapper.findComponent(ConfirmDialog)`
5. Emit confirm: `await confirmDialog.vm.$emit('confirm')`
6. Flush promises: `await flushPromises()`

**Assertions:**

1. Find meal view again: `wrapper.findComponent('[data-testid="breakfast-view"]')`
2. Verify it no longer exists: `expect(breakfastView.exists()).toBe(false)`

**Pattern Reference:**

- Similar to modify tests (lines 262-268) but in reverse
- Similar to recipe delete test (lines 108-118)
- Uses confirm event instead of cancel

**Example (Breakfast):**

```typescript
it('removes the view', async () => {
  const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
  getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
  wrapper = await renderPage();
  const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
  await breakfastView.vm.$emit('delete');
  await flushPromises();
  const confirmDialog = wrapper.findComponent(ConfirmDialog);
  await confirmDialog.vm.$emit('confirm');
  await flushPromises();
  expect(wrapper.findComponent('[data-testid="breakfast-view"]').exists()).toBe(false);
});
```

---

## Test 3: "displays the add button" (on confirm)

### Location (per meal type)

- Breakfast: Line 280
- Lunch: Line 476
- Dinner: Line 672
- Snack: Line 868

### Context

In the "[meal] view > the delete event > on confirm" describe block. Tests that after confirming deletion, the add button for that meal reappears.

### Implementation Plan

**Setup:**
Same as Test 2

**Test Actions:**
Same as Test 2

**Assertions:**

1. Find add button: `wrapper.findComponent('[data-testid="add-breakfast-button"]')`
2. Verify it exists: `expect(addButton.exists()).toBe(true)`

**Pattern Reference:**

- Inverse of "does not exist if the meal plan has a breakfast" test (line 261)
- Similar to cancel meal flow showing add button (line 162)

**Example (Breakfast):**

```typescript
it('displays the add button', async () => {
  const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
  getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
  wrapper = await renderPage();
  const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
  await breakfastView.vm.$emit('delete');
  await flushPromises();
  const confirmDialog = wrapper.findComponent(ConfirmDialog);
  await confirmDialog.vm.$emit('confirm');
  await flushPromises();
  const addButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
  expect(addButton.exists()).toBe(true);
});
```

---

## Test 4: "does not remove the view" (on deny)

### Location (per meal type)

- Breakfast: Line 286
- Lunch: Line 482
- Dinner: Line 678
- Snack: Line 874

### Context

In the "[meal] view > the delete event > on deny" describe block. Tests that canceling deletion keeps the meal view displayed.

### Implementation Plan

**Setup:**
Same as Test 2

**Test Actions:**

1. Find meal view and emit delete
2. Flush promises
3. Find confirmation dialog
4. Emit **cancel** (not confirm): `await confirmDialog.vm.$emit('cancel')`
5. Flush promises

**Assertions:**

1. Find meal view: `wrapper.findComponent('[data-testid="breakfast-view"]')`
2. Verify it still exists: `expect(breakfastView.exists()).toBe(true)`

**Pattern Reference:**

- Similar to recipe delete cancel test (lines 135-146)
- Opposite assertion from Test 2 (should exist, not be removed)

**Example (Breakfast):**

```typescript
it('does not remove the view', async () => {
  const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
  getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
  wrapper = await renderPage();
  const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
  await breakfastView.vm.$emit('delete');
  await flushPromises();
  const confirmDialog = wrapper.findComponent(ConfirmDialog);
  await confirmDialog.vm.$emit('cancel');
  await flushPromises();
  expect(wrapper.findComponent('[data-testid="breakfast-view"]').exists()).toBe(true);
});
```

---

## Test 5: "does not display the add button" (on deny)

### Location (per meal type)

- Breakfast: Line 290
- Lunch: Line 486
- Dinner: Line 682
- Snack: Line 878

### Context

In the "[meal] view > the delete event > on deny" describe block. Tests that canceling deletion keeps the add button hidden.

### Implementation Plan

**Setup:**
Same as Test 4

**Test Actions:**
Same as Test 4

**Assertions:**

1. Find add button: `wrapper.findComponent('[data-testid="add-breakfast-button"]')`
2. Verify it does not exist: `expect(addButton.exists()).toBe(false)`

**Pattern Reference:**

- Similar to "does not exist if the meal plan has a breakfast" test (line 261)
- Opposite of Test 3

**Example (Breakfast):**

```typescript
it('does not display the add button', async () => {
  const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
  getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
  wrapper = await renderPage();
  const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
  await breakfastView.vm.$emit('delete');
  await flushPromises();
  const confirmDialog = wrapper.findComponent(ConfirmDialog);
  await confirmDialog.vm.$emit('cancel');
  await flushPromises();
  const addButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
  expect(addButton.exists()).toBe(false);
});
```

---

## Additional TODO: Save Button Enable on Delete

### Location

- Line 978: "add TDD tests verifying that deleting a meal enables the save button" (for existing meal plan)
- Line 1046: "add TDD tests verifying that deleting a meal enables the save button" (for new meal plan)

### Context

These TODOs indicate missing tests for verifying that the save button becomes enabled when a meal is deleted. This would be similar to the "is enabled if [meal] is modified" tests.

### Implementation Plan

For each meal type (breakfast, lunch, dinner, snack), add tests in both contexts:

**For existing meal plan (line 978):**

```typescript
it('is enabled if breakfast is deleted', async () => {
  const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
  await breakfastView.vm.$emit('delete');
  await flushPromises();
  const confirmDialog = wrapper.findComponent(ConfirmDialog);
  await confirmDialog.vm.$emit('confirm');
  await flushPromises();
  const button = wrapper.findComponent('[data-testid="save-button"]');
  expect(button.attributes('disabled')).toBeUndefined();
});
```

Repeat for lunch, dinner, snack.

**For new meal plan (line 1046):**
Similar pattern but starting with a new meal plan:

1. Add a meal (to have something to delete)
2. Delete it
3. Verify save button is enabled (isDirty should be true)

---

## Implementation Notes

### Component Changes Required (NOT in scope for tests)

The `day.vue` component needs to be updated to handle delete events:

1. **Add delete handler function:**

```typescript
const deleteMeal = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
  showDeleteConfirmation.value = true;
  mealToDelete.value = mealType;
};
```

2. **Add confirmation dialog state:**

```typescript
const showDeleteConfirmation = ref(false);
const mealToDelete = ref<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | null>(null);
```

3. **Add confirm/cancel handlers:**

```typescript
const confirmDelete = () => {
  if (mealToDelete.value) {
    const mealRef = mealRefs[mealToDelete.value];
    if (mealRef && mealRef.value) {
      mealRef.value.item = undefined;
      isDirty.value = true;
    }
  }
  showDeleteConfirmation.value = false;
  mealToDelete.value = null;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  mealToDelete.value = null;
};
```

4. **Update template to handle delete events:**

```vue
<MealView
  v-if="breakfast.item && !breakfast.isEditing"
  :meal="breakfast.item"
  @modify="breakfast.isEditing = true"
  @delete="deleteMeal('Breakfast')"
  data-testid="breakfast-view"
/>

<ConfirmDialog
  v-if="showDeleteConfirmation"
  question="Are you sure you want to delete this meal?"
  @confirm="confirmDelete"
  @cancel="cancelDelete"
/>
```

5. **Import ConfirmDialog:**

```typescript
import ConfirmDialog from '@/components/core/ConfirmDialog.vue';
```

### Test Data

- **FULL_MEAL_PLAN**: Test data with all 4 meals populated
  - `meals[0]`: Breakfast
  - `meals[1]`: Lunch
  - `meals[2]`: Dinner
  - `meals[3]`: Snack

### Testing Utilities

- **ConfirmDialog**: Component for confirmation prompts
  - Emits: `confirm`, `cancel`
  - Should be imported: `import ConfirmDialog from '@/components/core/ConfirmDialog.vue';`
- **flushPromises()**: Needed after emitting delete and confirm/cancel events
- **VueWrapper<any>**: Cast needed to access `vm.$emit()`

### Why These Tests Are TDD

The component currently does NOT:

- ❌ Handle `@delete` events from MealView
- ❌ Show a confirmation dialog
- ❌ Remove meals when confirmed
- ❌ Set `isDirty` when deleting meals

All 20+ tests will **fail** until the component is updated with the code shown in "Component Changes Required".

---

## Summary

**Total Tests to Implement: 24**

### Delete Workflow Tests (20 tests)

- **Breakfast**: 5 tests (lines 271-293)
- **Lunch**: 5 tests (lines 467-489)
- **Dinner**: 5 tests (lines 663-685)
- **Snack**: 5 tests (lines 859-881)

### Save Button Enable Tests (4 tests)

- **Existing meal plan**: 4 tests (one per meal type) at line 978
- **New meal plan**: Would require separate tests but noted at line 1046

### Test Pattern (per meal type)

1. ✅ Show confirmation dialog on delete
2. ✅ Remove view on confirm
3. ✅ Show add button on confirm
4. ✅ Keep view on cancel
5. ✅ Keep add button hidden on cancel

### Required Imports

```typescript
import ConfirmDialog from '@/components/core/ConfirmDialog.vue';
```

### Implementation Status

🔴 **TDD Mode**: All tests will fail until component is updated to handle delete events and show confirmation dialog.
