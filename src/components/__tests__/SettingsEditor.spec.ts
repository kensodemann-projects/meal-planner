import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SettingsEditor from '../SettingsEditor.vue';
import { numberInputIsRequired, numberInputMustBePositive, numberInputMustBeZeroOrGreater } from './test-utils';
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

  describe('Tolerance', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Tolerance (%)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'tolerance-input');
    });

    it('must be zero or greater', async () => {
      wrapper = mountComponent();
      await numberInputMustBeZeroOrGreater(wrapper, 'tolerance-input');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(8);
    });
  });

  describe('Cheat Days', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="cheat-days-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Cheat Days per Week');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'cheat-days-input');
    });

    it('must be zero or greater', async () => {
      wrapper = mountComponent();
      await numberInputMustBeZeroOrGreater(wrapper, 'cheat-days-input');
    });

    it('must be seven or less', async () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="cheat-days-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = caloriesInput.find('input');

      expect(caloriesInput.text()).not.toContain('must be 7 or fewer');
      await input.trigger('focus');
      await input.setValue(8);
      await input.trigger('blur');
      expect(caloriesInput.text()).toContain('must be 7 or fewer');
      await input.setValue(7);
      await input.trigger('blur');
      expect(caloriesInput.text()).not.toContain('must be 7 or fewer');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="cheat-days-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(3);
    });
  });

  describe('Week Start Day', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(weekStartDayInput.exists()).toBe(true);
      expect(weekStartDayInput.props('label')).toBe('Week Start Day');
    });

    it('has the correct items', () => {
      wrapper = mountComponent();
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      const items = weekStartDayInput.props('items');
      expect(items).toEqual([
        { title: 'Sunday', value: 0 },
        { title: 'Monday', value: 1 },
        { title: 'Tuesday', value: 2 },
        { title: 'Wednesday', value: 3 },
        { title: 'Thursday', value: 4 },
        { title: 'Friday', value: 5 },
        { title: 'Saturday', value: 6 },
      ]);
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(weekStartDayInput.props('modelValue')).toBe(2);
    });
  });

  describe('Reset Button', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const resetButton = wrapper.find('[data-testid="reset-button"]');
      expect(resetButton.exists()).toBe(true);
    });

    it('resets the settings values when clicked', async () => {
      wrapper = mountComponent();

      // Modify multiple fields
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const sugarInput = wrapper.findComponent(
        '[data-testid="daily-sugar-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const proteinInput = wrapper.findComponent(
        '[data-testid="daily-protein-target-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const cheatDaysInput = wrapper.findComponent(
        '[data-testid="cheat-days-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;

      await caloriesInput.setValue(2100);
      await sugarInput.setValue(55);
      await proteinInput.setValue(80);
      await toleranceInput.setValue(12);
      await cheatDaysInput.setValue(2);
      await weekStartDayInput.setValue(1);

      const resetButton = wrapper.find('[data-testid="reset-button"]');
      await resetButton.trigger('click');

      expect(caloriesInput.props('modelValue')).toBe(1875);
      expect(sugarInput.props('modelValue')).toBe(45);
      expect(proteinInput.props('modelValue')).toBe(65);
      expect(toleranceInput.props('modelValue')).toBe(8);
      expect(cheatDaysInput.props('modelValue')).toBe(3);
      expect(weekStartDayInput.props('modelValue')).toBe(2);
    });

    it('disables the save button on click', async () => {
      wrapper = mountComponent();

      const saveButton = wrapper.find('[data-testid="save-button"]');
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await caloriesInput.setValue(2100);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();

      const resetButton = wrapper.find('[data-testid="reset-button"]');
      await resetButton.trigger('click');
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('Save Button', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.exists()).toBe(true);
    });

    it('is disabled when form is not modified', () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('is enabled when form is valid and modified', async () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;

      await caloriesInput.setValue(2000);
      await flushPromises();

      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('emits save event with updated settings when clicked', async () => {
      wrapper = mountComponent();

      // Modify multiple fields
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const sugarInput = wrapper.findComponent(
        '[data-testid="daily-sugar-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const proteinInput = wrapper.findComponent(
        '[data-testid="daily-protein-target-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const cheatDaysInput = wrapper.findComponent(
        '[data-testid="cheat-days-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;

      await caloriesInput.setValue(2100);
      await sugarInput.setValue(55);
      await proteinInput.setValue(80);
      await toleranceInput.setValue(12);
      await cheatDaysInput.setValue(2);
      await weekStartDayInput.setValue(1);
      await flushPromises();

      const saveButton = wrapper.find('[data-testid="save-button"]');
      await saveButton.trigger('click');

      expect(wrapper.emitted('save')).toBeTruthy();
      expect(wrapper.emitted('save')?.length).toBe(1);
      expect(wrapper.emitted('save')?.[0]).toEqual([
        {
          dailyCalorieLimit: 2100,
          dailySugarLimit: 55,
          dailyProteinTarget: 80,
          tolerance: 12,
          cheatDays: 2,
          weekStartDay: 1,
        },
      ]);
    });
  });

  describe('watchEffect (Props Update)', () => {
    it('resets form when settings prop changes', async () => {
      wrapper = mountComponent({
        settings: {
          dailyCalorieLimit: 1800,
          dailySugarLimit: 40,
          dailyProteinTarget: 60,
          tolerance: 5,
          cheatDays: 2,
          weekStartDay: 1,
        },
      });

      // Verify initial values
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(1800);

      // Change the form value
      await caloriesInput.setValue(2500);
      await flushPromises();
      expect(caloriesInput.props('modelValue')).toBe(2500);

      // Update props - watchEffect should reset the form
      await wrapper.setProps({
        settings: {
          dailyCalorieLimit: 2200,
          dailySugarLimit: 50,
          dailyProteinTarget: 70,
          tolerance: 10,
          cheatDays: 1,
          weekStartDay: 0,
        },
      });
      await flushPromises();

      // Verify all fields were reset to new prop values
      expect(caloriesInput.props('modelValue')).toBe(2200);

      const sugarInput = wrapper.findComponent(
        '[data-testid="daily-sugar-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sugarInput.props('modelValue')).toBe(50);

      const proteinInput = wrapper.findComponent(
        '[data-testid="daily-protein-target-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.props('modelValue')).toBe(70);

      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(toleranceInput.props('modelValue')).toBe(10);

      const cheatDaysInput = wrapper.findComponent(
        '[data-testid="cheat-days-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(cheatDaysInput.props('modelValue')).toBe(1);

      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(weekStartDayInput.props('modelValue')).toBe(0);
    });

    it('resets isModified state when props change', async () => {
      wrapper = mountComponent({
        settings: {
          dailyCalorieLimit: 1800,
          dailySugarLimit: 40,
          dailyProteinTarget: 60,
          tolerance: 5,
          cheatDays: 2,
          weekStartDay: 1,
        },
      });

      const saveButton = wrapper.find('[data-testid="save-button"]');

      // Initially unmodified
      expect(saveButton.attributes('disabled')).toBeDefined();

      // Modify the form
      const caloriesInput = wrapper.findComponent(
        '[data-testid="daily-calorie-limit-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await caloriesInput.setValue(2000);
      await flushPromises();

      // Should be enabled after modification
      expect(saveButton.attributes('disabled')).toBeUndefined();

      // Update props - should reset and disable save button
      await wrapper.setProps({
        settings: {
          dailyCalorieLimit: 2200,
          dailySugarLimit: 50,
          dailyProteinTarget: 70,
          tolerance: 10,
          cheatDays: 1,
          weekStartDay: 0,
        },
      });
      await flushPromises();

      // Save button should be disabled again (not modified)
      expect(saveButton.attributes('disabled')).toBeDefined();
    });
  });
});
