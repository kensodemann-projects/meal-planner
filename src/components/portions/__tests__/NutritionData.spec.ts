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
  maxDailySugar: 50,
  tolerance: 10,
  weekStartDay: 0,
};

const mountComponent = (props: { value: Nutrition; settings?: Settings } = { value: TEST_PORTION }) =>
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
    expect(wrapper.text()).toContain(`Total Carbs: ${TEST_PORTION.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_PORTION.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_PORTION.protein}g`);
  });

  it('displays the data from the test recipe', () => {
    wrapper = mountComponent({ value: TEST_RECIPE });
    expect(wrapper.text()).toContain(`Calories: ${TEST_RECIPE.calories}`);
    expect(wrapper.text()).toContain(`Sodium: ${TEST_RECIPE.sodium}mg`);
    expect(wrapper.text()).toContain(`Sugar: ${TEST_RECIPE.sugar}g`);
    expect(wrapper.text()).toContain(`Total Carbs: ${TEST_RECIPE.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_RECIPE.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_RECIPE.protein}g`);
  });

  describe.each([
    {
      statistic: 'calories',
      greenPortion: { ...TEST_PORTION, calories: 1900 },
      lowRedPortion: { ...TEST_PORTION, calories: 1599 },
      lowYellowPortion: { ...TEST_PORTION, calories: 1799 },
      highYellowPortion: { ...TEST_PORTION, calories: 2201 },
      highRedPortion: { ...TEST_PORTION, calories: 2401 },
    },
  ])(
    'NutritionalStatusMarker for $statistic',
    ({ statistic, greenPortion, lowRedPortion, lowYellowPortion, highYellowPortion, highRedPortion }) => {
      it('is not displayed when settings are not provided', () => {
        wrapper = mountComponent({ value: TEST_PORTION });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).not.toContain('🟢');
        expect(cell.text()).not.toContain('🟡');
        expect(cell.text()).not.toContain('🔴');
      });

      it('displays the green indicator when the value is in range', () => {
        wrapper = mountComponent({ value: greenPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toContain('🟢');
        expect(cell.text()).not.toContain('🟡');
        expect(cell.text()).not.toContain('🔴');
      });

      it('displays the yellow indicator when the value is below min but within tolerance', () => {
        wrapper = mountComponent({ value: lowYellowPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toContain('🟡');
        expect(cell.text()).not.toContain('🟢');
        expect(cell.text()).not.toContain('🔴');
      });

      it('displays the red indicator when the value is below min and beyond tolerance', () => {
        wrapper = mountComponent({ value: lowRedPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toContain('🔴');
        expect(cell.text()).not.toContain('🟢');
        expect(cell.text()).not.toContain('🟡');
      });

      it('displays the yellow indicator when the value is above max but within tolerance', () => {
        wrapper = mountComponent({ value: highYellowPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toContain('🟡');
        expect(cell.text()).not.toContain('🟢');
        expect(cell.text()).not.toContain('🔴');
      });

      it('displays the red indicator when the value is above max and beyond tolerance', () => {
        wrapper = mountComponent({ value: highRedPortion, settings: BASE_SETTINGS });
        const cell = wrapper.find(`[data-testid="${statistic}"]`);
        expect(cell.text()).toContain('🔴');
        expect(cell.text()).not.toContain('🟢');
        expect(cell.text()).not.toContain('🟡');
      });
    },
  );

  describe('NutritionalStatusMarker for sugar', () => {
    it('is not displayed when settings are not provided', () => {
      wrapper = mountComponent({ value: TEST_PORTION });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.text()).not.toContain('🟢');
      expect(cell.text()).not.toContain('🟡');
      expect(cell.text()).not.toContain('🔴');
    });

    it('displays the green indicator when sugar is at or below the max', () => {
      // TEST_PORTION.sugar = 3, maxDailySugar = 3 → green
      wrapper = mountComponent({ value: TEST_PORTION, settings: { ...BASE_SETTINGS, maxDailySugar: 3 } });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.text()).toContain('🟢');
      expect(cell.text()).not.toContain('🟡');
      expect(cell.text()).not.toContain('🔴');
    });

    it('displays the yellow indicator when sugar is above max but within tolerance', () => {
      // TEST_PORTION.sugar = 3, maxDailySugar = 2, tolerance = 60
      // allowedDeviation = 2 * 0.60 = 1.2 → yellow threshold = 3.2 → 3 <= 3.2 → yellow
      wrapper = mountComponent({
        value: TEST_PORTION,
        settings: { ...BASE_SETTINGS, maxDailySugar: 2, tolerance: 60 },
      });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.text()).toContain('🟡');
      expect(cell.text()).not.toContain('🟢');
      expect(cell.text()).not.toContain('🔴');
    });

    it('displays the red indicator when sugar is above max and beyond tolerance', () => {
      // TEST_PORTION.sugar = 3, maxDailySugar = 2, tolerance = 10
      // allowedDeviation = 2 * 0.10 = 0.2 → yellow threshold = 2.2 → 3 > 2.2 → red
      wrapper = mountComponent({
        value: TEST_PORTION,
        settings: { ...BASE_SETTINGS, maxDailySugar: 2, tolerance: 10 },
      });
      const cell = wrapper.find('[data-testid="sugar"]');
      expect(cell.text()).toContain('🔴');
      expect(cell.text()).not.toContain('🟢');
      expect(cell.text()).not.toContain('🟡');
    });
  });
});
