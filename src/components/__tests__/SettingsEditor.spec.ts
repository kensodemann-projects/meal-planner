import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SettingsEditor from '../SettingsEditor.vue';
import { numberInputIsRequired, numberInputMustBePositive } from './test-utils';
import type { Settings } from '@/models/settings';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (
  props: { settings: Settings } = {
    settings: {
      dailyCalorieLimit: 1875,
      dailySugarLimit: 45,
      dailyProteinTarget: 65,
      tolerance: 8,
      cheatDays: 3,
      weekStartDay: 2,
    },
  },
) => mount(SettingsEditor, { props, global: { plugins: [vuetify] } });

describe('SettingsEditor', () => {
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

  describe('Daily Calorie Limit Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Daily Calorie Limit (kcal)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'daily-calorie-limit-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'daily-calorie-limit-input');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(1875);
    });
  });

  describe('Daily Sugar Limit Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-sugar-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Daily Sugar Limit (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'daily-sugar-limit-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'daily-sugar-limit-input');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-sugar-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(45);
    });
  });

  describe('Daily Protein Target Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-protein-target-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Daily Protein Target (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'daily-protein-target-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'daily-protein-target-input');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-protein-target-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(65);
    });
  });
});
