import { TEST_FOODS, TEST_RECIPES } from '@/data/__tests__/test-data';
import type { FoodItem } from '@/models/food';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditorCard from '../MealItemEditorCard.vue';
import { foodItemNutrients } from '@/core/nutritional-calculations';

vi.mock('@/core/nutritional-calculations');

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

      describe('the save button', () => {
        it('begins disabled', () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is disabled until all required fields are filled in', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
          // Choosing a recipe will default all of the other inputs, so this should enable the button
          const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
          await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_RECIPE_MEAL_ITEM.recipeId);
          await flushPromises();
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });
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

      describe('the save button', () => {
        it('begins disabled', () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is disabled until all required fields are filled in', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
          const unitOfMeasureInput = wrapper.findComponent('[data-testid="unit-of-measure-input"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
          await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_FOOD_MEAL_ITEM.foodItemId);
          await (unitOfMeasureInput as any).vm.$emit('update:modelValue', TEST_FOOD_MEAL_ITEM.unitOfMeasure.id);
          await inputs.unitsInput.setValue(2);
          await inputs.caloriesInput.setValue(200);
          await inputs.sodiumInput.setValue(650);
          await inputs.sugarInput.setValue(12);
          await inputs.carbsInput.setValue(16);
          await inputs.fatInput.setValue(24);
          await inputs.proteinInput.setValue(18);
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });
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

      describe('the save button', () => {
        it('begins disabled', () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is enabled when a value is validly changed', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
          await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_RECIPES[1]!.id);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_RECIPE_MEAL_ITEM.recipeId);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.caloriesInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.caloriesInput.setValue(TEST_RECIPE_MEAL_ITEM.nutrition.calories);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.sugarInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.sugarInput.setValue(TEST_RECIPE_MEAL_ITEM.nutrition.sugar);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.carbsInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.carbsInput.setValue(TEST_RECIPE_MEAL_ITEM.nutrition.carbs);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.fatInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.fatInput.setValue(TEST_RECIPE_MEAL_ITEM.nutrition.fat);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.proteinInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.proteinInput.setValue(TEST_RECIPE_MEAL_ITEM.nutrition.protein);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.sodiumInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.sodiumInput.setValue(TEST_RECIPE_MEAL_ITEM.nutrition.sodium);
          expect(saveButton.attributes('disabled')).toBeDefined();
        });
      });
    });

    describe('a food', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'food', items: TEST_FOODS, mealItem: TEST_FOOD_MEAL_ITEM });
        (foodItemNutrients as Mock).mockReturnValue(TEST_FOOD_MEAL_ITEM.nutrition);
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

      describe('the save button', () => {
        it('begins disabled', () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is enabled when a value is validly changed', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          const recipeOrFoodInput = wrapper.findComponent('[data-testid="recipe-or-food-input"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
          await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_FOODS[1]!.id);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await (recipeOrFoodInput as any).vm.$emit('update:modelValue', TEST_FOOD_MEAL_ITEM.foodItemId);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.unitsInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.unitsInput.setValue(TEST_FOOD_MEAL_ITEM.units);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.caloriesInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.caloriesInput.setValue(TEST_FOOD_MEAL_ITEM.nutrition.calories);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.sugarInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.sugarInput.setValue(TEST_FOOD_MEAL_ITEM.nutrition.sugar);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.carbsInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.carbsInput.setValue(TEST_FOOD_MEAL_ITEM.nutrition.carbs);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.fatInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.fatInput.setValue(TEST_FOOD_MEAL_ITEM.nutrition.fat);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.proteinInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.proteinInput.setValue(TEST_FOOD_MEAL_ITEM.nutrition.protein);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.sodiumInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.sodiumInput.setValue(TEST_FOOD_MEAL_ITEM.nutrition.sodium);
          expect(saveButton.attributes('disabled')).toBeDefined();
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
