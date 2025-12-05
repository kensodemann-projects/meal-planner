import { TEST_FOOD } from '@/data/__tests__/test-data';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import FoodView from '../FoodView.vue';
import type { FoodItem } from '@/models/food';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { food: FoodItem } = { food: { ...TEST_FOOD, id: '444930059d99fkd' } }) =>
  mount(FoodView, { props, global: { plugins: [vuetify] } });

describe('Food View', () => {
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
});
