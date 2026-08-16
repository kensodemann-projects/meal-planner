import { dailyMealPlanNutrients } from '@/core/nutritional-calculations';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { MealPlan } from '@/models/meal-plan';
import type { Settings } from '@/models/settings';
import { flushPromises, mount } from '@vue/test-utils';
import { intlFormat, parseISO } from 'date-fns';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DailySummaryCard from '../DailySummaryCard.vue';

const vuetify = createVuetify({ components, directives });

const TEST_MEAL_PLAN = TEST_MEAL_PLANS[0];

const mountComponent = (
  props: { date: Date; settings?: Settings; mealPlan?: MealPlan } = { date: parseISO('2026-04-02') },
  attachTo?: HTMLElement,
) => mount(DailySummaryCard, { props, global: { plugins: [vuetify] }, attachTo });

describe('Daily Summary Card', () => {
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

  describe('meal sensitive content', () => {
    describe('without a meal plan', () => {
      it('displays a subtitle indicating no meals exist for the day', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02') });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.text()).toBe('No meals have been entered');
      });

      it('does not show a nutrition tooltip when hovering over the date', async () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02') }, document.body);
        const title = wrapper.findComponent(components.VCardTitle);
        expect(title.findComponent(components.VTooltip).exists()).toBe(false);

        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).toBeNull();

        await title.trigger('mouseenter');
        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).toBeNull();
      });
    });

    describe('with a meal plan that has all meals', () => {
      it('no subtitle is displayed', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.exists()).toBe(false);
      });

      it('shows a nutrition tooltip when hovering over the date', async () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN }, document.body);
        const title = wrapper.findComponent(components.VCardTitle);
        const tooltip = title.findComponent(components.VTooltip);
        expect(tooltip.exists()).toBe(true);

        const nutritionData = tooltip.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(true);
        expect(nutritionData.props('value')).toEqual(dailyMealPlanNutrients(TEST_MEAL_PLAN));

        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).toBeNull();

        await title.trigger('mouseenter');
        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).not.toBeNull();
      });
    });

    describe('with a meal plan that has some meals', () => {
      const PARTIAL_MEAL_PLAN = { ...TEST_MEAL_PLAN, meals: TEST_MEAL_PLAN.meals.slice(0, 2) };

      it('no subtitle is displayed', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.exists()).toBe(false);
      });

      it('shows a nutrition tooltip when hovering over the date', async () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN }, document.body);
        const title = wrapper.findComponent(components.VCardTitle);
        const tooltip = title.findComponent(components.VTooltip);
        expect(tooltip.exists()).toBe(true);

        const nutritionData = tooltip.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(true);
        expect(nutritionData.props('value')).toEqual(dailyMealPlanNutrients(PARTIAL_MEAL_PLAN));

        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).toBeNull();

        await title.trigger('mouseenter');
        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).not.toBeNull();
      });
    });

    describe('with a meal plan without meals', () => {
      const EMPTY_MEAL_PLAN = { ...TEST_MEAL_PLAN, meals: [] };

      it('displays a subtitle indicating no meals exist for the day', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: EMPTY_MEAL_PLAN });
        const subtitle = wrapper.findComponent(components.VCardSubtitle);
        expect(subtitle.text()).toBe('No meals have been entered');
      });

      it('does not show a nutrition tooltip when hovering over the date', async () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: EMPTY_MEAL_PLAN }, document.body);
        const title = wrapper.findComponent(components.VCardTitle);
        expect(title.findComponent(components.VTooltip).exists()).toBe(false);

        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).toBeNull();

        await title.trigger('mouseenter');
        await flushPromises();
        expect(document.querySelector('.v-overlay--active')).toBeNull();
      });
    });
  });
});
