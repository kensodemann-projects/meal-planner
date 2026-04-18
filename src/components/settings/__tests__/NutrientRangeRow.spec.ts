import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { numberInputIsRequired, numberInputMustBePositive } from '../../__tests__/test-utils';
import NutrientRangeRow from '../NutrientRangeRow.vue';

const vuetify = createVuetify({ components, directives });

const mountComponent = (props: { nutrient?: string; unit?: string; min?: number; max?: number } = {}) =>
  mount(NutrientRangeRow, {
    props: {
      nutrient: props.nutrient ?? 'Calories',
      unit: props.unit ?? 'kcal',
      min: props.min ?? 100,
      max: props.max ?? 200,
      minTestId: 'min-input',
      maxTestId: 'max-input',
    },
    global: { plugins: [vuetify] },
  });

describe('NutrientRangeRow', () => {
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

  describe('minimum input', () => {
    it('renders with the correct label', () => {
      wrapper = mountComponent({ nutrient: 'Protein', unit: 'grams' });
      const input = wrapper.findComponent('[data-testid="min-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Minimum Daily Protein (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'min-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'min-input');
    });

    it('must be less than the maximum value', async () => {
      wrapper = mountComponent({ nutrient: 'Calories', min: 100, max: 200 });
      const minInput = wrapper.findComponent('[data-testid="min-input"]') as VueWrapper<components.VNumberInput>;
      const input = minInput.find('input');

      expect(minInput.text()).not.toContain('Minimum calories must be less than maximum calories');
      await input.trigger('focus');
      await input.setValue(200);
      await input.trigger('blur');
      expect(minInput.text()).toContain('Minimum calories must be less than maximum calories');
      await input.setValue(100);
      await input.trigger('blur');
      expect(minInput.text()).not.toContain('Minimum calories must be less than maximum calories');
    });

    it('uses the nutrient name (lowercased) in the validation message', async () => {
      wrapper = mountComponent({ nutrient: 'Sodium', min: 100, max: 200 });
      const minInput = wrapper.findComponent('[data-testid="min-input"]') as VueWrapper<components.VNumberInput>;
      const input = minInput.find('input');

      await input.trigger('focus');
      await input.setValue(200);
      await input.trigger('blur');
      expect(minInput.text()).toContain('Minimum sodium must be less than maximum sodium');
    });

    it('is initialized with the min prop value', () => {
      wrapper = mountComponent({ min: 150 });
      const input = wrapper.findComponent('[data-testid="min-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.props('modelValue')).toBe(150);
    });

    it('emits update:min when changed', async () => {
      wrapper = mountComponent({ min: 100, max: 300 });
      const input = wrapper.findComponent('[data-testid="min-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(120);
      const emitted = wrapper.emitted('update:min');
      expect(emitted?.length).toBe(1);
      expect(emitted![0]![0]).toBe(120);
    });
  });

  describe('maximum input', () => {
    it('renders with the correct label', () => {
      wrapper = mountComponent({ nutrient: 'Fat', unit: 'grams' });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Maximum Daily Fat (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-input');
    });

    it('must be greater than the minimum value', async () => {
      wrapper = mountComponent({ nutrient: 'Calories', min: 100, max: 200 });
      const maxInput = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      const input = maxInput.find('input');

      expect(maxInput.text()).not.toContain('Maximum calories must be greater than minimum calories');
      await input.trigger('focus');
      await input.setValue(100);
      await input.trigger('blur');
      expect(maxInput.text()).toContain('Maximum calories must be greater than minimum calories');
      await input.setValue(200);
      await input.trigger('blur');
      expect(maxInput.text()).not.toContain('Maximum calories must be greater than minimum calories');
    });

    it('uses the nutrient name (lowercased) in the validation message', async () => {
      wrapper = mountComponent({ nutrient: 'Sodium', min: 100, max: 200 });
      const maxInput = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      const input = maxInput.find('input');

      await input.trigger('focus');
      await input.setValue(100);
      await input.trigger('blur');
      expect(maxInput.text()).toContain('Maximum sodium must be greater than minimum sodium');
    });

    it('is initialized with the max prop value', () => {
      wrapper = mountComponent({ max: 250 });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.props('modelValue')).toBe(250);
    });

    it('emits update:max when changed', async () => {
      wrapper = mountComponent({ min: 100, max: 200 });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(250);
      const emitted = wrapper.emitted('update:max');
      expect(emitted?.length).toBe(1);
      expect(emitted![0]![0]).toBe(250);
    });
  });
});
