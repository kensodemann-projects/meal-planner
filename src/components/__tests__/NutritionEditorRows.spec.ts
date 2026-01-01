import { TEST_FOOD } from '@/data/__tests__/test-data';
import type { Nutrition } from '@/models/nutrition';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionEditorRows from '../NutritionEditorRows.vue';
import { numberInputIsRequired } from './test-utils';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (modelValue: Partial<Nutrition>) =>
  mount(NutritionEditorRows, { props: { modelValue }, global: { plugins: [vuetify] } });

describe('NutritionEditorRows', () => {
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

  describe('calories', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const calsInput = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      expect(calsInput.exists()).toBe(true);
      expect(calsInput.props('label')).toBe('Calories');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'calories-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, calories: 143 });
      const calsInput = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      expect(calsInput.find('input').element.value).toBe('143');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, calories: 42 });
      const input = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(173);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Nutrition).calories).toBe(173);
    });
  });

  describe('sodium', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.exists()).toBe(true);
      expect(sodiumInput.props('label')).toBe('Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'sodium-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, sodium: 19 });
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.find('input').element.value).toBe('19');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, sodium: 42 });
      const input = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(267);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Nutrition).sodium).toBe(267);
    });
  });

  describe('sugar', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(sugarInput.exists()).toBe(true);
      expect(sugarInput.props('label')).toBe('Sugar (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'sugar-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, sugar: 143 });
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(sugarInput.find('input').element.value).toBe('143');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, sugar: 92 });
      const input = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(486);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Nutrition).sugar).toBe(486);
    });
  });

  describe('carbs', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(carbsInput.exists()).toBe(true);
      expect(carbsInput.props('label')).toBe('Total Carbs (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'carbs-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, carbs: 18 });
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(carbsInput.find('input').element.value).toBe('18');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, carbs: 13 });
      const input = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(27);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Nutrition).carbs).toBe(27);
    });
  });

  describe('fat', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(fatInput.exists()).toBe(true);
      expect(fatInput.props('label')).toBe('Fat (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'fat-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, fat: 8 });
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(fatInput.find('input').element.value).toBe('8');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, fat: 4 });
      const input = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(19);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Nutrition).fat).toBe(19);
    });
  });

  describe('protein', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.exists()).toBe(true);
      expect(proteinInput.props('label')).toBe('Protein (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      await numberInputIsRequired(wrapper, 'protein-input');
    });

    it('is initialized properly', () => {
      wrapper = mountComponent({ ...TEST_FOOD, protein: 12 });
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.find('input').element.value).toBe('12');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, protein: 14 });
      const input = wrapper.findComponent('[data-testid="protein-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(23);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Nutrition).protein).toBe(23);
    });
  });
});
