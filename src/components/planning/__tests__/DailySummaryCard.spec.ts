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

const mountComponent = (props: { date: Date; mealPlan?: MealPlan } = { date: parseISO('2026-04-02') }) =>
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

  it('displays the date in the card title', () => {
    const expectedTitle = intlFormat(parseISO('2026-04-02'), { dateStyle: 'full' });
    wrapper = mountComponent();
    const title = wrapper.findComponent(components.VCardTitle);
    expect(title.text()).toBe(expectedTitle);
  });

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

  describe('meal sensitive content', () => {
    describe('without a meal plan', () => {
      it('displays a subtitle indicating no meals exist for the day', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02') });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.text()).toBe('Meals: None');
      });

      it('does not display any nutrition information', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02') });
        const nutritionData = wrapper.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(false);
      });
    });

    describe('with a meal plan that has all meals', () => {
      it('displays a subtitle indicating the meals', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.text()).toBe('Meals: Breakfast, Lunch, Dinner, Snack');
      });

      it('displays total nutrition information', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
        const nutritionData = wrapper.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(true);
        expect(nutritionData.props('value')).toEqual({
          calories: 1530,
          sodium: 1125,
          fat: 58,
          protein: 110,
          carbs: 145,
          sugar: 56,
        });
      });
    });

    describe('with a meal plan that has some meals', () => {
      const PARTIAL_MEAL_PLAN = { ...TEST_MEAL_PLAN, meals: TEST_MEAL_PLAN.meals.slice(0, 2) };

      it('displays a subtitle indicating the meals in the plan', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.text()).toBe('Meals: Breakfast, Lunch');
      });

      it('displays total nutrition information', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN });
        const nutritionData = wrapper.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(true);
        expect(nutritionData.props('value')).toEqual({
          calories: 770,
          sodium: 630,
          fat: 26,
          protein: 50,
          carbs: 86,
          sugar: 26,
        });
      });
    });

    describe('with a meal plan without meals', () => {
      const EMPTY_MEAL_PLAN = { ...TEST_MEAL_PLAN, meals: [] };

      it('displays a subtitle indicating no meals exist for the day', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: EMPTY_MEAL_PLAN });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.text()).toBe('Meals: None');
      });

      it('does not display any nutrition information', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: EMPTY_MEAL_PLAN });
        const nutritionData = wrapper.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(false);
      });
    });
  });
});
