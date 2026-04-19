import { TEST_PORTION, TEST_RECIPE } from '@/data/__tests__/test-data';
import type { Nutrition } from '@/models/nutrition';
import type { Settings } from '@/models/settings';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionData from '../NutritionData.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const BASE_SETTINGS: Settings = {
  minDailyCalories: 1800,
  maxDailyCalories: 2200,
  minDailyProtein: 50,
  maxDailyProtein: 100,
  minDailyCarbs: 200,
  maxDailyCarbs: 300,
  minDailyFat: 40,
  maxDailyFat: 80,
  minDailySodium: 1800,
  maxDailySodium: 2200,
  maxDailySugar: 50,
  tolerance: 10,
  weekStartDay: 0,
};

const mountComponent = (props: { value: Nutrition; prefix?: string; settings?: Settings } = { value: TEST_PORTION }) =>
  mount(NutritionData, { props, global: { plugins: [vuetify] } });

describe('NutritionData', () => {
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

  it('displays the data from the test portion', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain(`Calories: ${TEST_PORTION.calories}`);
    expect(wrapper.text()).toContain(`Sodium: ${TEST_PORTION.sodium}mg`);
    expect(wrapper.text()).toContain(`Sugar: ${TEST_PORTION.sugar}g`);
    expect(wrapper.text()).toContain(`Carbs: ${TEST_PORTION.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_PORTION.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_PORTION.protein}g`);
  });

  it('displays the data from the test recipe', () => {
    wrapper = mountComponent({ value: TEST_RECIPE });
    expect(wrapper.text()).toContain(`Calories: ${TEST_RECIPE.calories}`);
    expect(wrapper.text()).toContain(`Sodium: ${TEST_RECIPE.sodium}mg`);
    expect(wrapper.text()).toContain(`Sugar: ${TEST_RECIPE.sugar}g`);
    expect(wrapper.text()).toContain(`Carbs: ${TEST_RECIPE.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_RECIPE.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_RECIPE.protein}g`);
  });

  describe.each([
    {
      statistic: 'calories',
      label: 'Calories',
      greenPortion: { ...TEST_PORTION, calories: 1900 },
      lowYellowPortion: { ...TEST_PORTION, calories: 1799 },
      lowRedPortion: { ...TEST_PORTION, calories: 1599 },
      highYellowPortion: { ...TEST_PORTION, calories: 2201 },
      highRedPortion: { ...TEST_PORTION, calories: 2401 },
    },
    {
      statistic: 'protein',
      label: 'Protein',
      greenPortion: { ...TEST_PORTION, protein: 80 },
      lowYellowPortion: { ...TEST_PORTION, protein: 43 },
      lowRedPortion: { ...TEST_PORTION, protein: 42 },
      highYellowPortion: { ...TEST_PORTION, protein: 101 },
      highRedPortion: { ...TEST_PORTION, protein: 108 },
    },
    {
      statistic: 'carbs',
      label: 'Carbs',
      greenPortion: { ...TEST_PORTION, carbs: 290 },
      lowYellowPortion: { ...TEST_PORTION, carbs: 175 },
      lowRedPortion: { ...TEST_PORTION, carbs: 174 },
      highYellowPortion: { ...TEST_PORTION, carbs: 325 },
      highRedPortion: { ...TEST_PORTION, carbs: 326 },
    },
    {
      statistic: 'fat',
      label: 'Fat',
      greenPortion: { ...TEST_PORTION, fat: 45 },
      lowYellowPortion: { ...TEST_PORTION, fat: 34 },
      lowRedPortion: { ...TEST_PORTION, fat: 33 },
      highYellowPortion: { ...TEST_PORTION, fat: 86 },
      highRedPortion: { ...TEST_PORTION, fat: 87 },
    },
    {
      statistic: 'sodium',
      label: 'Sodium',
      greenPortion: { ...TEST_PORTION, sodium: 1900 },
      lowYellowPortion: { ...TEST_PORTION, sodium: 1799 },
      lowRedPortion: { ...TEST_PORTION, sodium: 1599 },
      highYellowPortion: { ...TEST_PORTION, sodium: 2201 },
      highRedPortion: { ...TEST_PORTION, sodium: 2401 },
    },
  ])(
    'NutritionalStatusMarker for $statistic',
    ({ statistic, label, greenPortion, lowRedPortion, lowYellowPortion, highYellowPortion, highRedPortion }) => {
      it(`is labeled with "Sugar:" if there is no prefix`, () => {
        wrapper = mountComponent({ value: TEST_PORTION });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toMatch(new RegExp(`^${label}:`));
      });

      it(`is labeled with "Average ${label}:" if there is prefix of "Average"`, () => {
        wrapper = mountComponent({ value: TEST_PORTION, prefix: 'Average' });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toMatch(new RegExp(`^Average ${label}:`));
      });

      it('is not displayed when settings are not provided', () => {
        wrapper = mountComponent({ value: TEST_PORTION });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.html()).not.toContain('mdi-circle');
        expect(cell.html()).not.toContain('mdi-arrow');
      });

      it('displays the success circle icon when the value is in range', () => {
        wrapper = mountComponent({ value: greenPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.html()).toContain('mdi-circle');
        expect(cell.html()).toContain('text-success');
        expect(cell.html()).not.toContain('mdi-arrow');
      });

      it('displays the warning down arrow when the value is below min but within tolerance', () => {
        wrapper = mountComponent({ value: lowYellowPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.html()).toContain('mdi-arrow-down-bold');
        expect(cell.html()).toContain('text-warning');
        expect(cell.html()).not.toContain('mdi-circle');
        expect(cell.html()).not.toContain('text-error');
      });

      it('displays the error down arrow when the value is below min and beyond tolerance', () => {
        wrapper = mountComponent({ value: lowRedPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.html()).toContain('mdi-arrow-down-bold');
        expect(cell.html()).toContain('text-error');
        expect(cell.html()).not.toContain('mdi-circle');
        expect(cell.html()).not.toContain('text-warning');
      });

      it('displays the warning up arrow when the value is above max but within tolerance', () => {
        wrapper = mountComponent({ value: highYellowPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.html()).toContain('mdi-arrow-up-bold');
        expect(cell.html()).toContain('text-warning');
        expect(cell.html()).not.toContain('mdi-circle');
        expect(cell.html()).not.toContain('text-error');
      });

      it('displays the error up arrow when the value is above max and beyond tolerance', () => {
        wrapper = mountComponent({ value: highRedPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.html()).toContain('mdi-arrow-up-bold');
        expect(cell.html()).toContain('text-error');
        expect(cell.html()).not.toContain('mdi-circle');
        expect(cell.html()).not.toContain('text-warning');
      });
    },
  );

  describe('NutritionalStatusMarker for sugar', () => {
    it('is labeled with "Sugar:" if there is no prefix', () => {
      wrapper = mountComponent({ value: TEST_PORTION });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.text()).toMatch(/^Sugar:/);
    });

    it('is labeled with "Average Sugar:" if there is prefix of "Average"', () => {
      wrapper = mountComponent({ value: TEST_PORTION, prefix: 'Average' });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.text()).toMatch(/^Average Sugar:/);
    });

    it('is not displayed when settings are not provided', () => {
      wrapper = mountComponent({ value: TEST_PORTION });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.html()).not.toContain('mdi-circle');
      expect(cell.html()).not.toContain('mdi-arrow');
    });

    it('displays the success circle icon when sugar is at or below the max', () => {
      // TEST_PORTION.sugar = 3, maxDailySugar = 3 → green
      wrapper = mountComponent({ value: TEST_PORTION, settings: { ...BASE_SETTINGS, maxDailySugar: 3 } });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.html()).toContain('mdi-circle');
      expect(cell.html()).toContain('text-success');
      expect(cell.html()).not.toContain('mdi-arrow');
    });

    it('displays the warning up arrow when sugar is above max but within tolerance', () => {
      // TEST_PORTION.sugar = 3, maxDailySugar = 2, tolerance = 60
      // allowedDeviation = 2 * 0.60 = 1.2 → yellow threshold = 3.2 → 3 <= 3.2 → yellow
      wrapper = mountComponent({
        value: TEST_PORTION,
        settings: { ...BASE_SETTINGS, maxDailySugar: 2, tolerance: 60 },
      });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.html()).toContain('mdi-arrow-up-bold');
      expect(cell.html()).toContain('text-warning');
      expect(cell.html()).not.toContain('mdi-circle');
      expect(cell.html()).not.toContain('text-error');
    });

    it('displays the error up arrow when sugar is above max and beyond tolerance', () => {
      // TEST_PORTION.sugar = 3, maxDailySugar = 2, tolerance = 10
      // allowedDeviation = 2 * 0.10 = 0.2 → yellow threshold = 2.2 → 3 > 2.2 → red
      wrapper = mountComponent({
        value: TEST_PORTION,
        settings: { ...BASE_SETTINGS, maxDailySugar: 2, tolerance: 10 },
      });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.html()).toContain('mdi-arrow-up-bold');
      expect(cell.html()).toContain('text-error');
      expect(cell.html()).not.toContain('mdi-circle');
      expect(cell.html()).not.toContain('text-warning');
    });
  });
});
