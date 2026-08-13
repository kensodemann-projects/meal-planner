import { TEST_MEAL } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemListItem from '../MealItemListItem.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { mealItem: MealItem }) =>
  mount(MealItemListItem, { props, global: { plugins: [vuetify] } });

describe('Meal Item List Item', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the meal item name', () => {
    wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
    expect(wrapper.text()).toContain(TEST_MEAL.items[0]!.name);
  });
});
