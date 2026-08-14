import { TEST_MEAL } from '@/data/__tests__/test-data';
import type { MealItem } from '@/models/meal';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemListItem from '../MealItemListItem.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { mealItem: MealItem }, attachTo?: HTMLElement) =>
  mount(MealItemListItem, { props, global: { plugins: [vuetify] }, attachTo });

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

  describe('nutrition tooltip', () => {
    it('is visible', () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
      expect(wrapper.find('[data-testid="nutrition-data"]').exists()).toBe(true);
    });

    it('displays nutrition data for the meal item', () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
      const nutritionData = wrapper.findComponent({ name: 'NutritionData' });
      expect(nutritionData.exists()).toBe(true);
      expect(nutritionData.props('value')).toEqual(TEST_MEAL.items[0]!.nutrition);
    });

    it('opens on hover', async () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! }, document.body);
      await flushPromises();
      expect(document.querySelector('.v-overlay--active')).toBeNull();

      await wrapper.find('[data-testid="nutrition-data"]').trigger('mouseenter');
      await flushPromises();
      expect(document.querySelector('.v-overlay--active')).not.toBeNull();
    });
  });

  describe('edit button', () => {
    it('is visible', () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
      expect(wrapper.findComponent('[data-testid="edit-button"]').exists()).toBe(true);
    });

    it('emits edit event on click', () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
      wrapper.findComponent('[data-testid="edit-button"]').trigger('click');
      expect(wrapper.emitted('modify')).toBeDefined();
      const emittedItem = (wrapper.emitted('modify') as unknown[][])[0]![0] as MealItem;
      expect(emittedItem).toEqual(TEST_MEAL.items[0]!);
    });
  });

  describe('delete button', () => {
    it('is visible', () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
      expect(wrapper.findComponent('[data-testid="delete-button"]').exists()).toBe(true);
    });

    it('emits delete event on click', () => {
      wrapper = mountComponent({ mealItem: TEST_MEAL.items[0]! });
      wrapper.findComponent('[data-testid="delete-button"]').trigger('click');
      expect(wrapper.emitted('delete')).toBeDefined();
      const emittedItem = (wrapper.emitted('delete') as unknown[][])[0]![0] as MealItem;
      expect(emittedItem).toEqual(TEST_MEAL.items[0]!);
    });
  });
});
