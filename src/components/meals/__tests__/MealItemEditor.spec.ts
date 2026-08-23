import { autocompleteIsRequired } from '@/components/__tests__/test-utils.ts';
import { TEST_RECIPES } from '@/data/__tests__/test-data.ts';
import { useRecipesData } from '@/data/recipes';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe.ts';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Ref } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditor from '../MealItemEditor.vue';

vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});

const TEST_MEAL_ITEM: MealItem = {
  id: '4498eae8-b4c9-4327-b1c2-518f071981f2',
  servings: 2,
  name: 'Test Meal Item',
  recipeId: TEST_RECIPES[0]!.id!,
  nutrition: {
    calories: 630,
    sodium: 780,
    sugar: 3,
    carbs: 55,
    fat: 35,
    protein: 28,
  },
};

const mountComponent = (props: { mealItem?: MealItem; weekStartDate: string } = { weekStartDate: '2026-01-01' }) =>
  mount(MealItemEditor, { props, global: { plugins: [vuetify] } });

describe('MealItemEditor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    const { recipes } = useRecipesData();
    (recipes as Ref<Recipe[]>).value = TEST_RECIPES;
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('should render', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('uses the recipe data', () => {
    wrapper = mountComponent();
    expect(useRecipesData).toHaveBeenCalledOnce();
  });

  describe('week start date', () => {
    it('has seven date options starting from the week start date', () => {
      wrapper = mountComponent({ weekStartDate: '2026-08-30' });
      const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
      expect(dateInput.props('items')).toEqual([
        { dateString: 'Sunday, August 30', date: '2026-08-30' },
        { dateString: 'Monday, August 31', date: '2026-08-31' },
        { dateString: 'Tuesday, September 1', date: '2026-09-01' },
        { dateString: 'Wednesday, September 2', date: '2026-09-02' },
        { dateString: 'Thursday, September 3', date: '2026-09-03' },
        { dateString: 'Friday, September 4', date: '2026-09-04' },
        { dateString: 'Saturday, September 5', date: '2026-09-05' },
      ]);
    });

    it('has the proper label', () => {
      wrapper = mountComponent();
      const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
      expect(dateInput.props('label')).toBe('Select Date');
    });
  });

  describe('recipe select', () => {
    it('does not default', () => {
      wrapper = mountComponent();
      expect((wrapper.vm as any).recipeId).toBeUndefined();
    });

    it('has the proper label', () => {
      wrapper = mountComponent();
      const recipeSelect = wrapper.findComponent(
        '[data-testid="recipe-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(recipeSelect.props('label')).toBe('Select Recipe');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await autocompleteIsRequired(wrapper, 'recipe-input');
    });

    it('defaults the nutrition information', async () => {
      wrapper = mountComponent();
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');
      await recipeInput.setValue(TEST_RECIPES[1]!.id);
      expect(nutritionEditor.props('modelValue')).toEqual({
        calories: TEST_RECIPES[1]!.calories,
        sodium: TEST_RECIPES[1]!.sodium,
        sugar: TEST_RECIPES[1]!.sugar,
        carbs: TEST_RECIPES[1]!.carbs,
        fat: TEST_RECIPES[1]!.fat,
        protein: TEST_RECIPES[1]!.protein,
      });
    });

    it('scales nutrition by current servings when servings are already set', async () => {
      wrapper = mountComponent();
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      const servingsInput = wrapper.findComponent('[data-testid="servings-input"]');
      await servingsInput.setValue(2);
      const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');
      await recipeInput.setValue(TEST_RECIPES[1]!.id);
      expect(nutritionEditor.props('modelValue')).toEqual({
        calories: TEST_RECIPES[1]!.calories * 2,
        sodium: TEST_RECIPES[1]!.sodium * 2,
        sugar: TEST_RECIPES[1]!.sugar * 2,
        carbs: TEST_RECIPES[1]!.carbs * 2,
        fat: TEST_RECIPES[1]!.fat * 2,
        protein: TEST_RECIPES[1]!.protein * 2,
      });
    });

    describe('for an existing recipe item', () => {
      it('is initialized based on the meal item', () => {
        wrapper = mountComponent({ mealItem: TEST_MEAL_ITEM, weekStartDate: '2026-01-01' });
        expect((wrapper.vm as any).recipeId).toBe(TEST_MEAL_ITEM.recipeId);
      });
    });

    describe('tab key behavior', () => {
      it('selects the first matching recipe when the search text matches', async () => {
        wrapper = mountComponent();
        const recipeInput = wrapper.findComponent(
          '[data-testid="recipe-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = recipeInput.find('input');
        await input.setValue('oats');
        await input.trigger('keydown.tab');
        // 'oats' only matches 'Overnight Oats' (id: '4')
        expect(recipeInput.props('modelValue')).toBe('4');
      });

      it('selects the first matching recipe when the search text matches multiple items', async () => {
        wrapper = mountComponent();
        const recipeInput = wrapper.findComponent(
          '[data-testid="recipe-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = recipeInput.find('input');
        await input.setValue('classic');
        await input.trigger('keydown.tab');
        // 'Classic Spaghetti Carbonara' and 'Classic Fudgy Brownies' match; first is id '1'
        expect(recipeInput.props('modelValue')).toBe('1');
      });

      it('does not select any recipe when the search text is empty', async () => {
        wrapper = mountComponent();
        const recipeInput = wrapper.findComponent(
          '[data-testid="recipe-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = recipeInput.find('input');
        await input.trigger('keydown.tab');
        expect(recipeInput.props('modelValue')).toBe('');
      });

      it('does not select any recipe when the search text does not match any recipe', async () => {
        wrapper = mountComponent();
        const recipeInput = wrapper.findComponent(
          '[data-testid="recipe-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = recipeInput.find('input');
        await input.setValue('zzz');
        await input.trigger('keydown.tab');
        expect(recipeInput.props('modelValue')).toBe('');
      });
    });
  });
});
