import { autocompleteIsRequired } from '@/components/__tests__/test-utils.ts';
import { TEST_RECIPES } from '@/data/__tests__/test-data.ts';
import { useRecipesData } from '@/data/recipes';
import type { MealItem, MealType } from '@/models/meal';
import type { Recipe } from '@/models/recipe.ts';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
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
  name: TEST_RECIPES[0]!.name,
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

const mountComponent = (
  props: { mealItem?: MealItem; mealType?: MealType; mealDate?: string; weekStartDate: string } = {
    weekStartDate: '2026-01-01',
  },
) => mount(MealItemEditor, { props, global: { plugins: [vuetify] } });

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

    it('does not default', () => {
      wrapper = mountComponent({ weekStartDate: '2026-08-30' });
      const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
      expect(dateInput.props('modelValue')).toBeNull();
    });

    it('selects the passed meal date', () => {
      wrapper = mountComponent({ weekStartDate: '2026-08-30', mealDate: '2026-09-02' });
      const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
      expect(dateInput.props('modelValue')).toBe('2026-09-02');
    });

    describe('tab key behavior', () => {
      it('selects the first matching date when the search text matches', async () => {
        wrapper = mountComponent({ weekStartDate: '2026-08-30' });
        const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
        const input = dateInput.find('input');
        await input.setValue('wednesday');
        await input.trigger('keydown.tab');
        // 'wednesday' only matches 'Wednesday, September 2'
        expect(dateInput.props('modelValue')).toBe('2026-09-02');
      });

      it('selects the first matching date when the search text matches multiple items', async () => {
        wrapper = mountComponent({ weekStartDate: '2026-08-30' });
        const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
        const input = dateInput.find('input');
        await input.setValue('september');
        await input.trigger('keydown.tab');
        // 'September 1' through 'September 5' match; first is 2026-09-01
        expect(dateInput.props('modelValue')).toBe('2026-09-01');
      });

      it('does not select any date when the search text is empty', async () => {
        wrapper = mountComponent({ weekStartDate: '2026-08-30' });
        const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
        const input = dateInput.find('input');
        await input.trigger('keydown.tab');
        expect(dateInput.props('modelValue')).toBeNull();
      });

      it('does not select any date when the search text does not match any date', async () => {
        wrapper = mountComponent({ weekStartDate: '2026-08-30' });
        const dateInput = wrapper.findComponent('[data-testid="date-input"]') as VueWrapper<components.VAutocomplete>;
        const input = dateInput.find('input');
        await input.setValue('zzz');
        await input.trigger('keydown.tab');
        expect(dateInput.props('modelValue')).toBeNull();
      });
    });
  });

  describe('meal type select', () => {
    it('has the four meal type options', () => {
      wrapper = mountComponent();
      const mealTypeInput = wrapper.findComponent(
        '[data-testid="meal-type-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(mealTypeInput.props('items')).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snack']);
    });

    it('has the proper label', () => {
      wrapper = mountComponent();
      const mealTypeInput = wrapper.findComponent(
        '[data-testid="meal-type-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(mealTypeInput.props('label')).toBe('Select Meal Type');
    });

    it('does not default', () => {
      wrapper = mountComponent();
      const mealTypeInput = wrapper.findComponent(
        '[data-testid="meal-type-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(mealTypeInput.props('modelValue')).toBeNull();
    });

    it('selects the passed meal type', () => {
      wrapper = mountComponent({ weekStartDate: '2026-08-30', mealType: 'Lunch' });
      const mealTypeInput = wrapper.findComponent(
        '[data-testid="meal-type-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(mealTypeInput.props('modelValue')).toBe('Lunch');
    });

    describe('tab key behavior', () => {
      it('selects the first matching meal type when the search text matches', async () => {
        wrapper = mountComponent();
        const mealTypeInput = wrapper.findComponent(
          '[data-testid="meal-type-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = mealTypeInput.find('input');
        await input.setValue('lunch');
        await input.trigger('keydown.tab');
        // 'lunch' only matches 'Lunch'
        expect(mealTypeInput.props('modelValue')).toBe('Lunch');
      });

      it('selects the first matching meal type when the search text matches multiple items', async () => {
        wrapper = mountComponent();
        const mealTypeInput = wrapper.findComponent(
          '[data-testid="meal-type-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = mealTypeInput.find('input');
        await input.setValue('s');
        await input.trigger('keydown.tab');
        // 'Breakfast' and 'Snack' match; first is 'Breakfast'
        expect(mealTypeInput.props('modelValue')).toBe('Breakfast');
      });

      it('does not select any meal type when the search text is empty', async () => {
        wrapper = mountComponent({ weekStartDate: '2026-01-01', mealType: 'Lunch' });
        const mealTypeInput = wrapper.findComponent(
          '[data-testid="meal-type-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = mealTypeInput.find('input');
        await input.trigger('keydown.tab');
        expect(mealTypeInput.props('modelValue')).toBeNull();
      });

      it('does not select any meal type when the search text does not match any meal type', async () => {
        wrapper = mountComponent({ weekStartDate: '2026-01-01', mealType: 'Lunch' });
        const mealTypeInput = wrapper.findComponent(
          '[data-testid="meal-type-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = mealTypeInput.find('input');
        await input.setValue('zzz');
        await input.trigger('keydown.tab');
        expect(mealTypeInput.props('modelValue')).toBeNull();
      });
    });
  });

  describe('recipe select', () => {
    it('does not default', () => {
      const recipeSelect = wrapper.findComponent(
        '[data-testid="recipe-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(recipeSelect.props('modelValue')).toBeNull();
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
        expect(recipeInput.props('modelValue')).toBeNull();
      });

      it('does not select any recipe when the search text does not match any recipe', async () => {
        wrapper = mountComponent();
        const recipeInput = wrapper.findComponent(
          '[data-testid="recipe-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        const input = recipeInput.find('input');
        await input.setValue('zzz');
        await input.trigger('keydown.tab');
        expect(recipeInput.props('modelValue')).toBeNull();
      });
    });
  });

  describe('cancel button', () => {
    it('is not disabled', () => {
      wrapper = mountComponent();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
      expect(cancelButton.attributes('disabled')).toBeUndefined();
    });

    it('emits the cancel event without a payload on click', async () => {
      wrapper = mountComponent();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
      await cancelButton.trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
      expect(wrapper.emitted('cancel')).toHaveLength(1);
      expect(wrapper.emitted('cancel')?.[0]).toEqual([]);
    });
  });

  describe('save button', () => {
    const fillRequiredCreateFields = async () => {
      await wrapper.findComponent('[data-testid="date-input"]').setValue('2026-08-30');
      await wrapper.findComponent('[data-testid="meal-type-input"]').setValue('Lunch');
      await wrapper.findComponent('[data-testid="recipe-input"]').setValue(TEST_RECIPES[0]!.id);
      await flushPromises();
    };

    describe('when creating a new meal item', () => {
      beforeEach(() => {
        wrapper = mountComponent({ weekStartDate: '2026-08-30' });
      });

      it('starts disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is enabled once all required fields are filled', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        await fillRequiredCreateFields();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('becomes disabled again if a required field is cleared', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        await fillRequiredCreateFields();
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await wrapper.findComponent('[data-testid="date-input"]').setValue(null);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits the save event with a payload based on the entered data when enabled', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        await fillRequiredCreateFields();
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            mealDate: '2026-08-30',
            mealType: 'Lunch',
            mealItem: {
              id: expect.any(String),
              name: TEST_RECIPES[0]!.name,
              recipeId: TEST_RECIPES[0]!.id,
              servings: 1,
              nutrition: {
                calories: TEST_RECIPES[0]!.calories,
                sodium: TEST_RECIPES[0]!.sodium,
                sugar: TEST_RECIPES[0]!.sugar,
                carbs: TEST_RECIPES[0]!.carbs,
                fat: TEST_RECIPES[0]!.fat,
                protein: TEST_RECIPES[0]!.protein,
              },
            },
          },
        ]);
      });
    });

    describe('when editing an existing meal item', () => {
      beforeEach(() => {
        wrapper = mountComponent({
          weekStartDate: '2026-08-30',
          mealItem: TEST_MEAL_ITEM,
          mealDate: '2026-09-02',
          mealType: 'Lunch',
        });
      });

      it('starts disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is enabled if any changes are made', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        const servingsInput = wrapper.findComponent('[data-testid="servings-input"]');
        await servingsInput.setValue(3);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if a nutrition value is updated', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        const caloriesInput = wrapper.findComponent('[data-testid="calories-input"]').find('input');
        await caloriesInput.setValue(631);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is disabled if a required field is cleared', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const servingsInput = wrapper.findComponent('[data-testid="servings-input"]');
        await servingsInput.setValue(3);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await wrapper.findComponent('[data-testid="date-input"]').setValue(null);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits the save event with a payload based on the entered data when enabled', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const caloriesInput = wrapper.findComponent('[data-testid="calories-input"]').find('input');
        await caloriesInput.setValue(631);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            mealDate: '2026-09-02',
            mealType: 'Lunch',
            mealItem: {
              ...TEST_MEAL_ITEM,
              nutrition: {
                ...TEST_MEAL_ITEM.nutrition,
                calories: 631,
              },
            },
          },
        ]);
      });
    });
  });
});
