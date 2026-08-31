import { dailyMealPlanNutrients } from '@/core/nutritional-calculations';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { PlannedMealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Settings } from '@/models/settings';
import { flushPromises, mount } from '@vue/test-utils';
import { intlFormat, parseISO } from 'date-fns';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemListItem from '../../meals/MealItemListItem.vue';
import DailySummaryCard from '../DailySummaryCard.vue';

const vuetify = createVuetify({ components, directives });

const TEST_MEAL_PLAN = TEST_MEAL_PLANS[0];
const TEST_SETTINGS: Settings = {
  minDailyCalories: 1950,
  maxDailyCalories: 2150,
  minDailyProtein: 140,
  maxDailyProtein: 160,
  minDailyCarbs: 210,
  maxDailyCarbs: 235,
  minDailyFat: 60,
  maxDailyFat: 75,
  minDailySodium: 1500,
  maxDailySodium: 2300,
  maxDailySugar: 38,
  tolerance: 10,
  weekStartDay: 0,
};

const mountComponent = (
  props: { date: Date; settings?: Settings; mealPlan?: MealPlan } = { date: parseISO('2026-04-02') },
  attachTo?: HTMLElement,
) => mount(DailySummaryCard, { props, global: { plugins: [vuetify] }, attachTo });

const plannedMealItemsFor = (mealPlan: MealPlan): PlannedMealItem[] =>
  mealPlan.meals.flatMap((meal) =>
    meal.items.map((mealItem) => ({
      mealItem,
      mealDate: mealPlan.date,
      mealType: meal.type,
    })),
  );

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

      it('does not render any meal-type headings', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02') });
        expect(wrapper.findAll('.text-title-medium')).toHaveLength(0);
      });

      it('does not render any MealItemListItem components', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02') });
        expect(wrapper.findAllComponents(MealItemListItem)).toHaveLength(0);
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

      it('passes settings to the nutrition tooltip', () => {
        wrapper = mountComponent({
          date: parseISO('2026-04-02'),
          mealPlan: TEST_MEAL_PLAN,
          settings: TEST_SETTINGS,
        });
        const title = wrapper.findComponent(components.VCardTitle);
        const nutritionData = title.findComponent({ name: 'NutritionData' });
        expect(nutritionData.exists()).toBe(true);
        expect(nutritionData.props('settings')).toEqual(TEST_SETTINGS);
      });

      it('renders a heading for each meal type', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
        const headings = wrapper.findAll('.text-title-medium');
        expect(headings.map((heading) => heading.text())).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snack']);
      });

      it('renders a MealItemListItem for every meal item', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
        const mealItems = TEST_MEAL_PLAN.meals.flatMap((meal) => meal.items);
        const listItems = wrapper.findAllComponents(MealItemListItem);
        expect(listItems).toHaveLength(mealItems.length);
        listItems.forEach((listItem, index) => {
          expect(listItem.props('mealItem')).toEqual(mealItems[index]);
        });
      });

      it('displays the correct name for each meal item', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
        const mealItems = TEST_MEAL_PLAN.meals.flatMap((meal) => meal.items);
        const listItems = wrapper.findAllComponents(MealItemListItem);
        listItems.forEach((listItem, index) => {
          expect(listItem.text()).toContain(mealItems[index]!.name);
        });
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

      it('renders headings only for meal types that exist in the plan', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN });
        const headings = wrapper.findAll('.text-title-medium');
        expect(headings.map((heading) => heading.text())).toEqual(['Breakfast', 'Lunch']);
      });

      it('renders a MealItemListItem only for items in the included meals', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN });
        const mealItems = PARTIAL_MEAL_PLAN.meals.flatMap((meal) => meal.items);
        const listItems = wrapper.findAllComponents(MealItemListItem);
        expect(listItems).toHaveLength(mealItems.length);
        listItems.forEach((listItem, index) => {
          expect(listItem.props('mealItem')).toEqual(mealItems[index]);
        });
      });

      it('displays the correct name for each rendered meal item', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: PARTIAL_MEAL_PLAN });
        const mealItems = PARTIAL_MEAL_PLAN.meals.flatMap((meal) => meal.items);
        const listItems = wrapper.findAllComponents(MealItemListItem);
        listItems.forEach((listItem, index) => {
          expect(listItem.text()).toContain(mealItems[index]!.name);
        });
      });
    });

    describe('with a meal plan that includes empty meals', () => {
      const MEAL_PLAN_WITH_EMPTY_MEALS = {
        ...TEST_MEAL_PLAN,
        meals: TEST_MEAL_PLAN.meals.map((meal) =>
          meal.type === 'Lunch' || meal.type === 'Snack' ? { ...meal, items: [] } : meal,
        ),
      };

      it('does not render headings for meals that have no items', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: MEAL_PLAN_WITH_EMPTY_MEALS });
        const headings = wrapper.findAll('.text-title-medium');
        expect(headings.map((heading) => heading.text())).toEqual(['Breakfast', 'Dinner']);
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

      it('does not render any meal-type headings', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: EMPTY_MEAL_PLAN });
        expect(wrapper.findAll('.text-title-medium')).toHaveLength(0);
      });

      it('does not render any MealItemListItem components', () => {
        wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: EMPTY_MEAL_PLAN });
        expect(wrapper.findAllComponents(MealItemListItem)).toHaveLength(0);
      });
    });
  });

  describe('modify event', () => {
    it('emits the associated planned meal item when a meal item is modified', async () => {
      wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
      const plannedMealItems = plannedMealItemsFor(TEST_MEAL_PLAN);
      const buttons = wrapper.findAllComponents('[data-testid="modify-button"]');
      expect(buttons).toHaveLength(plannedMealItems.length);

      for (const [index, button] of buttons.entries()) {
        await button.trigger('click');
        const emittedItem = (wrapper.emitted('modify') as unknown[][])[index]![0] as PlannedMealItem;
        expect(emittedItem).toEqual(plannedMealItems[index]);
      }
    });
  });

  describe('delete event', () => {
    it('emits the associated planned meal item when a meal item is deleted', async () => {
      wrapper = mountComponent({ date: parseISO('2026-04-02'), mealPlan: TEST_MEAL_PLAN });
      const plannedMealItems = plannedMealItemsFor(TEST_MEAL_PLAN);
      const buttons = wrapper.findAllComponents('[data-testid="delete-button"]');
      expect(buttons).toHaveLength(plannedMealItems.length);

      for (const [index, button] of buttons.entries()) {
        await button.trigger('click');
        const emittedItem = (wrapper.emitted('delete') as unknown[][])[index]![0] as PlannedMealItem;
        expect(emittedItem).toEqual(plannedMealItems[index]);
      }
    });
  });
});
