import { autocompleteIsRequired, numberInputIsRequired } from '@/components/__tests__/test-utils';
import { TEST_FOODS, TEST_RECIPES } from '@/data/__tests__/test-data';
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditorRows from '../MealItemEditorRows.vue';
import { foodItemNutrients } from '@/core/nutritional-calculations';

vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: {
  modelValue: Partial<MealItem>;
  values: (FoodItem | Recipe)[];
  type: 'food' | 'recipe';
}) => mount(MealItemEditorRows, { props, global: { plugins: [vuetify] } });

describe('Meal Item Editor Rows', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  describe('for foods', () => {
    describe('food select', () => {
      it('does not default', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        expect((wrapper.vm as any).recipeOrFoodId).toBeUndefined();
      });

      it('has the proper label', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const foodSelect = wrapper.findComponent(
          '[data-testid="recipe-or-food-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        expect(foodSelect.props('label')).toBe('Select Food');
      });

      it('is required', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        await autocompleteIsRequired(wrapper, 'recipe-or-food-input');
      });

      it('emits changes', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');

        await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_FOODS[1]!.id);

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted?.length).toBe(1);
        expect((emitted![0]![0] as MealItem).foodItemId).toBe(TEST_FOODS[1]!.id);
        expect((emitted![0]![0] as MealItem).recipeId).toBeUndefined();
      });

      describe('for an existing food item', () => {
        it('is initialized based on the meal item', () => {
          wrapper = mountComponent({ modelValue: TEST_FOOD_MEAL_ITEM, type: 'food', values: TEST_FOODS });
          expect((wrapper.vm as any).recipeOrFoodId).toBe(TEST_FOOD_MEAL_ITEM.foodItemId);
        });
      });
    });

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

      it('emits changes', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const units = wrapper.findComponent('[data-testid="units-input"]');
        await units.find('input').setValue('3');

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted?.length).toBe(1);
        expect((emitted![0]![0] as MealItem).units).toBe(3);
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

      it('emits changes', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const unitOfMeasure = wrapper.findComponent('[data-testid="unit-of-measure-input"]');

        await (unitOfMeasure as any).vm.$emit('update:modelValue', 'tbsp');

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted?.length).toBe(1);
        expect((emitted![0]![0] as MealItem).unitOfMeasure?.id).toBe('tbsp');
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

      it('is not set until a food item, number of units, and unit of measure are all set', async () => {
        (foodItemNutrients as Mock).mockReturnValueOnce({
          calories: 150,
          sodium: 100,
          sugar: 10,
          carbs: 20,
          fat: 5,
          protein: 8,
        });

        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
        await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_FOODS[1]!.id);
        expect(foodItemNutrients).not.toHaveBeenCalled();
        expect(nutritionEditor.props('modelValue')).toEqual({});

        const units = wrapper.findComponent('[data-testid="units-input"]');
        await units.find('input').setValue('3');
        expect(foodItemNutrients).not.toHaveBeenCalled();
        expect(nutritionEditor.props('modelValue')).toEqual({});

        const unitOfMeasure = wrapper.findComponent('[data-testid="unit-of-measure-input"]');
        await (unitOfMeasure as any).vm.$emit('update:modelValue', 'tbsp');
        expect(foodItemNutrients).toHaveBeenCalledExactlyOnceWith(TEST_FOODS[1], 3, {
          id: 'tbsp',
          name: 'Tablespoon',
          type: 'volume',
          system: 'customary',
          fdcId: 1001,
        });
        expect(nutritionEditor.props('modelValue')).toEqual({
          calories: 150,
          sodium: 100,
          sugar: 10,
          carbs: 20,
          fat: 5,
          protein: 8,
        });
      });

      it('clears the nutrition information if the food & unit of measure combo has no conversion', async () => {
        (foodItemNutrients as Mock).mockReturnValueOnce({
          calories: 150,
          sodium: 100,
          sugar: 10,
          carbs: 20,
          fat: 5,
          protein: 8,
        });

        wrapper = mountComponent({ modelValue: {}, type: 'food', values: TEST_FOODS });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
        await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_FOODS[1]!.id);
        const units = wrapper.findComponent('[data-testid="units-input"]');
        await units.find('input').setValue('3');
        const unitOfMeasure = wrapper.findComponent('[data-testid="unit-of-measure-input"]');
        await (unitOfMeasure as any).vm.$emit('update:modelValue', 'tbsp');
        expect(nutritionEditor.props('modelValue')).toEqual({
          calories: 150,
          sodium: 100,
          sugar: 10,
          carbs: 20,
          fat: 5,
          protein: 8,
        });
        await (unitOfMeasure as any).vm.$emit('update:modelValue', 'oz');
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
        expect((emitted![0]![0] as MealItem).nutrition).toEqual(nutrition);
      });

      describe('for an existing food item', () => {
        it('initializes the nutrition data', () => {
          wrapper = mountComponent({ modelValue: TEST_FOOD_MEAL_ITEM, type: 'food', values: TEST_FOODS });
          const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
          expect(nutritionEditor.props('modelValue')).toEqual(TEST_FOOD_MEAL_ITEM.nutrition!);
        });
      });
    });
  });

  describe('for recipes', () => {
    describe('recipe select', () => {
      it('does not default', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        expect((wrapper.vm as any).recipeOrFoodId).toBeUndefined();
      });

      it('has the proper label', () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const foodSelect = wrapper.findComponent(
          '[data-testid="recipe-or-food-input"]',
        ) as VueWrapper<components.VAutocomplete>;
        expect(foodSelect.props('label')).toBe('Select Recipe');
      });

      it('is required', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        await autocompleteIsRequired(wrapper, 'recipe-or-food-input');
      });

      it('emits changes', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');

        await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_RECIPES[1]!.id);

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted?.length).toBe(1);
        expect((emitted![0]![0] as MealItem).foodItemId).toBeUndefined();
        expect((emitted![0]![0] as MealItem).recipeId).toBe(TEST_RECIPES[1]!.id);
      });

      it('defaults the nutrition information', async () => {
        wrapper = mountComponent({ modelValue: {}, type: 'recipe', values: TEST_RECIPES });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
        const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
        await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_RECIPES[1]!.id);
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
          wrapper = mountComponent({ modelValue: TEST_RECIPE_MEAL_ITEM, type: 'recipe', values: TEST_RECIPES });
          expect((wrapper.vm as any).recipeOrFoodId).toBe(TEST_RECIPE_MEAL_ITEM.recipeId);
        });
      });
    });

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
        expect((emitted![0]![0] as MealItem).nutrition).toEqual(nutrition);
      });

      describe('for an existing food item', () => {
        it('initializes the nutrition data', () => {
          wrapper = mountComponent({ modelValue: TEST_RECIPE_MEAL_ITEM, type: 'recipe', values: TEST_RECIPES });
          const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
          expect(nutritionEditor.props('modelValue')).toEqual(TEST_RECIPE_MEAL_ITEM.nutrition!);
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
