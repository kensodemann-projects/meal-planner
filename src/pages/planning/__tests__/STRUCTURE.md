# day.spec.ts — Test Structure

## day

- renders
- parses the date properly
- gets the meal plan for today
- contains a section for each type of meal
- does not display any meal editors for $case _(× 3: full meal plan, empty meal plan, new meal plan)_

### meal $label _(× 4: breakfast, lunch, dinner, snack)_

#### on a day without a meal plan

- the add ${label} button exists
- the ${label} view is not displayed

##### clicking the add button

- hides the button
- displays the editor for ${label}

###### on cancel

- hides the editor
- shows the add ${label} button again

###### on meal changed

- keeps the editor open
- does not show the add ${label} button again
- assigns the meal to the ${label} view after the editor is closed
- displays the ${label} in the editor when the ${label} view emits the modify event

#### on a day with a meal plan

##### when the meal plan includes a ${label}

- the add ${label} button does not exist
- the ${label} view is displayed
- the ${label} view displays the correct meal data

###### the modify event

- hides the ${label} view
- displays the ${label} in the editor

###### the delete event

- displays the confirmation dialog

####### on confirm

- removes the ${label} view
- displays the add button

####### on deny

- does not remove the ${label} view
- does not display the add ${label} button

##### when the meal plan does not include a ${label}

- the add ${label} button exists
- the ${label} view is not displayed

---

### close button

- exists
- does not save the meal plan
- navigates to the week page
