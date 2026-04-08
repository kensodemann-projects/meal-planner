# day.spec.ts — Test Structure

## day

- renders
- parses the date properly
- gets the meal plan for today
- contains a section for each type of meal
- does not display any meal editors for $case _(× 3: full meal plan, empty meal plan, new meal plan)_

### add $label button _(× 4: breakfast, lunch, dinner, snack)_

#### on a day without a meal plan

- exists

#### on a day with a meal plan

- it exists if the meal plan does not have a ${label} defined
- does not exist if the meal plan has a ${label}

#### click

- hides the button
- displays the editor for ${label}

##### on cancel

- hides the editor
- shows the add ${label} button again

##### on meal changed

- keeps the editor open
- does not show the add ${label} button again
- assigns the meal to the ${label} view after the editor is closed
- displays the ${label} in the editor when the ${label} view emits the modify event

---

### $label view _(× 4: breakfast, lunch, dinner, snack)_

- is displayed when data exists and is not being edited
- is not displayed when there is no data
- is not displayed when the editor is showing
- displays the correct meal data
- displays the meal in the editor when the view emits the modify event

#### when the meal editor is cancelled after modify

- hides the editor
- shows the view again
- does not show the add button

#### the delete event

- displays the confirmation dialog

##### on confirm

- removes the view
- displays the add button

##### on deny

- does not remove the view
- does not display the add button

---

### close button

- exists
- does not save the meal plan
- navigates to the week page
