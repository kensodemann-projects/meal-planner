import { TEST_MEAL } from '@/data/__tests__/test-data';
import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';
import type { Meal } from '@/models/meal';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealEditor from '../MealEditor.vue';

vi.mock('@/data/foods');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { meal: Meal }) => mount(MealEditor, { props, global: { plugins: [vuetify] } });

const calculateTotalNutrition = (items: Meal['items']) => {
  return items.reduce(
    (total, item) => ({
      calories: total.calories + item.nutrition.calories,
      protein: total.protein + item.nutrition.protein,
      carbs: total.carbs + item.nutrition.carbs,
      fat: total.fat + item.nutrition.fat,
      sugar: total.sugar + item.nutrition.sugar,
      sodium: total.sodium + item.nutrition.sodium,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0 },
  );
};

const emptyMeal: Meal = {
  id: '4991b0d9-7aea-4755-b9d1-88e8c2fa4ab7',
  type: 'Dinner',
  items: [],
};

const recipeMealItem = {
  id: 'item-2-3-1',
  name: 'Beef Sirloin',
  recipeId: '3',
  units: 1,
  unitOfMeasure: { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
  nutrition: {
    calories: 320,
    sodium: 120,
    fat: 14,
    protein: 42,
    carbs: 0,
    sugar: 0,
  },
};

const foodMealItem = {
  id: 'item-1-1-1',
  name: 'Rolled Oats',
  foodItemId: 'food-test-1',
  units: 1,
  unitOfMeasure: { id: 'cup', name: 'cup', type: 'volume', system: 'customary' },
  nutrition: {
    calories: 300,
    sodium: 100,
    fat: 6,
    protein: 10,
    carbs: 54,
    sugar: 2,
  },
};

describe('Meal Editor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent({ meal: emptyMeal });
    expect(wrapper.exists()).toBe(true);
  });

  it('gets references to the food items and recipes', () => {
    wrapper = mountComponent({ meal: emptyMeal });
    expect(useFoodsData).toHaveBeenCalledExactlyOnceWith();
    expect(useRecipesData).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not have any active meal item editors', () => {
    wrapper = mountComponent({ meal: emptyMeal });
    expect(wrapper.findAllComponents({ name: 'MealItemEditorCard' }).length).toBe(0);
  });

  describe('adding to an empty meal', () => {
    beforeEach(() => (wrapper = mountComponent({ meal: emptyMeal })));

    it('does not list any recipes', () => {
      const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
      const panels = recipePanels.findAllComponents(components.VExpansionPanel);
      expect(panels.length).toBe(0);
    });

    it('does not list any food items', () => {
      const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
      const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
      expect(panels.length).toBe(0);
    });

    describe('save button', () => {
      it('starts disabled', () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        expect(saveButton.exists()).toBe(true);
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is enabled after a recipe is added', async () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', recipeMealItem);
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is enabled after a food is added', async () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', foodMealItem);
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });
    });
  });

  describe('updating a meal with existing recipes and foods', () => {
    beforeEach(() => (wrapper = mountComponent({ meal: TEST_MEAL })));

    it('lists the recipes for the meal', () => {
      const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
      const panels = recipePanels.findAllComponents(components.VExpansionPanel);
      expect(panels.length).toBe(TEST_MEAL.items.filter((item) => item.recipeId).length);
    });

    it('lists the food items for the meal', () => {
      const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
      const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
      expect(panels.length).toBe(TEST_MEAL.items.filter((item) => item.foodItemId).length);
    });

    describe('save button', () => {
      it('starts disabled', () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        expect(saveButton.exists()).toBe(true);
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is enabled after a recipe is added', async () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', recipeMealItem);
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is enabled after a food is added', async () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', foodMealItem);
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is enabled after an existing recipe is updated', async () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        const panels = recipePanels.findAllComponents(components.VExpansionPanel);
        const panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        await mealItemEditor.vm.$emit('save', {
          ...recipeMealItem,
          name: 'Updated Recipe Name',
        });
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is eabled after an existing food item is updated', async () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
        const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        const panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        await mealItemEditor.vm.$emit('save', {
          ...foodMealItem,
          name: 'Updated Food Name',
        });
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it.skip('is disabled if a recipe is open for edit', async () => {
        // first enable the button by adding a recipe
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', recipeMealItem);
        await wrapper.vm.$nextTick();
        // Now open an existing recipe for edit
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        const panels = recipePanels.findAllComponents(components.VExpansionPanel);
        const panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeDefined();
        // Cancel the edit and show the button is enabled again
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        const cancelButton = mealItemEditor.findComponent('[data-testid="cancel-button"]');
        await cancelButton.trigger('click');
        await wrapper.vm.$nextTick();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('an existing recipe meal item', () => {
      let panel: VueWrapper<components.VExpansionPanel>;
      beforeEach(async () => {
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        const panels = recipePanels.findAllComponents(components.VExpansionPanel);
        panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        await wrapper.vm.$nextTick();
      });

      it('has actions for modify and delete', () => {
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        expect(modifyButton.exists()).toBe(true);
        expect(deleteButton.exists()).toBe(true);
      });

      it('displays the nutritional information', () => {
        const nutritionDisplay = panel.findComponent({ name: 'NutritionData' });
        expect(nutritionDisplay.exists()).toBe(true);
      });

      it('is not editable', async () => {
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(false);
      });

      it('replaces the nutritional information with the meal item editor on modify', async () => {
        const nutritionDisplay = panel.findComponent({ name: 'NutritionData' });
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await modifyButton.trigger('click');
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(true);
        expect(mealItemEditor.props('type')).toBe('recipe');
        expect(modifyButton.exists()).toBe(false);
        expect(deleteButton.exists()).toBe(false);
        expect(nutritionDisplay.exists()).toBe(false);
      });

      it('updates the meal item and exits editing mode when save is clicked', async () => {
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');
        let mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(true);

        // Use the original item from TEST_MEAL and update specific fields
        const originalItem = TEST_MEAL.items.find((item) => item.recipeId);
        if (!originalItem) {
          throw new Error('TEST_MEAL should contain at least one recipe item');
        }
        const updatedItem = {
          ...originalItem,
          name: 'Updated Grilled Chicken',
          units: 2,
          nutrition: {
            calories: 400,
            sodium: 192,
            fat: 8,
            protein: 72,
            carbs: 0,
            sugar: 0,
          },
        };

        await mealItemEditor.vm.$emit('save', updatedItem);
        await wrapper.vm.$nextTick();

        mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(false);

        const nutritionDisplay = panel.findComponent({ name: 'NutritionData' });
        expect(nutritionDisplay.exists()).toBe(true);
        expect(nutritionDisplay.props('value')).toEqual(updatedItem.nutrition);
      });

      it('restores the nutritional information when cancel is clicked', async () => {
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(true);
        const cancelButton = mealItemEditor.findComponent('[data-testid="cancel-button"]');
        await cancelButton.trigger('click');
        expect(panel.findComponent({ name: 'MealItemEditorCard' }).exists()).toBe(false);
        expect(panel.findComponent({ name: 'NutritionData' }).exists()).toBe(true);
        expect(panel.findComponent('[data-testid="modify-button"]').exists()).toBe(true);
        expect(panel.findComponent('[data-testid="delete-button"]').exists()).toBe(true);
      });

      it('opens the confirm dialog when delete button is clicked', async () => {
        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();
        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        expect(confirmDialog.exists()).toBe(true);
      });

      it('removes the recipe from the list when deletion is confirmed', async () => {
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        let panels = recipePanels.findAllComponents(components.VExpansionPanel);
        const initialCount = panels.length;
        expect(initialCount).toBeGreaterThan(0);

        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();

        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        expect(confirmDialog.exists()).toBe(true);
        await confirmDialog.vm.$emit('confirm');
        await wrapper.vm.$nextTick();

        panels = recipePanels.findAllComponents(components.VExpansionPanel);
        expect(panels.length).toBe(initialCount - 1);
      });

      it('keeps the recipe in the list when deletion is canceled', async () => {
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        let panels = recipePanels.findAllComponents(components.VExpansionPanel);
        const initialCount = panels.length;
        expect(initialCount).toBeGreaterThan(0);

        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();

        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        expect(confirmDialog.exists()).toBe(true);
        await confirmDialog.vm.$emit('cancel');
        await wrapper.vm.$nextTick();

        panels = recipePanels.findAllComponents(components.VExpansionPanel);
        expect(panels.length).toBe(initialCount);
      });
    });

    describe('an existing food meal item', () => {
      let panel: VueWrapper<components.VExpansionPanel>;
      beforeEach(async () => {
        wrapper = mountComponent({ meal: TEST_MEAL });
        const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
        const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        await wrapper.vm.$nextTick();
      });

      it('has actions for modify and delete', () => {
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        expect(modifyButton.exists()).toBe(true);
        expect(deleteButton.exists()).toBe(true);
      });

      it('displays the nutritional information', () => {
        const nutritionDisplay = panel.findComponent({ name: 'NutritionData' });
        expect(nutritionDisplay.exists()).toBe(true);
      });

      it('is not editable', async () => {
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(false);
      });

      it('replaces the nutritional information with the meal item editor on modify', async () => {
        const nutritionDisplay = panel.findComponent({ name: 'NutritionData' });
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await modifyButton.trigger('click');
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(true);
        expect(mealItemEditor.props('type')).toBe('food');
        expect(modifyButton.exists()).toBe(false);
        expect(deleteButton.exists()).toBe(false);
        expect(nutritionDisplay.exists()).toBe(false);
      });

      it('restores the nutritional information when cancel is clicked', async () => {
        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');
        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        expect(mealItemEditor.exists()).toBe(true);
        const cancelButton = mealItemEditor.findComponent('[data-testid="cancel-button"]');
        await cancelButton.trigger('click');
        expect(panel.findComponent({ name: 'MealItemEditorCard' }).exists()).toBe(false);
        expect(panel.findComponent({ name: 'NutritionData' }).exists()).toBe(true);
        expect(panel.findComponent('[data-testid="modify-button"]').exists()).toBe(true);
        expect(panel.findComponent('[data-testid="delete-button"]').exists()).toBe(true);
      });

      it('opens the confirm dialog when delete button is clicked', async () => {
        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();
        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        expect(confirmDialog.exists()).toBe(true);
      });

      it('removes the food item from the list when deletion is confirmed', async () => {
        const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
        let panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        const initialCount = panels.length;
        expect(initialCount).toBeGreaterThan(0);

        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();

        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        expect(confirmDialog.exists()).toBe(true);
        await confirmDialog.vm.$emit('confirm');
        await wrapper.vm.$nextTick();

        panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        expect(panels.length).toBe(initialCount - 1);
      });

      it('keeps the food item in the list when deletion is canceled', async () => {
        const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
        let panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        const initialCount = panels.length;
        expect(initialCount).toBeGreaterThan(0);

        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();

        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        expect(confirmDialog.exists()).toBe(true);
        await confirmDialog.vm.$emit('cancel');
        await wrapper.vm.$nextTick();

        panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        expect(panels.length).toBe(initialCount);
      });
    });
  });

  describe('add recipe button', () => {
    it('is active', () => {
      wrapper = mountComponent({ meal: emptyMeal });
      const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
      expect(addRecipeButton.exists()).toBe(true);
      expect(addRecipeButton.attributes('disabled')).toBeUndefined();
    });

    describe('on click', () => {
      it('adds a meal item editor for a recipe', async () => {
        wrapper = mountComponent({ meal: emptyMeal });
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        expect(mealItemEditors.length).toBe(1);
        expect(mealItemEditors[0]!.props('type')).toBe('recipe');
      });

      it('becomes disabled', async () => {
        wrapper = mountComponent({ meal: emptyMeal });
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        expect(addRecipeButton.attributes('disabled')).toBeDefined();
      });

      describe('on cancel', () => {
        it('removes the meal item editor', async () => {
          wrapper = mountComponent({ meal: emptyMeal });
          const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
          await addRecipeButton.trigger('click');
          let mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(1);
          await mealItemEditors[0]!.vm.$emit('cancel');
          mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(0);
        });
      });

      describe('on save', () => {
        it('removes the meal item editor', async () => {
          wrapper = mountComponent({ meal: emptyMeal });
          const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
          await addRecipeButton.trigger('click');
          let mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(1);
          await mealItemEditors[0]!.vm.$emit('save', {
            id: 'item-2-3-1',
            name: 'Beef Sirloin',
            recipeId: '3',
            units: 1,
            unitOfMeasure: { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
            nutrition: {
              calories: 320,
              sodium: 120,
              fat: 14,
              protein: 42,
              carbs: 0,
              sugar: 0,
            },
          });
          mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(0);
        });

        it('displays the recipe in the recipe list', async () => {
          wrapper = mountComponent({ meal: emptyMeal });
          const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
          await addRecipeButton.trigger('click');
          const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          await mealItemEditors[0]!.vm.$emit('save', recipeMealItem);
          const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
          const panels = recipePanels.findAllComponents(components.VExpansionPanel);
          expect(panels.length).toBe(1);
        });
      });
    });
  });

  describe('add food item button', () => {
    it('is active', () => {
      wrapper = mountComponent({ meal: emptyMeal });
      const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
      expect(addFoodItemButton.exists()).toBe(true);
      expect(addFoodItemButton.attributes('disabled')).toBeUndefined();
    });

    describe('on click', () => {
      it('adds a meal item editor for a food item', async () => {
        wrapper = mountComponent({ meal: emptyMeal });
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        expect(mealItemEditors.length).toBe(1);
        expect(mealItemEditors[0]!.props('type')).toBe('food');
      });

      it('becomes disabled', async () => {
        wrapper = mountComponent({ meal: emptyMeal });
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');
        expect(addFoodItemButton.attributes('disabled')).toBeDefined();
      });

      describe('on cancel', () => {
        it('removes the meal item editor', async () => {
          wrapper = mountComponent({ meal: emptyMeal });
          const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
          await addFoodItemButton.trigger('click');
          let mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(1);
          await mealItemEditors[0]!.vm.$emit('cancel');
          mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(0);
        });
      });

      describe('on save', () => {
        it('removes the meal item editor', async () => {
          wrapper = mountComponent({ meal: emptyMeal });
          const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
          await addFoodItemButton.trigger('click');
          let mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(1);
          await mealItemEditors[0]!.vm.$emit('save', foodMealItem);
          mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(0);
        });

        it('displays the food item in the food item list', async () => {
          wrapper = mountComponent({ meal: emptyMeal });
          const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
          await addFoodItemButton.trigger('click');
          const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          await mealItemEditors[0]!.vm.$emit('save', foodMealItem);
          const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
          const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
          expect(panels.length).toBe(1);
        });
      });
    });
  });

  describe('Total Nutrition Display', () => {
    describe('when adding a new meal', () => {
      beforeEach(() => (wrapper = mountComponent({ meal: emptyMeal })));

      it('displays zeros for all nutrition values', () => {
        const totalNutrition = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        expect(totalNutrition.exists()).toBe(true);
        expect(totalNutrition.props('value')).toEqual({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          sugar: 0,
          sodium: 0,
        });
      });
    });

    describe('when updating a meal', () => {
      beforeEach(() => (wrapper = mountComponent({ meal: TEST_MEAL })));

      it('displays the sum of all meal item nutrition', () => {
        const totalNutrition = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        expect(totalNutrition.exists()).toBe(true);

        const expectedTotal = calculateTotalNutrition(TEST_MEAL.items);

        expect(totalNutrition.props('value')).toEqual(expectedTotal);
      });
    });

    describe('when adding a recipe meal item', () => {
      beforeEach(() => (wrapper = mountComponent({ meal: emptyMeal })));

      it('updates the total nutrition to reflect the added recipe', async () => {
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');

        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', recipeMealItem);

        const totalNutrition = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        expect(totalNutrition.props('value')).toEqual(recipeMealItem.nutrition);
      });
    });

    describe('when adding a food meal item', () => {
      beforeEach(() => (wrapper = mountComponent({ meal: emptyMeal })));

      it('updates the total nutrition to reflect the added food item', async () => {
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');

        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', foodMealItem);

        const totalNutrition = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        expect(totalNutrition.props('value')).toEqual(foodMealItem.nutrition);
      });
    });

    describe('when adding both recipe and food items', () => {
      beforeEach(() => (wrapper = mountComponent({ meal: emptyMeal })));

      it('updates the total nutrition to reflect both items', async () => {
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');

        let mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', recipeMealItem);

        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');

        mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        await mealItemEditors[0]!.vm.$emit('save', foodMealItem);

        const totalNutrition = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        expect(totalNutrition.props('value')).toEqual({
          calories: 620,
          sodium: 220,
          fat: 20,
          protein: 52,
          carbs: 54,
          sugar: 2,
        });
      });
    });

    describe('when updating a recipe meal item', () => {
      let panel: VueWrapper<components.VExpansionPanel>;

      beforeEach(async () => {
        wrapper = mountComponent({ meal: TEST_MEAL });
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        const panels = recipePanels.findAllComponents(components.VExpansionPanel);
        panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        await wrapper.vm.$nextTick();
      });

      it('updates the total nutrition to reflect the modified recipe', async () => {
        const totalNutritionBefore = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        const originalTotal = { ...totalNutritionBefore.props('value') };

        const modifyButton = panel.findComponent('[data-testid="modify-button"]');
        await modifyButton.trigger('click');

        const mealItemEditor = panel.findComponent({ name: 'MealItemEditorCard' });
        const originalItem = TEST_MEAL.items.find((item) => item.recipeId);
        if (!originalItem) {
          throw new Error('TEST_MEAL should contain at least one recipe item');
        }

        const updatedItem = {
          ...originalItem,
          nutrition: {
            calories: 400,
            sodium: 192,
            fat: 8,
            protein: 72,
            carbs: 0,
            sugar: 0,
          },
        };

        await mealItemEditor.vm.$emit('save', updatedItem);
        await wrapper.vm.$nextTick();

        const totalNutritionAfter = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;

        const expectedTotal = {
          calories: originalTotal.calories - originalItem.nutrition.calories + updatedItem.nutrition.calories,
          sodium: originalTotal.sodium - originalItem.nutrition.sodium + updatedItem.nutrition.sodium,
          fat: originalTotal.fat - originalItem.nutrition.fat + updatedItem.nutrition.fat,
          protein: originalTotal.protein - originalItem.nutrition.protein + updatedItem.nutrition.protein,
          carbs: originalTotal.carbs - originalItem.nutrition.carbs + updatedItem.nutrition.carbs,
          sugar: originalTotal.sugar - originalItem.nutrition.sugar + updatedItem.nutrition.sugar,
        };

        expect(totalNutritionAfter.props('value')).toEqual(expectedTotal);
      });
    });

    describe('when deleting a recipe meal item', () => {
      let panel: VueWrapper<components.VExpansionPanel>;

      beforeEach(async () => {
        wrapper = mountComponent({ meal: TEST_MEAL });
        const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
        const panels = recipePanels.findAllComponents(components.VExpansionPanel);
        panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        await wrapper.vm.$nextTick();
      });

      it('updates the total nutrition to exclude the deleted recipe', async () => {
        const totalNutritionBefore = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        const originalTotal = { ...totalNutritionBefore.props('value') };

        const originalItem = TEST_MEAL.items.find((item) => item.recipeId);
        if (!originalItem) {
          throw new Error('TEST_MEAL should contain at least one recipe item');
        }

        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();

        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        await confirmDialog.vm.$emit('confirm');
        await wrapper.vm.$nextTick();

        const totalNutritionAfter = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;

        const expectedTotal = {
          calories: originalTotal.calories - originalItem.nutrition.calories,
          sodium: originalTotal.sodium - originalItem.nutrition.sodium,
          fat: originalTotal.fat - originalItem.nutrition.fat,
          protein: originalTotal.protein - originalItem.nutrition.protein,
          carbs: originalTotal.carbs - originalItem.nutrition.carbs,
          sugar: originalTotal.sugar - originalItem.nutrition.sugar,
        };

        expect(totalNutritionAfter.props('value')).toEqual(expectedTotal);
      });
    });

    describe('when deleting a food meal item', () => {
      let panel: VueWrapper<components.VExpansionPanel>;

      beforeEach(async () => {
        wrapper = mountComponent({ meal: TEST_MEAL });
        const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
        const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
        panel = panels[0]!;
        const header = panel.findComponent(components.VExpansionPanelTitle);
        await header.trigger('click');
        await wrapper.vm.$nextTick();
      });

      it('updates the total nutrition to exclude the deleted food item', async () => {
        const totalNutritionBefore = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;
        const originalTotal = { ...totalNutritionBefore.props('value') };

        const originalItem = TEST_MEAL.items.find((item) => item.foodItemId);
        if (!originalItem) {
          throw new Error('TEST_MEAL should contain at least one food item');
        }

        const deleteButton = panel.findComponent('[data-testid="delete-button"]');
        await deleteButton.trigger('click');
        await wrapper.vm.$nextTick();

        const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' });
        await confirmDialog.vm.$emit('confirm');
        await wrapper.vm.$nextTick();

        const totalNutritionAfter = wrapper.getComponent('[data-testid="total-nutrition"]') as VueWrapper<any>;

        const expectedTotal = {
          calories: originalTotal.calories - originalItem.nutrition.calories,
          sodium: originalTotal.sodium - originalItem.nutrition.sodium,
          fat: originalTotal.fat - originalItem.nutrition.fat,
          protein: originalTotal.protein - originalItem.nutrition.protein,
          carbs: originalTotal.carbs - originalItem.nutrition.carbs,
          sugar: originalTotal.sugar - originalItem.nutrition.sugar,
        };

        expect(totalNutritionAfter.props('value')).toEqual(expectedTotal);
      });
    });
  });
});
