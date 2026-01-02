import type { FoodItem } from '@/models/food';
import type { Recipe } from '@/models/recipe';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemInput from '../MealItemInput.vue';
import { TEST_FOODS, TEST_RECIPES } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import { autocompleteIsRequired, numberInputIsRequired } from '@/components/__tests__/test-utils';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: {
  modelValue: Partial<MealItem>;
  values: (FoodItem | Recipe)[];
  type: 'food' | 'recipe';
}) => mount(MealItemInput, { props, global: { plugins: [vuetify] } });

describe('Meal Item Input', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  describe('for foods', () => {
    describe('units', () => {
      it('does not default', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const units = wrapper.findComponent('[data-testid="units-input"]');
        expect((units.find('input').element as HTMLInputElement).value).toBe('');
      });

      it('is required', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        await numberInputIsRequired(wrapper, 'units-input');
      });

      describe('for an existing food item', () => {
        it('is initialized based on the meal item', () => {
          wrapper = mountComponent({ modelValue: TEST_FOOD_MEAL_ITEM, type: 'food', values: TEST_FOODS });
          const units = wrapper.findComponent('[data-testid="units-input"]');
          expect((units.find('input').element as HTMLInputElement).value).toBe('2');
        });
      });
    });

    describe('unit of measure', () => {
      it('does not default', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        expect((wrapper.vm as any).unitOfMeasureId).toBeUndefined();
      });

      it('is required', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        await autocompleteIsRequired(wrapper, 'unit-of-measure-input');
      });

      describe('for an existing food item', () => {
        it('is initialized based on the meal item', () => {
          wrapper = mountComponent({ modelValue: TEST_FOOD_MEAL_ITEM, type: 'food', values: TEST_FOODS });
          expect((wrapper.vm as any).unitOfMeasureId).toBe('cup');
        });
      });
    });

    describe('nutritional information', () => {
      it('renders NutritionEditorRows component', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        expect(nutritionEditor.exists()).toBe(true);
      });

      it('initializes with empty nutrition object', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        expect(nutritionEditor.props('modelValue')).toEqual({});
      });

      it('updates meal item when NutritionEditorRows emits changes', async () => {
        const nutrition = {
          calories: 300,
          sodium: 250,
          sugar: 23,
          carbs: 24,
          fat: 16,
          protein: 16,
        };
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });

        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        await nutritionEditor.vm.$emit('update:modelValue', nutrition);

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted?.length).toBe(1);
        expect((emitted![0]![0] as MealItem).nutrition).toMatchObject(nutrition);
      });

      describe('for an existing food item', () => {
        it('initializes the nutrition data', () => {
          wrapper = mountComponent({ modelValue: TEST_FOOD_MEAL_ITEM, type: 'food', values: TEST_FOODS });
          const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
          expect(nutritionEditor.props('modelValue')).toMatchObject(TEST_FOOD_MEAL_ITEM.nutrition!);
        });
      });
    });
  });

  describe('for recipes', () => {
    describe('units', () => {
      it('defaults to 1', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const units = wrapper.findComponent('[data-testid="units-input"]');
        expect((units.find('input').element as HTMLInputElement).value).toBe('1');
      });

      it('is disabled', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const units = wrapper.findComponent('[data-testid="units-input"]');
        const input = units.find('input');
        expect(input.element.disabled).toBe(true);
      });
    });

    describe('unit of measure', () => {
      it('defaults to serving', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        expect((wrapper.vm as any).unitOfMeasureId).toBe('serving');
      });

      it('is disabled', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const unitOfMeasure = wrapper.findComponent('[data-testid="unit-of-measure-input"]');
        const input = unitOfMeasure.find('input');
        expect(input.element.disabled).toBe(true);
      });
    });

    describe('nutritional information', () => {
      it('renders NutritionEditorRows component', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        expect(nutritionEditor.exists()).toBe(true);
      });

      it('initializes with empty nutrition object', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        expect(nutritionEditor.props('modelValue')).toEqual({});
      });

      it('updates meal item when NutritionEditorRows emits changes', async () => {
        const nutrition = {
          calories: 300,
          sodium: 250,
          sugar: 23,
          carbs: 24,
          fat: 16,
          protein: 16,
        };
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });

        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        await nutritionEditor.vm.$emit('update:modelValue', nutrition);

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted?.length).toBe(1);
        expect((emitted![0]![0] as MealItem).nutrition).toMatchObject(nutrition);
      });

      describe('for an existing food item', () => {
        it('initializes the nutrition data', () => {
          wrapper = mountComponent({ modelValue: TEST_RECIPE_MEAL_ITEM, type: 'recipe', values: TEST_RECIPES });
          const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
          expect(nutritionEditor.props('modelValue')).toMatchObject(TEST_RECIPE_MEAL_ITEM.nutrition!);
        });
      });
    });
  });
});

const TEST_FOOD_MEAL_ITEM: Partial<MealItem> = {
  id: 'c83a0eed-f113-4d83-af2f-27734807df99',
  units: 2,
  unitOfMeasure: { id: 'cup', name: 'Cup', type: 'volume', system: 'customary', fdcId: 1000 },
  foodItemId: TEST_FOODS[0]!.id,
  nutrition: {
    calories: 300,
    sodium: 250,
    fat: 16,
    protein: 16,
    carbs: 24,
    sugar: 23,
  },
};

const TEST_RECIPE_MEAL_ITEM: Partial<MealItem> = {
  id: '4498eae8-b4c9-4327-b1c2-518f071981f2',
  units: 1,
  unitOfMeasure: { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
  foodItemId: TEST_RECIPES[0]!.id,
  nutrition: {
    calories: 630,
    sodium: 780,
    sugar: 3,
    carbs: 55,
    fat: 35,
    protein: 28,
  },
};
