import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { numberInputIsRequired, numberInputMustBePositive } from '../../__tests__/test-utils';
import NutrientMaxRow from '../NutrientMaxRow.vue';

const vuetify = createVuetify({ components, directives });

const mountComponent = (props: { nutrient?: string; unit?: string; max?: number } = {}) =>
  mount(NutrientMaxRow, {
    props: {
      nutrient: props.nutrient ?? 'Sugar',
      unit: props.unit ?? 'grams',
      max: props.max ?? 45,
      maxTestId: 'max-input',
    },
    global: { plugins: [vuetify] },
  });

describe('NutrientMaxRow', () => {
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

  describe('maximum input', () => {
    it('renders with the correct label', () => {
      wrapper = mountComponent({ nutrient: 'Sugar', unit: 'grams' });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Maximum Daily Sugar (grams)');
    });

    it('uses the nutrient and unit in the label', () => {
      wrapper = mountComponent({ nutrient: 'Sodium', unit: 'mg' });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.props('label')).toBe('Maximum Daily Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-input');
    });

    it('is initialized with the max prop value', () => {
      wrapper = mountComponent({ max: 75 });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.props('modelValue')).toBe(75);
    });

    it('emits update:max when changed', async () => {
      wrapper = mountComponent({ max: 45 });
      const input = wrapper.findComponent('[data-testid="max-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(60);
      const emitted = wrapper.emitted('update:max');
      expect(emitted?.length).toBe(1);
      expect(emitted![0]![0]).toBe(60);
    });
  });
});
