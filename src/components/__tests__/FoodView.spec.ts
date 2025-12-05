import { TEST_FOOD } from '@/data/__tests__/test-data';
import type { FoodItem } from '@/models/food';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import FoodView from '../FoodView.vue';

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

  it('displays the name in a header', () => {
    wrapper = mountComponent({ food: { ...TEST_FOOD, name: 'Test Food Name' } });
    const header = wrapper.find('h1');
    expect(header.text()).toBe('Test Food Name');
  });

  it('displays the brand', () => {
    wrapper = mountComponent({ food: { ...TEST_FOOD, brand: 'Test Brand' } });
    expect(wrapper.text()).toContain('Brand: Test Brand');
  });

  it('displays "no specific brand" if the brand is not specified', () => {
    wrapper = mountComponent({ food: { ...TEST_FOOD, brand: '' } });
    expect(wrapper.text()).toContain('Brand: No specific brand');
  });

  it('displays the food category', () => {
    wrapper = mountComponent({ food: { ...TEST_FOOD, category: 'Produce' } });
    expect(wrapper.text()).toContain('Category: Produce');
  });
});
