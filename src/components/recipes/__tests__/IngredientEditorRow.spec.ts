import ConfirmDialog from '@/components/core/ConfirmDialog.vue';
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import type { RecipeIngredient } from '@/models/recipe';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IngredientEditorRow from '../IngredientEditorRow.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { ingredient: RecipeIngredient }) =>
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
    wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
    expect(wrapper.exists()).toBe(true);
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(numberInput.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      const input = numberInput.find('input');
      expect(input.element.value).toBe('1');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const numberInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      await numberInput.setValue(73);
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).units).toBe(73);
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const autocomplete = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(autocomplete.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      expect((wrapper.vm as any).unitOfMeasureId).toBe('cup');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const autocomplete = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      await autocomplete.setValue('floz');
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).unitOfMeasure).toEqual(findUnitOfMeasure('floz'));
    });
  });

  describe('ingredient name', () => {
    it('renders', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const textField = wrapper.findComponent(
        '[data-testid="ingredient-name-input"]',
      ) as VueWrapper<components.VTextField>;
      expect(textField.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const textField = wrapper.findComponent(
        '[data-testid="ingredient-name-input"]',
      ) as VueWrapper<components.VTextField>;
      const input = textField.find('input');
      expect(input.element.value).toBe('Vegetable Broth');
    });

    it('emits name when text is entered', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const textField = wrapper.findComponent(
        '[data-testid="ingredient-name-input"]',
      ) as VueWrapper<components.VTextField>;
      await textField.setValue('silver bells');
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeIngredient).name).toBe('silver bells');
    });

    it('emits add-next when Ctrl+Enter is pressed', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const textField = wrapper.findComponent('[data-testid="ingredient-name-input"]');

      await textField.trigger('keydown.ctrl.enter');

      const emitted = wrapper.emitted('add-next');
      expect(emitted).toBeTruthy();
      expect(emitted?.length).toBe(1);
    });
  });

  describe('delete button', () => {
    it('renders', () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]') as VueWrapper<components.VNumberInput>;
      expect(button.exists()).toBe(true);
    });

    it('displays confirm dialog when clicked', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      await flushPromises();
      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);
    });

    it('emits delete and closes dialog when user confirms', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      await flushPromises();

      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);

      await confirmDialog.vm.$emit('confirm');
      await flushPromises();

      const emitted = wrapper.emitted('delete');
      expect(emitted?.length).toBe(1);

      const activeOverlay = document.querySelector('.v-overlay--active');
      expect(activeOverlay).toBeNull();
    });

    it('does not emit delete and closes dialog when user cancels', async () => {
      wrapper = mountComponent({ ingredient: TEST_INGREDIENTS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      await flushPromises();

      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);

      await confirmDialog.vm.$emit('cancel');
      await flushPromises();

      const emitted = wrapper.emitted('delete');
      expect(emitted).toBeUndefined();

      const activeOverlay = document.querySelector('.v-overlay--active');
      expect(activeOverlay).toBeNull();
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
