import { TEST_MEAL } from '@/data/__tests__/test-data';
import type { Meal } from '@/models/meal';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealView from '../MealView.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { meal: Meal }) => mount(MealView, { props, global: { plugins: [vuetify] } });

describe('MealView', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent({ meal: TEST_MEAL });
    expect(wrapper.exists()).toBe(true);
  });

  describe('with an empty meal', () => {
    const emptyMeal: Meal = {
      id: 'empty-meal',
      type: 'Breakfast',
      items: [],
    };

    it('displays a message when there are no items', () => {
      wrapper = mountComponent({ meal: emptyMeal });
      const emptyMessage = wrapper.find('[data-testid="empty-meal"]');
      expect(emptyMessage.exists()).toBe(true);
      expect(emptyMessage.text()).toBe('No items in this meal');
    });

    it('does not display any meal items', () => {
      wrapper = mountComponent({ meal: emptyMeal });
      const items = wrapper.findAll('[data-testid="meal-item"]');
      expect(items.length).toBe(0);
    });
  });

  describe('with meal items', () => {
    it('displays all meal items', () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const items = wrapper.findAll('[data-testid="meal-item"]');
      expect(items.length).toBe(TEST_MEAL.items.length);
    });

    it('displays the name of each item', () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const items = wrapper.findAll('[data-testid="meal-item"]');
      items.forEach((item, index) => {
        expect(item.text()).toContain(TEST_MEAL.items[index]!.name);
      });
    });

    it('displays the calories for each item', () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const items = wrapper.findAll('[data-testid="meal-item"]');
      items.forEach((item, index) => {
        expect(item.text()).toContain(`${TEST_MEAL.items[index]!.nutrition.calories} calories`);
      });
    });

    it('does not display the empty meal message', () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const emptyMessage = wrapper.find('[data-testid="empty-meal"]');
      expect(emptyMessage.exists()).toBe(false);
    });
  });

  describe('modify button', () => {
    it('exists', () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const button = wrapper.findComponent('[data-testid="modify-button"]');
      expect(button.exists()).toBe(true);
    });

    it('emits modify event when clicked', async () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const button = wrapper.findComponent('[data-testid="modify-button"]');
      await button.trigger('click');
      expect(wrapper.emitted('modify')).toBeTruthy();
      expect(wrapper.emitted('modify')!.length).toBe(1);
    });
  });

  describe('delete button', () => {
    it('exists', () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      expect(button.exists()).toBe(true);
    });

    it('emits delete event when clicked', async () => {
      wrapper = mountComponent({ meal: TEST_MEAL });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')!.length).toBe(1);
    });
  });
});
