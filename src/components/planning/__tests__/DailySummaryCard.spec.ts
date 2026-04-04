import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { MealPlan } from '@/models/meal-plan';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DailySummaryCard from '../DailySummaryCard.vue';
import { intlFormat, parseISO } from 'date-fns';

const vuetify = createVuetify({ components, directives });

const TEST_MEAL_PLAN = TEST_MEAL_PLANS[0];

const mountComponent = (props: { mealPlan: MealPlan } = { mealPlan: TEST_MEAL_PLAN }) =>
  mount(DailySummaryCard, { props, global: { plugins: [vuetify] } });

describe('Weekly Summary Card', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the meal date in the card title', () => {
    const expectedTitle = intlFormat(parseISO(TEST_MEAL_PLAN.date), { dateStyle: 'full' });
    wrapper = mountComponent({ mealPlan: TEST_MEAL_PLAN });
    const title = wrapper.findComponent(components.VCardTitle);
    expect(title.text()).toBe(expectedTitle);
  });

  it('displays the subtitle', () => {
    wrapper = mountComponent();
    const subtitle = wrapper.findComponent(components.VCardSubtitle);
    expect(subtitle.text()).toBe('Nutrition Summary');
  });

  // describe('nutrition', () => {
  //   beforeEach(() => {
  //     wrapper = mountComponent();
  //   });
  //
  //   it('displays days with meals', () => {
  //     const text = wrapper.findComponent(components.VCardText);
  //     expect(text.text()).toContain('Days with Meals: 5');
  //   });
  //
  //   it('displays average calories', () => {
  //     const text = wrapper.findComponent(components.VCardText);
  //     expect(text.text()).toContain('Average Calories: 2000');
  //   });
  //
  //   it('displays average protein with g suffix', () => {
  //     const text = wrapper.findComponent(components.VCardText);
  //     expect(text.text()).toContain('Average Protein: 100g');
  //   });
  //
  //   it('displays average carbs with g suffix', () => {
  //     const text = wrapper.findComponent(components.VCardText);
  //     expect(text.text()).toContain('Average Carbs: 250g');
  //   });
  // });

  describe('interactions', () => {
    it('emits click when the card is clicked', async () => {
      wrapper = mountComponent();
      const card = wrapper.findComponent(components.VCard);
      await card.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('emits click when Enter is pressed on the card', async () => {
      wrapper = mountComponent();
      const card = wrapper.findComponent(components.VCard);
      await card.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('emits click and prevents default when Space is pressed on the card', async () => {
      wrapper = mountComponent();
      const card = wrapper.findComponent(components.VCard);
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });

      card.element.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('click')).toHaveLength(1);
      expect(event.defaultPrevented).toBe(true);
    });
  });
});
