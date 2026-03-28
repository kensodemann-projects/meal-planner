import { TEST_RECIPES } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import type { Recipe } from '@/models/recipe';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditorCard from '../MealItemEditorCard.vue';

vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (
  props: { items: Recipe[]; mealItem: Partial<MealItem> } = {
    items: TEST_RECIPES,
    mealItem: {},
  },
) => mount(MealItemEditorCard, { props, global: { plugins: [vuetify] } });

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
  recipeInput: wrapper.findComponent('[data-testid="recipe-input"]').find('input'),
  servingsInput: wrapper.findComponent('[data-testid="servings-input"]').find('input'),
  caloriesInput: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
  sodiumInput: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
  sugarInput: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
  carbsInput: wrapper.findComponent('[data-testid="carbs-input"]').find('input'),
  fatInput: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
  proteinInput: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
});

const TEST_MEAL_ITEM: MealItem = {
  id: '4498eae8-b4c9-4327-b1c2-518f071981f2',
  servings: 1,
  name: TEST_RECIPES[0]!.name,
  recipeId: TEST_RECIPES[0]!.id!,
  nutrition: {
    calories: 157.5,
    sodium: 195,
    sugar: 0.75,
    carbs: 13.75,
    fat: 8.75,
    protein: 7,
  },
};

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
        wrapper = mountComponent({ items: TEST_RECIPES, mealItem: {} });
      });

      it('defaults the servings', () => {
        const inputs = getInputs(wrapper);
        // it is hard to directly test the autocomplete value, so we check the underlying model
        expect((wrapper.vm as any).editMealItem.recipeId).toBeUndefined();
        expect(inputs.servingsInput.element.value).toBe('1');
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
          const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');
          await (recipeInput as any).vm.$emit('update:modelValue', TEST_MEAL_ITEM.recipeId);
          await flushPromises();
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });

        it('emits "save" with the data', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');
          await (recipeInput as any).vm.$emit('update:modelValue', TEST_MEAL_ITEM.recipeId);
          await flushPromises();
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          expect(wrapper.emitted('save')?.[0]).toEqual([
            {
              id: expect.any(String),
              recipeId: '1',
              name: 'Classic Spaghetti Carbonara',
              servings: 1,
              nutrition: {
                calories: 157.5,
                carbs: 13.75,
                fat: 8.75,
                protein: 7,
                sodium: 195,
                sugar: 0.75,
              },
            },
          ]);
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
        wrapper = mountComponent({ items: TEST_RECIPES, mealItem: TEST_MEAL_ITEM });
      });

      it('initializes the inputs', () => {
        const inputs = getInputs(wrapper);
        // it is hard to directly test the autocomplete value, so we check the underlying model
        expect((wrapper.vm as any).editMealItem.recipeId).toBe(TEST_MEAL_ITEM.recipeId);
        expect(inputs.servingsInput.element.value).toBe(TEST_MEAL_ITEM.servings.toString());
        expect(inputs.caloriesInput.element.value).toBe(TEST_MEAL_ITEM.nutrition.calories.toString());
        expect(inputs.sodiumInput.element.value).toBe(TEST_MEAL_ITEM.nutrition.sodium.toString());
        expect(inputs.sugarInput.element.value).toBe(TEST_MEAL_ITEM.nutrition.sugar.toString());
        expect(inputs.carbsInput.element.value).toBe(TEST_MEAL_ITEM.nutrition.carbs.toString());
        expect(inputs.fatInput.element.value).toBe(TEST_MEAL_ITEM.nutrition.fat.toString());
        expect(inputs.proteinInput.element.value).toBe(TEST_MEAL_ITEM.nutrition.protein.toString());
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
          const recipeInput = wrapper.findComponent('[data-testid="recipe-input"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
          await (recipeInput as any).vm.$emit('update:modelValue', TEST_RECIPES[1]!.id);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await (recipeInput as any).vm.$emit('update:modelValue', TEST_MEAL_ITEM.recipeId);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.caloriesInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.caloriesInput.setValue(TEST_MEAL_ITEM.nutrition.calories);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.sugarInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.sugarInput.setValue(TEST_MEAL_ITEM.nutrition.sugar);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.carbsInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.carbsInput.setValue(TEST_MEAL_ITEM.nutrition.carbs);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.fatInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.fatInput.setValue(TEST_MEAL_ITEM.nutrition.fat);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.proteinInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.proteinInput.setValue(TEST_MEAL_ITEM.nutrition.protein);
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.sodiumInput.setValue(1);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          await inputs.sodiumInput.setValue(TEST_MEAL_ITEM.nutrition.sodium);
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('emits "save" with the data as updated', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          await inputs.caloriesInput.setValue(631);
          await inputs.sodiumInput.setValue(781);
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          expect(wrapper.emitted('save')?.[0]).toEqual([
            {
              ...TEST_MEAL_ITEM,
              nutrition: {
                ...TEST_MEAL_ITEM.nutrition,
                calories: 631,
                sodium: 781,
              },
            },
          ]);
        });
      });
    });
  });
});
