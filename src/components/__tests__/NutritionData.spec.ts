import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionData from '../NutritionData.vue';
import { TEST_FOOD, TEST_PORTION, TEST_RECIPE } from '@/data/__tests__/test-data';
import type { Nutrition } from '@/models/nutrition';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { value: Nutrition } = { value: TEST_PORTION }) =>
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

  it('displays the data from the test food', () => {
    wrapper = mountComponent({ value: TEST_FOOD });
    expect(wrapper.text()).toContain(`Calories: ${TEST_FOOD.calories}`);
    expect(wrapper.text()).toContain(`Sodium: ${TEST_FOOD.sodium}mg`);
    expect(wrapper.text()).toContain(`Sugar: ${TEST_FOOD.sugar}g`);
    expect(wrapper.text()).toContain(`Total Carbs: ${TEST_FOOD.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_FOOD.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_FOOD.protein}g`);
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
});
