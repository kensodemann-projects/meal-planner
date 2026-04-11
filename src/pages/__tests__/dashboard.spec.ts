import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DashboardPage from '../dashboard.vue';
import { useRouter } from 'vue-router';
import WeeklySummaryCard from '@/components/planning/WeeklySummaryCard.vue';
import type { WeeklyData } from '@/models/weekly-data';
import { daysWithMeals, multiDayMealPlanNutrients } from '@/core/nutritional-calculations';
import { useSettingsData } from '@/data/settings';
import { useMealPlansData } from '@/data/meal-plans';

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
});
