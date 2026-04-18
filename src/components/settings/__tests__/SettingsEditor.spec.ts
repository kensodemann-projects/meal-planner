import type { Settings } from '@/models/settings';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {
  numberInputIsRequired,
  numberInputMustBePositive,
  numberInputMustBeZeroOrGreater,
} from '../../__tests__/test-utils';
import SettingsEditor from '../SettingsEditor.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (
  props: { settings: Settings } = {
    settings: {
      minDailyCalories: 1500,
      maxDailyCalories: 1875,
      minDailyProtein: 50,
      maxDailyProtein: 65,
      minDailyFat: 50,
      maxDailyFat: 70,
      minDailyCarbs: 200,
      maxDailyCarbs: 250,
      minDailySodium: 1500,
      maxDailySodium: 2300,
      maxDailySugar: 45,
      tolerance: 8,
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

  describe('Minimum Daily Calories Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Minimum Daily Calories (kcal)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'min-daily-calorie-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'min-daily-calorie-input');
    });

    it('must be less than maximum calories', async () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = caloriesInput.find('input');

      expect(caloriesInput.text()).not.toContain('Minimum calories must be less than maximum calories');
      await input.trigger('focus');
      await input.setValue(1875);
      await input.trigger('blur');
      expect(caloriesInput.text()).toContain('Minimum calories must be less than maximum calories');
      await input.setValue(1500);
      await input.trigger('blur');
      expect(caloriesInput.text()).not.toContain('Minimum calories must be less than maximum calories');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(1500);
    });
  });

  describe('Maximum Daily Calories Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Maximum Daily Calories (kcal)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-daily-calorie-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-daily-calorie-input');
    });

    it('must be greater than minimum calories', async () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = caloriesInput.find('input');

      expect(caloriesInput.text()).not.toContain('Maximum calories must be greater than minimum calories');
      await input.trigger('focus');
      await input.setValue(1500);
      await input.trigger('blur');
      expect(caloriesInput.text()).toContain('Maximum calories must be greater than minimum calories');
      await input.setValue(1875);
      await input.trigger('blur');
      expect(caloriesInput.text()).not.toContain('Maximum calories must be greater than minimum calories');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(1875);
    });
  });

  describe('Minimum Daily Protein Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.exists()).toBe(true);
      expect(proteinInput.props('label')).toBe('Minimum Daily Protein (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'min-daily-protein-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'min-daily-protein-input');
    });

    it('must be less than maximum protein', async () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = proteinInput.find('input');

      expect(proteinInput.text()).not.toContain('Minimum protein must be less than maximum protein');
      await input.trigger('focus');
      await input.setValue(65);
      await input.trigger('blur');
      expect(proteinInput.text()).toContain('Minimum protein must be less than maximum protein');
      await input.setValue(50);
      await input.trigger('blur');
      expect(proteinInput.text()).not.toContain('Minimum protein must be less than maximum protein');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.props('modelValue')).toBe(50);
    });
  });

  describe('Maximum Daily Protein Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.exists()).toBe(true);
      expect(proteinInput.props('label')).toBe('Maximum Daily Protein (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-daily-protein-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-daily-protein-input');
    });

    it('must be greater than minimum protein', async () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = proteinInput.find('input');

      expect(proteinInput.text()).not.toContain('Maximum protein must be greater than minimum protein');
      await input.trigger('focus');
      await input.setValue(50);
      await input.trigger('blur');
      expect(proteinInput.text()).toContain('Maximum protein must be greater than minimum protein');
      await input.setValue(65);
      await input.trigger('blur');
      expect(proteinInput.text()).not.toContain('Maximum protein must be greater than minimum protein');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.props('modelValue')).toBe(65);
    });
  });

  describe('Minimum Daily Fat Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent(
        '[data-testid="min-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(fatInput.exists()).toBe(true);
      expect(fatInput.props('label')).toBe('Minimum Daily Fat (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'min-daily-fat-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'min-daily-fat-input');
    });

    it('must be less than maximum fat', async () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent(
        '[data-testid="min-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = fatInput.find('input');

      expect(fatInput.text()).not.toContain('Minimum fat must be less than maximum fat');
      await input.trigger('focus');
      await input.setValue(70);
      await input.trigger('blur');
      expect(fatInput.text()).toContain('Minimum fat must be less than maximum fat');
      await input.setValue(50);
      await input.trigger('blur');
      expect(fatInput.text()).not.toContain('Minimum fat must be less than maximum fat');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent(
        '[data-testid="min-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(fatInput.props('modelValue')).toBe(50);
    });
  });

  describe('Maximum Daily Fat Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent(
        '[data-testid="max-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(fatInput.exists()).toBe(true);
      expect(fatInput.props('label')).toBe('Maximum Daily Fat (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-daily-fat-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-daily-fat-input');
    });

    it('must be greater than minimum fat', async () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent(
        '[data-testid="max-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = fatInput.find('input');

      expect(fatInput.text()).not.toContain('Maximum fat must be greater than minimum fat');
      await input.trigger('focus');
      await input.setValue(50);
      await input.trigger('blur');
      expect(fatInput.text()).toContain('Maximum fat must be greater than minimum fat');
      await input.setValue(70);
      await input.trigger('blur');
      expect(fatInput.text()).not.toContain('Maximum fat must be greater than minimum fat');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent(
        '[data-testid="max-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(fatInput.props('modelValue')).toBe(70);
    });
  });

  describe('Minimum Daily Carbs Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(carbsInput.exists()).toBe(true);
      expect(carbsInput.props('label')).toBe('Minimum Daily Carbs (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'min-daily-carbs-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'min-daily-carbs-input');
    });

    it('must be less than maximum carbs', async () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = carbsInput.find('input');

      expect(carbsInput.text()).not.toContain('Minimum carbs must be less than maximum carbs');
      await input.trigger('focus');
      await input.setValue(250);
      await input.trigger('blur');
      expect(carbsInput.text()).toContain('Minimum carbs must be less than maximum carbs');
      await input.setValue(200);
      await input.trigger('blur');
      expect(carbsInput.text()).not.toContain('Minimum carbs must be less than maximum carbs');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(carbsInput.props('modelValue')).toBe(200);
    });
  });

  describe('Maximum Daily Carbs Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(carbsInput.exists()).toBe(true);
      expect(carbsInput.props('label')).toBe('Maximum Daily Carbs (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-daily-carbs-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-daily-carbs-input');
    });

    it('must be greater than minimum carbs', async () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = carbsInput.find('input');

      expect(carbsInput.text()).not.toContain('Maximum carbs must be greater than minimum carbs');
      await input.trigger('focus');
      await input.setValue(200);
      await input.trigger('blur');
      expect(carbsInput.text()).toContain('Maximum carbs must be greater than minimum carbs');
      await input.setValue(250);
      await input.trigger('blur');
      expect(carbsInput.text()).not.toContain('Maximum carbs must be greater than minimum carbs');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(carbsInput.props('modelValue')).toBe(250);
    });
  });

  describe('Minimum Daily Sodium Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.exists()).toBe(true);
      expect(sodiumInput.props('label')).toBe('Minimum Daily Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'min-daily-sodium-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'min-daily-sodium-input');
    });

    it('must be less than maximum sodium', async () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = sodiumInput.find('input');

      expect(sodiumInput.text()).not.toContain('Minimum sodium must be less than maximum sodium');
      await input.trigger('focus');
      await input.setValue(2300);
      await input.trigger('blur');
      expect(sodiumInput.text()).toContain('Minimum sodium must be less than maximum sodium');
      await input.setValue(1500);
      await input.trigger('blur');
      expect(sodiumInput.text()).not.toContain('Minimum sodium must be less than maximum sodium');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.props('modelValue')).toBe(1500);
    });
  });

  describe('Maximum Daily Sodium Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.exists()).toBe(true);
      expect(sodiumInput.props('label')).toBe('Maximum Daily Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-daily-sodium-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-daily-sodium-input');
    });

    it('must be greater than minimum sodium', async () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = sodiumInput.find('input');

      expect(sodiumInput.text()).not.toContain('Maximum sodium must be greater than minimum sodium');
      await input.trigger('focus');
      await input.setValue(1500);
      await input.trigger('blur');
      expect(sodiumInput.text()).toContain('Maximum sodium must be greater than minimum sodium');
      await input.setValue(2300);
      await input.trigger('blur');
      expect(sodiumInput.text()).not.toContain('Maximum sodium must be greater than minimum sodium');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.props('modelValue')).toBe(2300);
    });
  });

  describe('Maximum Daily Sugar Input', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const sugarInput = wrapper.findComponent(
        '[data-testid="max-daily-sugar-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sugarInput.exists()).toBe(true);
      expect(sugarInput.props('label')).toBe('Maximum Daily Sugar (grams)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'max-daily-sugar-input');
    });

    it('must be positive', async () => {
      wrapper = mountComponent();
      await numberInputMustBePositive(wrapper, 'max-daily-sugar-input');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const sugarInput = wrapper.findComponent(
        '[data-testid="max-daily-sugar-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sugarInput.props('modelValue')).toBe(45);
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

    it('must be seven or less', async () => {
      wrapper = mountComponent();
      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = toleranceInput.find('input');

      expect(toleranceInput.text()).not.toContain('must be 100 or less');
      await input.trigger('focus');
      await input.setValue(101);
      await input.trigger('blur');
      expect(toleranceInput.text()).toContain('must be 100 or less');
      await input.setValue(100);
      await input.trigger('blur');
      expect(toleranceInput.text()).not.toContain('must be 100 or less');
    });

    it('is initialized based on the settings', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(8);
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
      const minCaloriesInput = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const sugarInput = wrapper.findComponent(
        '[data-testid="max-daily-sugar-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minProteinInput = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const proteinInput = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minFatInput = wrapper.findComponent(
        '[data-testid="min-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const fatInput = wrapper.findComponent(
        '[data-testid="max-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minCarbsInput = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const carbsInput = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minSodiumInput = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const sodiumInput = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;

      await minCaloriesInput.setValue(1200);
      await caloriesInput.setValue(2100);
      await sugarInput.setValue(55);
      await minProteinInput.setValue(40);
      await proteinInput.setValue(80);
      await minFatInput.setValue(35);
      await fatInput.setValue(90);
      await minCarbsInput.setValue(150);
      await carbsInput.setValue(300);
      await minSodiumInput.setValue(1200);
      await sodiumInput.setValue(2600);
      await toleranceInput.setValue(12);
      await weekStartDayInput.setValue(1);

      const resetButton = wrapper.find('[data-testid="reset-button"]');
      await resetButton.trigger('click');

      expect(minCaloriesInput.props('modelValue')).toBe(1500);
      expect(caloriesInput.props('modelValue')).toBe(1875);
      expect(sugarInput.props('modelValue')).toBe(45);
      expect(minProteinInput.props('modelValue')).toBe(50);
      expect(proteinInput.props('modelValue')).toBe(65);
      expect(minFatInput.props('modelValue')).toBe(50);
      expect(fatInput.props('modelValue')).toBe(70);
      expect(minCarbsInput.props('modelValue')).toBe(200);
      expect(carbsInput.props('modelValue')).toBe(250);
      expect(minSodiumInput.props('modelValue')).toBe(1500);
      expect(sodiumInput.props('modelValue')).toBe(2300);
      expect(toleranceInput.props('modelValue')).toBe(8);
      expect(weekStartDayInput.props('modelValue')).toBe(2);
    });

    it('disables the save button on click', async () => {
      wrapper = mountComponent();

      const saveButton = wrapper.find('[data-testid="save-button"]');
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
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
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;

      await caloriesInput.setValue(2000);
      await flushPromises();

      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('emits save event with updated settings when clicked', async () => {
      wrapper = mountComponent();

      // Modify multiple fields
      const minCaloriesInput = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const sugarInput = wrapper.findComponent(
        '[data-testid="max-daily-sugar-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minProteinInput = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const proteinInput = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minFatInput = wrapper.findComponent(
        '[data-testid="min-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const fatInput = wrapper.findComponent(
        '[data-testid="max-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minCarbsInput = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const carbsInput = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const minSodiumInput = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const sodiumInput = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;

      await minCaloriesInput.setValue(1800);
      await caloriesInput.setValue(2100);
      await sugarInput.setValue(55);
      await minProteinInput.setValue(45);
      await proteinInput.setValue(80);
      await minFatInput.setValue(35);
      await fatInput.setValue(75);
      await minCarbsInput.setValue(160);
      await carbsInput.setValue(280);
      await minSodiumInput.setValue(1200);
      await sodiumInput.setValue(2500);
      await toleranceInput.setValue(12);
      await weekStartDayInput.setValue(1);
      await flushPromises();

      const saveButton = wrapper.find('[data-testid="save-button"]');
      await saveButton.trigger('click');

      expect(wrapper.emitted('save')).toBeTruthy();
      expect(wrapper.emitted('save')?.length).toBe(1);
      expect(wrapper.emitted('save')?.[0]).toEqual([
        {
          minDailyCalories: 1800,
          maxDailyCalories: 2100,
          minDailyProtein: 45,
          maxDailyProtein: 80,
          minDailyFat: 35,
          maxDailyFat: 75,
          minDailyCarbs: 160,
          maxDailyCarbs: 280,
          minDailySodium: 1200,
          maxDailySodium: 2500,
          maxDailySugar: 55,
          tolerance: 12,
          weekStartDay: 1,
        },
      ]);
    });
  });

  describe('isModified', () => {
    it('is true when minDailyCalories changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(1200);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when maxDailyCalories changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(2000);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when minDailyProtein changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(40);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when maxDailyProtein changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(80);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when maxDailySugar changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="max-daily-sugar-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(60);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when minDailyFat changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent('[data-testid="min-daily-fat-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(35);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when maxDailyFat changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent('[data-testid="max-daily-fat-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(90);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when minDailyCarbs changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(150);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when maxDailyCarbs changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(300);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when minDailySodium changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(1200);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when maxDailySodium changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await input.setValue(2600);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when tolerance changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent('[data-testid="tolerance-input"]') as VueWrapper<components.VNumberInput>;
      await input.setValue(15);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('is true when weekStartDay changes', async () => {
      wrapper = mountComponent();
      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
      const input = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      await input.setValue(0);
      await flushPromises();
      expect(saveButton.attributes('disabled')).toBeUndefined();
    });
  });

  describe('watchEffect (Props Update)', () => {
    it('resets form when settings prop changes', async () => {
      wrapper = mountComponent({
        settings: {
          minDailyCalories: 1500,
          maxDailyCalories: 1800,
          minDailyProtein: 50,
          maxDailyProtein: 60,
          minDailyFat: 50,
          maxDailyFat: 70,
          minDailyCarbs: 200,
          maxDailyCarbs: 250,
          minDailySodium: 1500,
          maxDailySodium: 2300,
          maxDailySugar: 40,
          tolerance: 5,
          weekStartDay: 1,
        },
      });

      // Verify initial values
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.props('modelValue')).toBe(1800);

      // Change the form value
      await caloriesInput.setValue(2500);
      await flushPromises();
      expect(caloriesInput.props('modelValue')).toBe(2500);

      // Update props - watchEffect should reset the form
      await wrapper.setProps({
        settings: {
          minDailyCalories: 1850,
          maxDailyCalories: 2200,
          minDailyProtein: 55,
          maxDailyProtein: 70,
          minDailyFat: 55,
          maxDailyFat: 80,
          minDailyCarbs: 220,
          maxDailyCarbs: 275,
          minDailySodium: 1800,
          maxDailySodium: 2500,
          maxDailySugar: 50,
          tolerance: 10,
          weekStartDay: 0,
        },
      });
      await flushPromises();

      // Verify all fields were reset to new prop values
      expect(caloriesInput.props('modelValue')).toBe(2200);

      const minCaloriesInput = wrapper.findComponent(
        '[data-testid="min-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(minCaloriesInput.props('modelValue')).toBe(1850);

      const sugarInput = wrapper.findComponent(
        '[data-testid="max-daily-sugar-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sugarInput.props('modelValue')).toBe(50);

      const proteinInput = wrapper.findComponent(
        '[data-testid="max-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.props('modelValue')).toBe(70);

      const minProteinInput = wrapper.findComponent(
        '[data-testid="min-daily-protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(minProteinInput.props('modelValue')).toBe(55);

      const minFatInput = wrapper.findComponent(
        '[data-testid="min-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(minFatInput.props('modelValue')).toBe(55);

      const fatInput = wrapper.findComponent(
        '[data-testid="max-daily-fat-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(fatInput.props('modelValue')).toBe(80);

      const minCarbsInput = wrapper.findComponent(
        '[data-testid="min-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(minCarbsInput.props('modelValue')).toBe(220);

      const carbsInput = wrapper.findComponent(
        '[data-testid="max-daily-carbs-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(carbsInput.props('modelValue')).toBe(275);

      const minSodiumInput = wrapper.findComponent(
        '[data-testid="min-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(minSodiumInput.props('modelValue')).toBe(1800);

      const sodiumInput = wrapper.findComponent(
        '[data-testid="max-daily-sodium-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.props('modelValue')).toBe(2500);

      const toleranceInput = wrapper.findComponent(
        '[data-testid="tolerance-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(toleranceInput.props('modelValue')).toBe(10);

      const weekStartDayInput = wrapper.findComponent(
        '[data-testid="week-start-day-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(weekStartDayInput.props('modelValue')).toBe(0);
    });

    it('resets isModified state when props change', async () => {
      wrapper = mountComponent({
        settings: {
          minDailyCalories: 1500,
          maxDailyCalories: 1800,
          maxDailySugar: 40,
          minDailyProtein: 50,
          maxDailyProtein: 60,
          minDailyFat: 50,
          maxDailyFat: 70,
          minDailyCarbs: 200,
          maxDailyCarbs: 250,
          minDailySodium: 1500,
          maxDailySodium: 2300,
          tolerance: 5,
          weekStartDay: 1,
        },
      });

      const saveButton = wrapper.find('[data-testid="save-button"]');

      // Initially unmodified
      expect(saveButton.attributes('disabled')).toBeDefined();

      // Modify the form
      const caloriesInput = wrapper.findComponent(
        '[data-testid="max-daily-calorie-input"]',
      ) as VueWrapper<components.VNumberInput>;
      await caloriesInput.setValue(2000);
      await flushPromises();

      // Should be enabled after modification
      expect(saveButton.attributes('disabled')).toBeUndefined();

      // Update props - should reset and disable save button
      await wrapper.setProps({
        settings: {
          minDailyCalories: 1850,
          maxDailyCalories: 2200,
          maxDailySugar: 50,
          minDailyProtein: 55,
          maxDailyProtein: 70,
          minDailyFat: 50,
          maxDailyFat: 70,
          minDailyCarbs: 200,
          maxDailyCarbs: 250,
          minDailySodium: 1800,
          maxDailySodium: 2500,
          tolerance: 10,
          weekStartDay: 0,
        },
      });
      await flushPromises();

      // Save button should be disabled again (not modified)
      expect(saveButton.attributes('disabled')).toBeDefined();
    });
  });
});
