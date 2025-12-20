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
      calories: 1875,
      sugar: 45,
      protein: 65,
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

  describe('Calories Per Day Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="calories-per-day-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Calories per day');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'calories-per-day-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'calories-per-day-input');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="calories-per-day-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(2000);
    });
  });
});
