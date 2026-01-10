import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealEditor from '../MealEditor.vue';
import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';

vi.mock('@/data/foods');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(MealEditor, { props, global: { plugins: [vuetify] } });

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
    });
  });
});
