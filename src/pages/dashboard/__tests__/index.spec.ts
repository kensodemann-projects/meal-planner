import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DashboardPage from '../index.vue';
import { useRouter } from 'vue-router';
import WeeklySummaryCard from '@/components/planning/WeeklySummaryCard.vue';
import DetailStatCard from '@/components/core/DetailStatCard.vue';
import type { WeeklyData } from '@/models/weekly-data';
import {
  dailyMealPlanNutrients,
  daysWithMeals,
  mealNutrients,
  multiDayMealPlanNutrients,
} from '@/core/nutritional-calculations';
import { useSettingsData } from '@/data/settings';
import { useMealPlansData } from '@/data/meal-plans';
import { TEST_MEAL_PLAN } from '@/data/__tests__/test-data';
import type { MealPlan } from '@/models/meal-plan';

vi.mock('@/data/settings');
vi.mock('vue-router');
vi.mock('@/data/meal-plans');
vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(DashboardPage, { global: { plugins: [vuetify] } });

describe('Dashboard Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 11, 25));
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('gets the settings', async () => {
    wrapper = mountPage();
    expect(useSettingsData).toHaveBeenCalled();
  });

  it('calls useMealPlansData', async () => {
    wrapper = mountPage();
    await flushPromises();
    expect(useMealPlansData).toHaveBeenCalled();
  });

  it('fetches exactly 2 meal plans', async () => {
    const { getMealPlansForPeriod } = useMealPlansData();
    wrapper = mountPage();
    await flushPromises();
    expect(getMealPlansForPeriod).toHaveBeenCalledTimes(2);
  });

  it('fetches meal plans for this week', async () => {
    const { getMealPlansForPeriod } = useMealPlansData();
    wrapper = mountPage();
    await flushPromises();
    expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-22', '2025-12-28');
  });

  it('fetches meal plans for next week', async () => {
    const { getMealPlansForPeriod } = useMealPlansData();
    wrapper = mountPage();
    await flushPromises();
    expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-29', '2026-01-04');
  });

  it('fetches the meal plan for today', async () => {
    const { getMealPlanForDate } = useMealPlansData();
    wrapper = mountPage();
    await flushPromises();
    expect(getMealPlanForDate).toHaveBeenCalledWith('2025-12-25');
  });

  describe('week cards', () => {
    it('exists for 2 weeks', async () => {
      wrapper = mountPage();
      await flushPromises();
      const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
      expect(weekCards.length).toBe(2);
    });

    describe('this week', () => {
      it('is the first card', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
        expect(weekCards[0]?.props('title')).toBe('This Week');
        const week = weekCards[0]?.props('week') as WeeklyData;
        expect(week.startDate.getFullYear()).toBe(2025);
        expect(week.startDate.getMonth()).toBe(11); // December (0-based)
        expect(week.startDate.getDate()).toBe(22);
        expect(week.endDate.getFullYear()).toBe(2025);
        expect(week.endDate.getMonth()).toBe(11); // December (0-based)
        expect(week.endDate.getDate()).toBe(28);
      });

      it('navigates to the week details for this week', async () => {
        const router = useRouter();
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
        await weekCards[0]!.trigger('click');
        expect(router.push).toHaveBeenCalledExactlyOnceWith({
          path: 'planning/week',
          query: { dt: '2025-12-22' },
        });
      });

      describe('stats', () => {
        it('displays days with meals from daysWithMeals()', async () => {
          (daysWithMeals as Mock).mockReturnValue(5);
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[0]!.props('week') as WeeklyData;
          expect(week.daysWithMeals).toBe(5);
        });

        it('displays average calories from multiDayMealPlanNutrients()', async () => {
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 14002,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          (daysWithMeals as Mock).mockReturnValue(7);
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[0]!.props('week') as WeeklyData;
          expect(week.averageCalories).toBe(2000);
        });

        it('displays average protein from multiDayMealPlanNutrients()', async () => {
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 703,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          (daysWithMeals as Mock).mockReturnValue(7);
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[0]!.props('week') as WeeklyData;
          expect(week.averageProtein).toBe(100);
        });

        it('displays average carbs from multiDayMealPlanNutrients()', async () => {
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 2102,
            sugar: 0,
            sodium: 0,
          });
          (daysWithMeals as Mock).mockReturnValue(7);
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[0]!.props('week') as WeeklyData;
          expect(week.averageCarbs).toBe(300);
        });

        it('displays zero average when no plans exist', async () => {
          (daysWithMeals as Mock).mockReturnValue(0);
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[0]!.props('week') as WeeklyData;
          expect(week.averageCalories).toBe(0);
          expect(week.averageProtein).toBe(0);
          expect(week.averageCarbs).toBe(0);
        });
      });
    });

    describe('next week', () => {
      it('is the second card', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
        expect(weekCards[1]?.props('title')).toBe('Next Week (Planning)');
        const week = weekCards[1]?.props('week') as WeeklyData;
        expect(week.startDate.getFullYear()).toBe(2025);
        expect(week.startDate.getMonth()).toBe(11);
        expect(week.startDate.getDate()).toBe(29);
        expect(week.endDate.getFullYear()).toBe(2026);
        expect(week.endDate.getMonth()).toBe(0);
        expect(week.endDate.getDate()).toBe(4);
      });

      it('navigates to the week details for next week', async () => {
        const router = useRouter();
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
        await weekCards[1]!.trigger('click');
        expect(router.push).toHaveBeenCalledExactlyOnceWith({
          path: 'planning/week',
          query: { dt: '2025-12-29' },
        });
      });
    });
  });

  describe('detail stats', () => {
    describe('when there is no meal plan for today', () => {
      it('does not call dailyMealPlanNutrients', async () => {
        wrapper = mountPage();
        await flushPromises();
        expect(dailyMealPlanNutrients).not.toHaveBeenCalled();
      });

      it('displays zero for all detail stats', async () => {
        wrapper = mountPage();
        await flushPromises();
        const cards = wrapper
          .findAllComponents(DetailStatCard)
          .filter((c) =>
            ['Protein (g)', 'Sugar (g)', 'Carbs (g)', 'Sodium (mg)', 'Fat (g)', 'Calories'].includes(
              c.props('label') as string,
            ),
          );
        for (const card of cards) {
          expect(card.props('value')).toBe(0);
        }
      });
    });

    describe('when today has a meal plan', () => {
      beforeEach(() => {
        const { getMealPlanForDate } = useMealPlansData();
        (getMealPlanForDate as Mock).mockResolvedValue(TEST_MEAL_PLAN);
      });

      it("passes today's meal plan to the daily nutritional calculation function", async () => {
        wrapper = mountPage();
        await flushPromises();
        expect(dailyMealPlanNutrients).toHaveBeenCalledWith(TEST_MEAL_PLAN);
      });

      it('displays protein from the calculation result', async () => {
        (dailyMealPlanNutrients as Mock).mockReturnValue({
          calories: 0,
          protein: 185,
          fat: 0,
          carbs: 0,
          sugar: 0,
          sodium: 0,
        });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Protein (g)');
        expect(card?.props('value')).toBe(185);
      });

      it('displays sugar from the calculation result', async () => {
        (dailyMealPlanNutrients as Mock).mockReturnValue({
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          sugar: 42,
          sodium: 0,
        });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Sugar (g)');
        expect(card?.props('value')).toBe(42);
      });

      it('displays carbs from the calculation result', async () => {
        (dailyMealPlanNutrients as Mock).mockReturnValue({
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 210,
          sugar: 0,
          sodium: 0,
        });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Carbs (g)');
        expect(card?.props('value')).toBe(210);
      });

      it('displays sodium from the calculation result', async () => {
        (dailyMealPlanNutrients as Mock).mockReturnValue({
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          sugar: 0,
          sodium: 1840,
        });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Sodium (mg)');
        expect(card?.props('value')).toBe(1840);
      });

      it('displays fat from the calculation result', async () => {
        (dailyMealPlanNutrients as Mock).mockReturnValue({
          calories: 0,
          protein: 0,
          fat: 77,
          carbs: 0,
          sugar: 0,
          sodium: 0,
        });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Fat (g)');
        expect(card?.props('value')).toBe(77);
      });

      it('displays calories from the calculation result', async () => {
        (dailyMealPlanNutrients as Mock).mockReturnValue({
          calories: 1750,
          protein: 0,
          fat: 0,
          carbs: 0,
          sugar: 0,
          sodium: 0,
        });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Calories');
        expect(card?.props('value')).toBe(1750);
      });
    });
  });

  describe('meal cards', () => {
    describe('when there is no meal plan for today', () => {
      beforeEach(() => {
        const { getMealPlanForDate } = useMealPlansData();
        (getMealPlanForDate as Mock).mockResolvedValue(null);
      });

      it('does not call mealNutrients', async () => {
        wrapper = mountPage();
        await flushPromises();
        expect(mealNutrients).not.toHaveBeenCalled();
      });

      it('displays N/A for all meal types', async () => {
        wrapper = mountPage();
        await flushPromises();
        for (const label of ['Breakfast', 'Lunch', 'Dinner', 'Snacks']) {
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === label);
          expect(card?.props('value')).toBe('N/A');
        }
      });
    });

    describe('when today has a meal plan with all meal types', () => {
      beforeEach(() => {
        const { getMealPlanForDate } = useMealPlansData();
        (getMealPlanForDate as Mock).mockResolvedValue(TEST_MEAL_PLAN);
      });

      it("passes each meal from today's plan to the calculation function", async () => {
        wrapper = mountPage();
        await flushPromises();
        for (const meal of TEST_MEAL_PLAN.meals) {
          expect(mealNutrients).toHaveBeenCalledWith(meal);
        }
      });

      it('displays breakfast calories from the calculation result', async () => {
        (mealNutrients as Mock).mockReturnValue({ calories: 520, protein: 0, fat: 0, carbs: 0, sugar: 0, sodium: 0 });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Breakfast');
        expect(card?.props('value')).toBe(520);
      });

      it('displays lunch calories from the calculation result', async () => {
        (mealNutrients as Mock).mockReturnValue({ calories: 680, protein: 0, fat: 0, carbs: 0, sugar: 0, sodium: 0 });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Lunch');
        expect(card?.props('value')).toBe(680);
      });

      it('displays dinner calories from the calculation result', async () => {
        (mealNutrients as Mock).mockReturnValue({ calories: 740, protein: 0, fat: 0, carbs: 0, sugar: 0, sodium: 0 });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Dinner');
        expect(card?.props('value')).toBe(740);
      });

      it('displays snack calories from the calculation result', async () => {
        (mealNutrients as Mock).mockReturnValue({ calories: 310, protein: 0, fat: 0, carbs: 0, sugar: 0, sodium: 0 });
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Snacks');
        expect(card?.props('value')).toBe(310);
      });

      describe('navigation', () => {
        it('navigates to the recipes page for breakfast', async () => {
          const router = useRouter();
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Breakfast');
          await card!.trigger('click');
          expect(router.push).toHaveBeenCalledWith({ path: 'dashboard/recipes', query: { mealType: 'breakfast' } });
        });

        it('navigates to the recipes page for lunch', async () => {
          const router = useRouter();
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Lunch');
          await card!.trigger('click');
          expect(router.push).toHaveBeenCalledWith({ path: 'dashboard/recipes', query: { mealType: 'lunch' } });
        });

        it('navigates to the recipes page for dinner', async () => {
          const router = useRouter();
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Dinner');
          await card!.trigger('click');
          expect(router.push).toHaveBeenCalledWith({ path: 'dashboard/recipes', query: { mealType: 'dinner' } });
        });

        it('navigates to the recipes page for snack', async () => {
          const router = useRouter();
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Snacks');
          await card!.trigger('click');
          expect(router.push).toHaveBeenCalledWith({ path: 'dashboard/recipes', query: { mealType: 'snack' } });
        });
      });
    });

    describe('when a meal type is missing from the plan', () => {
      const planWithSomeMeals: MealPlan = {
        date: '2025-12-25',
        meals: [
          { id: 'meal-b', type: 'Breakfast', items: [] },
          { id: 'meal-l', type: 'Lunch', items: [] },
        ],
      };

      beforeEach(() => {
        const { getMealPlanForDate } = useMealPlansData();
        (getMealPlanForDate as Mock).mockResolvedValue(planWithSomeMeals);
      });

      it('displays N/A for a missing meal type', async () => {
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Dinner');
        expect(card?.props('value')).toBe('N/A');
      });
    });
  });
});
