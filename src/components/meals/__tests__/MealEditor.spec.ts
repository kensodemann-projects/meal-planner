import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';
import type { Meal } from '@/models/meal';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealEditor from '../MealEditor.vue';
import { TEST_MEAL } from '@/data/__tests__/test-data';

vi.mock('@/data/foods');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { meal?: Meal } = {}) => mount(MealEditor, { props, global: { plugins: [vuetify] } });

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
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('gets references to the food items and recipes', () => {
    wrapper = mountComponent();
    expect(useFoodsData).toHaveBeenCalledExactlyOnceWith();
    expect(useRecipesData).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not have any active meal item editors', () => {
    wrapper = mountComponent();
    expect(wrapper.findAllComponents({ name: 'MealItemEditorCard' }).length).toBe(0);
  });

  describe('adding a meal', () => {
    beforeEach(() => (wrapper = mountComponent()));

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
  });

  describe('updating a meal', () => {
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
  });

  describe('add recipe button', () => {
    it('is active', () => {
      wrapper = mountComponent();
      const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
      expect(addRecipeButton.exists()).toBe(true);
      expect(addRecipeButton.attributes('disabled')).toBeUndefined();
    });

    describe('on click', () => {
      it('adds a meal item editor for a recipe', async () => {
        wrapper = mountComponent();
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        expect(mealItemEditors.length).toBe(1);
        expect(mealItemEditors[0]!.props('type')).toBe('recipe');
      });

      it('becomes disabled', async () => {
        wrapper = mountComponent();
        const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
        await addRecipeButton.trigger('click');
        expect(addRecipeButton.attributes('disabled')).toBeDefined();
      });

      describe('on cancel', () => {
        it('removes the meal item editor', async () => {
          wrapper = mountComponent();
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
          wrapper = mountComponent();
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
          wrapper = mountComponent();
          const addRecipeButton = wrapper.findComponent('[data-testid="add-recipe-button"]');
          await addRecipeButton.trigger('click');
          const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
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
          const recipePanels = wrapper.findComponent('[data-testid="recipe-panels"]');
          const panels = recipePanels.findAllComponents(components.VExpansionPanel);
          expect(panels.length).toBe(1);
        });
      });
    });
  });

  describe('add food item button', () => {
    it('is active', () => {
      wrapper = mountComponent();
      const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
      expect(addFoodItemButton.exists()).toBe(true);
      expect(addFoodItemButton.attributes('disabled')).toBeUndefined();
    });

    describe('on click', () => {
      it('adds a meal item editor for a food item', async () => {
        wrapper = mountComponent();
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');
        const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
        expect(mealItemEditors.length).toBe(1);
        expect(mealItemEditors[0]!.props('type')).toBe('food');
      });

      it('becomes disabled', async () => {
        wrapper = mountComponent();
        const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
        await addFoodItemButton.trigger('click');
        expect(addFoodItemButton.attributes('disabled')).toBeDefined();
      });

      describe('on cancel', () => {
        it('removes the meal item editor', async () => {
          wrapper = mountComponent();
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
          wrapper = mountComponent();
          const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
          await addFoodItemButton.trigger('click');
          let mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(1);
          await mealItemEditors[0]!.vm.$emit('save', {
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
          });
          mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          expect(mealItemEditors.length).toBe(0);
        });

        it('displays the food item in the food item list', async () => {
          wrapper = mountComponent();
          const addFoodItemButton = wrapper.findComponent('[data-testid="add-food-item-button"]');
          await addFoodItemButton.trigger('click');
          const mealItemEditors = wrapper.findAllComponents({ name: 'MealItemEditorCard' });
          await mealItemEditors[0]!.vm.$emit('save', {
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
          });
          const foodItemPanels = wrapper.findComponent('[data-testid="food-item-panels"]');
          const panels = foodItemPanels.findAllComponents(components.VExpansionPanel);
          expect(panels.length).toBe(1);
        });
      });
    });
  });
});
