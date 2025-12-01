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

const mountComponent = (props: { foods: FoodItem[]; ingredient: RecipeIngredient }) =>
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
    wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
    expect(wrapper.exists()).toBe(true);
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(numberInput.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      const input = numberInput.find('input');
      expect(input.element.value).toBe('1');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      await numberInput.setValue(73);
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).units).toBe(73);
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const autocomplete = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(autocomplete.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      expect((wrapper.vm as any).unitOfMeasureId).toBe('cup');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const autocomplete = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      await autocomplete.setValue('floz');
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).unitOfMeasure).toEqual(findUnitOfMeasure('floz'));
    });
  });

  describe('food item', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const combo = wrapper.findComponent('[data-testid="food-item-input"]') as VueWrapper<components.VCombobox>;
      expect(combo.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const combo = wrapper.findComponent('[data-testid="food-item-input"]') as VueWrapper<components.VCombobox>;
      const input = combo.find('input');
      expect(input.element.value).toBe('Vegetable Broth');
    });

    it('emits name and id when a food is selected', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const combo = wrapper.findComponent('[data-testid="food-item-input"]') as VueWrapper<components.VCombobox>;
      await combo.setValue(TEST_FOODS[2]);
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).foodId).toBe(TEST_FOODS[2]?.id);
      expect((emitted![0]![0] as RecipeIngredient).name).toBe(TEST_FOODS[2]?.name);
    });

    it('emits just name when free-form text is entered', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const combo = wrapper.findComponent('[data-testid="food-item-input"]') as VueWrapper<components.VCombobox>;
      await combo.setValue('silver bells');
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).foodId).toBe(null);
      expect((emitted![0]![0] as RecipeIngredient).name).toBe('silver bells');
    });
  });

  describe('delete button', () => {
    it('renders', () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]') as VueWrapper<components.VNumberInput>;
      expect(button.exists()).toBe(true);
    });

    it('emits delete on click', async () => {
      wrapper = mountComponent({ foods: TEST_FOODS, ingredient: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]') as VueWrapper<components.VNumberInput>;
      await button.trigger('click');
      expect(wrapper.emitted('delete')).toHaveLength(1);
    });
  });
});

const TEST_INGREDIENTS = [
  {
    id: '5031a23c-3605-4b8a-b66b-b5d6d181fdd4',
    units: 28,
    unitOfMeasure: findUnitOfMeasure('oz'),
    name: 'Crushed Tomatoes',
  },
  {
    id: 'a8125d02-16d9-4402-b0cd-26e6b3542c00',
    units: 1,
    unitOfMeasure: findUnitOfMeasure('cup'),
    name: 'Vegetable Broth',
  },
  {
    id: '7e30d5ee-e208-4f8e-b5a9-540b0ac32ced',
    units: 0.5,
    unitOfMeasure: findUnitOfMeasure('cup'),
    name: 'Heavy Cream',
  },
  {
    id: 'bf71cfa8-86fb-482b-a378-aa0749ef68fc',
    units: 0.5,
    unitOfMeasure: findUnitOfMeasure('item'),
    name: 'Chopped Onion',
  },
];
