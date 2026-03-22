import { autocompleteIsRequired } from '@/components/__tests__/test-utils';
import { TEST_RECIPES } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditorRows from '../MealItemEditorRows.vue';

vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { modelValue: Partial<MealItem>; items: Recipe[] }) =>
  mount(MealItemEditorRows, { props, global: { plugins: [vuetify] } });

describe('Meal Item Editor Rows', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  describe('recipe select', () => {
    it('does not default', () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      expect((wrapper.vm as any).recipeId).toBeUndefined();
    });

    it('has the proper label', () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      const recipeSelect = wrapper.findComponent(
        '[data-testid="recipe-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(recipeSelect.props('label')).toBe('Select Recipe');
    });

    it('is required', async () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      await autocompleteIsRequired(wrapper, 'recipe-input');
    });

    it('emits changes', async () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');

      await (recipeInput as any).vm.$emit('update:modelValue', TEST_RECIPES[1]!.id);

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as MealItem).recipeId).toBe(TEST_RECIPES[1]!.id);
    });

    it('defaults the nutrition information', async () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');
      await (recipeInput as any).vm.$emit('update:modelValue', TEST_RECIPES[1]!.id);
      expect(nutritionEditor.props('modelValue')).toEqual({
        calories: TEST_RECIPES[1]!.calories,
        sodium: TEST_RECIPES[1]!.sodium,
        sugar: TEST_RECIPES[1]!.sugar,
        carbs: TEST_RECIPES[1]!.carbs,
        fat: TEST_RECIPES[1]!.fat,
        protein: TEST_RECIPES[1]!.protein,
      });
    });

    describe('for an existing recipe item', () => {
      it('is initialized based on the meal item', () => {
        wrapper = mountComponent({ modelValue: TEST_MEAL_ITEM, items: TEST_RECIPES });
        expect((wrapper.vm as any).recipeId).toBe(TEST_MEAL_ITEM.recipeId);
      });
    });
  });

  describe('units', () => {
    it('is disabled', () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      const units = wrapper.findComponent('[data-testid="units-input"]');
      const input = units.find('input');
      expect(input.element.disabled).toBe(true);
    });
  });

  describe('unit of measure', () => {
    it('is disabled', () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      const unitOfMeasure = wrapper.findComponent('[data-testid="unit-of-measure-input"]');
      const input = unitOfMeasure.find('input');
      expect(input.element.disabled).toBe(true);
    });
  });

  describe('nutritional information', () => {
    it('renders NutritionEditorRows component', () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      expect(nutritionEditor.exists()).toBe(true);
    });

    it('initializes with empty nutrition object', () => {
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });
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
      wrapper = mountComponent({ modelValue: {}, items: TEST_RECIPES });

      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      await nutritionEditor.vm.$emit('update:modelValue', nutrition);

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as MealItem).nutrition).toEqual(nutrition);
    });

    describe('for an existing recipe', () => {
      it('initializes the nutrition data', () => {
        wrapper = mountComponent({ modelValue: TEST_MEAL_ITEM, items: TEST_RECIPES });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        expect(nutritionEditor.props('modelValue')).toEqual(TEST_MEAL_ITEM.nutrition!);
      });
    });
  });
});

const TEST_MEAL_ITEM: Partial<MealItem> = {
  id: '4498eae8-b4c9-4327-b1c2-518f071981f2',
  units: 1,
  unitOfMeasure: { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
  recipeId: TEST_RECIPES[0]!.id,
  nutrition: {
    calories: 630,
    sodium: 780,
    sugar: 3,
    carbs: 55,
    fat: 35,
    protein: 28,
  },
};
