import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IngredientEditorRow from '../IngredientEditorRow.vue';
import { TEST_FOODS } from '@/data/__tests__/test-data';
import type { RecipeIngredient } from '@/models/recipe';
import type { FoodItem } from '@/models/food';
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { foods: FoodItem[]; modelValue: RecipeIngredient }) =>
  mount(IngredientEditorRow, { props, global: { plugins: [vuetify] } });

describe('Ingredient Editor Row', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
    expect(wrapper.exists()).toBe(true);
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(numberInput.exists()).toBe(true);
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      await unitsInput.setValue(73);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).units).toBe(73);
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
      const autocomplete = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(autocomplete.exists()).toBe(true);
    });
  });

  describe('food item', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
      const combo = wrapper.findComponent('[data-testid="food-item-input"]') as VueWrapper<components.VCombobox>;
      expect(combo.exists()).toBe(true);
    });
  });

  describe('delete button', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]') as VueWrapper<components.VNumberInput>;
      expect(button.exists()).toBe(true);
    });

    it('emits delete on click', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, modelValue: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]') as VueWrapper<components.VNumberInput>;
      await button.trigger('click');
      expect(wrapper.emitted('delete')).toHaveLength(1);
    });
  });
});

const TEST_INGREDIENTS = [
  { units: 28, unitOfMeasure: findUnitOfMeasure('oz'), name: 'Crushed Tomatoes' },
  { units: 1, unitOfMeasure: findUnitOfMeasure('cup'), name: 'Vegetable Broth' },
  { units: 0.5, unitOfMeasure: findUnitOfMeasure('cup'), name: 'Heavy Cream' },
  { units: 0.5, unitOfMeasure: findUnitOfMeasure('item'), name: 'Chopped Onion' },
];
