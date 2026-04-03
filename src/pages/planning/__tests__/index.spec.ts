import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ref } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import WeeklySummaryCard from '@/components/planning/WeeklySummaryCard.vue';
import { useSettingsData } from '@/data/settings';
import { useRouter } from 'vue-router';
import { useMealPlansData } from '@/data/meal-plans';
import { multiDayMealPlanNutrients, daysWithMeals } from '@/core/nutritional-calculations';
import type { Settings } from '@/models/settings';
import type { WeeklyData } from '@/models/weekly-data';

vi.mock('@/data/settings');
vi.mock('vue-router');
vi.mock('@/data/meal-plans');
vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Planning', () => {
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

  describe('week cards', () => {
    it('exists for 6 weeks', async () => {
      wrapper = mountPage();
      await flushPromises();
      const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
      expect(weekCards.length).toBe(6);
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

      it('navigates to the week details for next week', async () => {
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

    describe('previous weeks', () => {
      it('are in the correct order', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
        const titles = weekCards.slice(2).map((card) => card.props('title'));
        const weeks = weekCards.slice(2).map((card) => card.props('week') as WeeklyData);
        expect(titles).toEqual(['Weeks Ago: 1', 'Weeks Ago: 2', 'Weeks Ago: 3', 'Weeks Ago: 4']);
        expect(weeks.map((w) => w.startDate.getFullYear())).toEqual([2025, 2025, 2025, 2025]);
        expect(weeks.map((w) => w.startDate.getMonth())).toEqual([11, 11, 11, 10]);
        expect(weeks.map((w) => w.startDate.getDate())).toEqual([15, 8, 1, 24]);
        expect(weeks.map((w) => w.endDate.getFullYear())).toEqual([2025, 2025, 2025, 2025]);
        expect(weeks.map((w) => w.endDate.getMonth())).toEqual([11, 11, 11, 10]);
        expect(weeks.map((w) => w.endDate.getDate())).toEqual([21, 14, 7, 30]);
      });

      it('navigates to the week page', async () => {
        const router = useRouter();
        wrapper = mountPage();
        const targetDates = ['2025-12-15', '2025-12-08', '2025-12-01', '2025-11-24'];
        await flushPromises();
        const weekCards = wrapper.findAllComponents(WeeklySummaryCard);
        for (let i = 2; i < weekCards.length; i++) {
          await weekCards[i]!.trigger('click');
          expect(router.push).toHaveBeenCalledWith({
            path: 'planning/week',
            query: { dt: targetDates[i - 2] },
          });
        }
      });
    });

    describe('data fetching', () => {
      it('calls useMealPlansData', async () => {
        wrapper = mountPage();
        await flushPromises();
        expect(useMealPlansData).toHaveBeenCalled();
      });

      it('fetches exactly 6 meal plans', async () => {
        const { getMealPlansForPeriod } = useMealPlansData();
        wrapper = mountPage();
        await flushPromises();
        expect(getMealPlansForPeriod).toHaveBeenCalledTimes(6);
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

      it('fetches meal plans for all four previous weeks', async () => {
        const { getMealPlansForPeriod } = useMealPlansData();
        wrapper = mountPage();
        await flushPromises();
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-15', '2025-12-21');
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-08', '2025-12-14');
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-01', '2025-12-07');
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-11-24', '2025-11-30');
      });

      describe('with weekStartDay: 5 (Friday)', () => {
        const fridaySettings = ref<Settings>({
          dailyCalorieLimit: 2500,
          dailySugarLimit: 35,
          dailyProteinTarget: 85,
          tolerance: 15,
          cheatDays: 2,
          weekStartDay: 5,
        });
        (fridaySettings as any).promise = { value: Promise.resolve(fridaySettings) };

        beforeEach(() => {
          (useSettingsData as Mock).mockReturnValue({ settings: fridaySettings });
        });

        it('computes correct week boundaries for this week', async () => {
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[0]?.props('week') as WeeklyData;
          expect(week.startDate.getFullYear()).toBe(2025);
          expect(week.startDate.getMonth()).toBe(11);
          expect(week.startDate.getDate()).toBe(19);
          expect(week.endDate.getFullYear()).toBe(2025);
          expect(week.endDate.getMonth()).toBe(11);
          expect(week.endDate.getDate()).toBe(25);
        });

        it('computes correct week boundaries for next week', async () => {
          wrapper = mountPage();
          await flushPromises();
          const week = wrapper.findAllComponents(WeeklySummaryCard)[1]?.props('week') as WeeklyData;
          expect(week.startDate.getFullYear()).toBe(2025);
          expect(week.startDate.getMonth()).toBe(11);
          expect(week.startDate.getDate()).toBe(26);
          expect(week.endDate.getFullYear()).toBe(2026);
          expect(week.endDate.getMonth()).toBe(0);
          expect(week.endDate.getDate()).toBe(1);
        });

        it('fetches meal plans for this week', async () => {
          const { getMealPlansForPeriod } = useMealPlansData();
          wrapper = mountPage();
          await flushPromises();
          expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-19', '2025-12-25');
        });

        it('fetches meal plans for next week', async () => {
          const { getMealPlansForPeriod } = useMealPlansData();
          wrapper = mountPage();
          await flushPromises();
          expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-26', '2026-01-01');
        });

        it('fetches meal plans for all four previous weeks', async () => {
          const { getMealPlansForPeriod } = useMealPlansData();
          wrapper = mountPage();
          await flushPromises();
          expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-12', '2025-12-18');
          expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-05', '2025-12-11');
          expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-11-28', '2025-12-04');
          expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-11-21', '2025-11-27');
        });
      });
    });
  });
});
