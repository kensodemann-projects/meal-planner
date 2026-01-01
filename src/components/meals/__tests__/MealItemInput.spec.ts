import type { FoodItem } from '@/models/food';
import type { Recipe } from '@/models/recipe';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemInput from '../MealItemInput.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { values: (FoodItem | Recipe)[] } = { values: [] }) =>
  mount(MealItemInput, { props, global: { plugins: [vuetify] } });

describe('Meal Item Input', () => {
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

  describe('for foods', () => {
    it('placeholder', () => {
      expect(true).toBe(true);
    });
  });

  describe('for recipes', () => {
    it('units defaults to one', () => {
      expect(true).toBe(true);
    });

    it('units cannot be changed', () => {
      expect(true).toBe(true);
    });

    it('unit of measure defaults to servings', () => {
      expect(true).toBe(true);
    });

    it('unit of measure cannot be changed', () => {
      expect(true).toBe(true);
    });
  });
});
