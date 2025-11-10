import { TEST_FOOD, TEST_PORTION } from '@/data/__tests__/test-data';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionalInformation from '../NutritionalInformation.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) =>
  mount(NutritionalInformation, { props: { value: TEST_PORTION, ...props }, global: { plugins: [vuetify] } });

describe('Nutritional Information', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the data from the test portion', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain('Serving Size: 2 Each (240g)');
    expect(wrapper.text()).toContain(`Calories: ${TEST_PORTION.calories}`);
    expect(wrapper.text()).toContain(`Sodium: ${TEST_PORTION.sodium}mg`);
    expect(wrapper.text()).toContain(`Sugar: ${TEST_PORTION.sugar}g`);
    expect(wrapper.text()).toContain(`Total Carbs: ${TEST_PORTION.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_PORTION.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_PORTION.protein}g`);
  });

  it('displays the data from the test food', () => {
    wrapper = mountComponent({ value: TEST_FOOD });
    expect(wrapper.text()).toContain('Serving Size: 100 Gram (100g)');
    expect(wrapper.text()).toContain(`Calories: ${TEST_FOOD.calories}`);
    expect(wrapper.text()).toContain(`Sodium: ${TEST_FOOD.sodium}mg`);
    expect(wrapper.text()).toContain(`Sugar: ${TEST_FOOD.sugar}g`);
    expect(wrapper.text()).toContain(`Total Carbs: ${TEST_FOOD.carbs}g`);
    expect(wrapper.text()).toContain(`Fat: ${TEST_FOOD.fat}g`);
    expect(wrapper.text()).toContain(`Protein: ${TEST_FOOD.protein}g`);
  });

  describe('when compact', () => {
    it('only displays the serving size and calories', () => {
      wrapper = mountComponent({ compact: true });
      expect(wrapper.text()).toContain('Serving Size: 2 Each (240g)');
      expect(wrapper.text()).toContain(`Calories: ${TEST_PORTION.calories}`);
      expect(wrapper.text()).not.toContain(`Sodium: ${TEST_PORTION.sodium}mg`);
      expect(wrapper.text()).not.toContain(`Sugar: ${TEST_PORTION.sugar}g`);
      expect(wrapper.text()).not.toContain(`Total Carbs: ${TEST_PORTION.carbs}g`);
      expect(wrapper.text()).not.toContain(`Fat: ${TEST_PORTION.fat}g`);
      expect(wrapper.text()).not.toContain(`Protein: ${TEST_PORTION.protein}g`);
    });
  });
});
