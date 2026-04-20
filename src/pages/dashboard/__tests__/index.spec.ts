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
import type { Settings } from '@/models/settings';

vi.mock('@/data/settings');
vi.mock('vue-router');
vi.mock('@/data/meal-plans');
vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(DashboardPage, { global: { plugins: [vuetify] } });
const STATUS_TEST_SETTINGS: Settings = {
  minDailyCalories: 1500,
  maxDailyCalories: 2500,
  minDailyProtein: 85,
  maxDailyProtein: 150,
  minDailyCarbs: 130,
  maxDailyCarbs: 300,
  minDailyFat: 20,
  maxDailyFat: 70,
  minDailySodium: 1550,
  maxDailySodium: 2340,
  maxDailySugar: 35,
  tolerance: 15,
  weekStartDay: 1,
};

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

    it('passes the settings to the cards', async () => {
      wrapper = mountPage();
      await flushPromises();
      const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
      const settings = useSettingsData().settings.value;
      for (const card of weekCards) {
        expect(card.props('settings')).toBe(settings);
      }
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
    beforeEach(() => {
      const { settings } = useSettingsData();
      if (!settings.value) throw new Error('Expected settings to be loaded in dashboard tests');
      Object.assign(settings.value, STATUS_TEST_SETTINGS);
    });

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

      it("displays 'low-danger' status for range-based nutrients when there is no meal plan", async () => {
        wrapper = mountPage();
        await flushPromises();
        for (const label of ['Protein (g)', 'Carbs (g)', 'Sodium (mg)', 'Fat (g)', 'Calories']) {
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === label);
          if (!card) throw new Error(`Could not find DetailStatCard with label "${label}"`);
          expect(card.props('status')).toBe('low-danger');
        }
      });

      it("displays 'in-zone' status for sugar when there is no meal plan", async () => {
        wrapper = mountPage();
        await flushPromises();
        const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Sugar (g)');
        expect(card?.props('status')).toBe('in-zone');
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

      describe('status', () => {
        it("passes 'in-zone' status to the protein card when protein is in range", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 100,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Protein (g)');
          expect(card?.props('status')).toBe('in-zone');
        });

        it("passes 'low-danger' status to the protein card when protein is critically low", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 50,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Protein (g)');
          expect(card?.props('status')).toBe('low-danger');
        });

        it("passes 'in-zone' status to the sugar card when sugar is at or below the max", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 30,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Sugar (g)');
          expect(card?.props('status')).toBe('in-zone');
        });

        it("passes 'high-danger' status to the sugar card when sugar exceeds the max plus tolerance", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 45,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Sugar (g)');
          expect(card?.props('status')).toBe('high-danger');
        });

        it("passes 'in-zone' status to the carbs card when carbs are in range", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 200,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Carbs (g)');
          expect(card?.props('status')).toBe('in-zone');
        });

        it("passes 'low-warn' status to the carbs card when carbs are slightly below the minimum", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 105,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Carbs (g)');
          expect(card?.props('status')).toBe('low-warn');
        });

        it("passes 'high-warn' status to the sodium card when sodium is slightly above the maximum", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 2500,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Sodium (mg)');
          expect(card?.props('status')).toBe('high-warn');
        });

        it("passes 'in-zone' status to the fat card when fat is in range", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 50,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Fat (g)');
          expect(card?.props('status')).toBe('in-zone');
        });

        it("passes 'high-danger' status to the fat card when fat is critically high", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 100,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Fat (g)');
          expect(card?.props('status')).toBe('high-danger');
        });

        it("passes 'in-zone' status to the calories card when calories are in range", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 1800,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Calories');
          expect(card?.props('status')).toBe('in-zone');
        });

        it("passes 'high-warn' status to the calories card when calories are slightly above the maximum", async () => {
          (dailyMealPlanNutrients as Mock).mockReturnValue({
            calories: 2600,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(DetailStatCard).find((c) => c.props('label') === 'Calories');
          expect(card?.props('status')).toBe('high-warn');
        });
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
