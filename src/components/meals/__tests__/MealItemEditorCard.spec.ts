import { TEST_FOODS, TEST_RECIPES } from '@/data/__tests__/test-data';
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditorCard from '../MealItemEditorCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (
  props: { type: 'food' | 'recipe'; items: (FoodItem | Recipe)[]; mealItem?: MealItem } = {
    type: 'food',
    items: TEST_FOODS,
  },
) => mount(MealItemEditorCard, { props, global: { plugins: [vuetify] } });

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
  recipeOrFoodInput: wrapper.findComponent('[data-testid="recipe-or-food-input"]').find('input'),
  unitsInput: wrapper.findComponent('[data-testid="units-input"]').find('input'),
  unitOfMeasureInput: wrapper.findComponent('[data-testid="unit-of-measure-input"]').find('input'),
  caloriesInput: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
  sodiumInput: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
  sugarInput: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
  carbsInput: wrapper.findComponent('[data-testid="carbs-input"]').find('input'),
  fatInput: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
  proteinInput: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
});

describe('Meal Item Editor Card', () => {
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

  describe('adding', () => {
    describe('a recipe', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'recipe', items: TEST_RECIPES });
      });

      it('defaults the units and unit of measure', () => {
        const inputs = getInputs(wrapper);
        // it is hard to directly test the autocomplete value, so we check the underlying model
        expect((wrapper.vm as any).editMealItem.recipeId).toBeUndefined();
        expect((wrapper.vm as any).editMealItem.unitOfMeasure.id).toBe('serving');
        expect(inputs.unitsInput.element.value).toBe('1');
        expect(inputs.caloriesInput.element.value).toBe('');
        expect(inputs.sodiumInput.element.value).toBe('');
        expect(inputs.sugarInput.element.value).toBe('');
        expect(inputs.carbsInput.element.value).toBe('');
        expect(inputs.fatInput.element.value).toBe('');
        expect(inputs.proteinInput.element.value).toBe('');
      });

      describe('the cancel button', () => {
        it('renders', () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          expect(cancelButton.exists()).toBe(true);
        });

        it('emits the "cancel" event on click', async () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });
    });

    describe('a food', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'food', items: TEST_FOODS });
      });

      it('does not default anything', () => {
        const inputs = getInputs(wrapper);
        // it is hard to directly test the autocomplete value, so we check the underlying model
        expect((wrapper.vm as any).editMealItem.foodId).toBeUndefined();
        expect((wrapper.vm as any).editMealItem.unitOfMeasure?.id).toBeUndefined();
        expect(inputs.recipeOrFoodInput.element.value).toBe('');
        expect(inputs.unitsInput.element.value).toBe('');
        expect(inputs.caloriesInput.element.value).toBe('');
        expect(inputs.sodiumInput.element.value).toBe('');
        expect(inputs.sugarInput.element.value).toBe('');
        expect(inputs.carbsInput.element.value).toBe('');
        expect(inputs.fatInput.element.value).toBe('');
        expect(inputs.proteinInput.element.value).toBe('');
      });

      describe('the cancel button', () => {
        it('renders', () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          expect(cancelButton.exists()).toBe(true);
        });

        it('emits the "cancel" event on click', async () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });
    });
  });

  describe('updating', () => {
    describe('a recipe', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'recipe', items: TEST_RECIPES, mealItem: TEST_RECIPE_MEAL_ITEM });
      });

      it('initializes the inputs', () => {
        const inputs = getInputs(wrapper);
        // it is hard to directly test the autocomplete value, so we check the underlying model
        expect((wrapper.vm as any).editMealItem.recipeId).toBe(TEST_RECIPE_MEAL_ITEM.recipeId);
        expect((wrapper.vm as any).editMealItem.unitOfMeasure.id).toBe('serving');
        expect(inputs.unitsInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.units.toString());
        expect(inputs.caloriesInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.nutrition.calories.toString());
        expect(inputs.sodiumInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.nutrition.sodium.toString());
        expect(inputs.sugarInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.nutrition.sugar.toString());
        expect(inputs.carbsInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.nutrition.carbs.toString());
        expect(inputs.fatInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.nutrition.fat.toString());
        expect(inputs.proteinInput.element.value).toBe(TEST_RECIPE_MEAL_ITEM.nutrition.protein.toString());
      });

      describe('the cancel button', () => {
        it('renders', () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          expect(cancelButton.exists()).toBe(true);
        });

        it('emits the "cancel" event on click', async () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });
    });

    describe('a food', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'food', items: TEST_FOODS, mealItem: TEST_FOOD_MEAL_ITEM });
      });

      it('initializes the inputs', () => {
        const inputs = getInputs(wrapper);
        // it is hard to directly test the autocomplete value, so we check the underlying model
        expect((wrapper.vm as any).editMealItem.foodItemId).toBe(TEST_FOOD_MEAL_ITEM.foodItemId);
        expect((wrapper.vm as any).editMealItem.unitOfMeasure).toEqual(TEST_FOOD_MEAL_ITEM.unitOfMeasure);
        expect(inputs.unitsInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.units.toString());
        expect(inputs.caloriesInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.nutrition.calories.toString());
        expect(inputs.sodiumInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.nutrition.sodium.toString());
        expect(inputs.sugarInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.nutrition.sugar.toString());
        expect(inputs.carbsInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.nutrition.carbs.toString());
        expect(inputs.fatInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.nutrition.fat.toString());
        expect(inputs.proteinInput.element.value).toBe(TEST_FOOD_MEAL_ITEM.nutrition.protein.toString());
      });

      describe('the cancel button', () => {
        it('renders', () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          expect(cancelButton.exists()).toBe(true);
        });

        it('emits the "cancel" event on click', async () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });
    });
  });
});

const TEST_FOOD_MEAL_ITEM: MealItem = {
  id: 'c83a0eed-f113-4d83-af2f-27734807df99',
  units: 2,
  unitOfMeasure: { id: 'cup', name: 'Cup', type: 'volume', system: 'customary', fdcId: 1000 },
  name: TEST_FOODS[0]!.name,
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

const TEST_RECIPE_MEAL_ITEM: MealItem = {
  id: '4498eae8-b4c9-4327-b1c2-518f071981f2',
  units: 1,
  unitOfMeasure: { id: 'serving', name: 'Serving', type: 'quantity', system: 'none' },
  name: TEST_RECIPES[0]!.name,
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
