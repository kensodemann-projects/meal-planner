import { TEST_FOOD } from '@/data/__tests__/test-data';
import type { Portion } from '@/models/portion';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PortionEditorRows from '../PortionEditorRows.vue';
import { autocompleteIsRequired, numberInputIsRequired } from './test-utils';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (modelValue: Partial<Portion>) =>
  mount(PortionEditorRows, { props: { modelValue }, global: { plugins: [vuetify] } });

describe('Portion Edit Grid', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent({});
    expect(wrapper.exists()).toBe(true);
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.exists()).toBe(true);
      expect(unitsInput.props('label')).toBe('Units');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'units-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, units: 42 });
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.find('input').element.value).toBe('42');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, units: 42 });
      const input = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(73);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).units).toBe(73);
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const uomInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(uomInput.exists()).toBe(true);
      expect(uomInput.props('label')).toBe('Unit of Measure');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await autocompleteIsRequired(wrapper, 'unit-of-measure-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent(TEST_FOOD);
      expect((wrapper.vm as any).unitOfMeasureId).toBe(TEST_FOOD.unitOfMeasure.id);
    });
  });

  describe('grams', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.exists()).toBe(true);
      expect(gramsInput.props('label')).toBe('Grams');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'grams-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, grams: 420 });
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.find('input').element.value).toBe('420');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent(TEST_FOOD);
      const input = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(124);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).grams).toBe(124);
    });
  });

  describe('NutritionEditorRows integration', () => {
    it('renders NutritionEditorRows component', () => {
      wrapper = mountComponent({});
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      expect(nutritionEditor.exists()).toBe(true);
    });

    it('passes model value to NutritionEditorRows', () => {
      const portion = { ...TEST_FOOD, calories: 143, sodium: 19, sugar: 92 };
      wrapper = mountComponent(portion);
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });
      expect(nutritionEditor.props('modelValue')).toMatchObject({
        calories: 143,
        sodium: 19,
        sugar: 92,
      });
    });

    it('emits updates when NutritionEditorRows changes', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, calories: 42 });
      const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });

      await nutritionEditor.vm.$emit('update:modelValue', {
        ...TEST_FOOD,
        calories: 173,
      });

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).calories).toBe(173);
    });
  });
});
