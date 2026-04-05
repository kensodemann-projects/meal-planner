import DailySummaryCard from '@/components/planning/DailySummaryCard.vue';
import { TEST_MEAL_PLAN, TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import { useMealPlansData } from '@/data/meal-plans';
import { flushPromises, mount } from '@vue/test-utils';
import { format } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRoute } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import week from '../week.vue';

vi.mock('vue-router');
vi.mock('@/data/meal-plans');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(week, { props, global: { plugins: [vuetify] } });
const renderPage = async (props = {}) => {
  const wrapper = mountPage(props);
  await flushPromises();
  return wrapper;
};

describe('week', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    (useRoute as Mock).mockReturnValue({
      query: { dt: '2025-12-29' },
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

  it('shows a loading indicator while meal plans are being fetched', () => {
    wrapper = mountPage();
    expect(wrapper.findComponent({ name: 'VProgressCircular' }).exists()).toBe(true);
  });

  it('hides the loading indicator once meal plans have loaded', async () => {
    wrapper = await renderPage();
    expect(wrapper.findComponent({ name: 'VProgressCircular' }).exists()).toBe(false);
  });

  it('calls getMealPlansForPeriod with the correct start and end dates', async () => {
    wrapper = await renderPage();
    const { getMealPlansForPeriod } = useMealPlansData();
    expect(getMealPlansForPeriod).toHaveBeenCalledExactlyOnceWith('2025-12-29', '2026-01-04');
  });

  describe('when displaying meal plans for the week', () => {
    const weekDates = [
      '2025-12-29',
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-01-04',
    ];

    it('renders a DailySummaryCard for each day in order when all days have a meal plan', async () => {
      const weekPlans = [...TEST_MEAL_PLANS.filter((p) => p.date >= '2025-12-29'), TEST_MEAL_PLAN];
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue(weekPlans);
      wrapper = await renderPage();

      const cards = wrapper.findAllComponents(DailySummaryCard);
      expect(cards).toHaveLength(7);
      weekDates.forEach((date, i) => {
        expect(format(cards[i]!.props('date'), 'yyyy-MM-dd')).toBe(date);
        expect(cards[i]!.props('mealPlan')).toEqual(weekPlans[i]);
      });
    });

    it('renders a DailySummaryCard for each day in order when only some days have a meal plan', async () => {
      const sparseDates = ['2025-12-29', '2025-12-31', '2026-01-02'];
      const sparseWeekPlans = TEST_MEAL_PLANS.filter((p) => sparseDates.includes(p.date));
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue(sparseWeekPlans);
      wrapper = await renderPage();

      const cards = wrapper.findAllComponents(DailySummaryCard);
      expect(cards).toHaveLength(7);
      weekDates.forEach((date, i) => {
        expect(format(cards[i]!.props('date'), 'yyyy-MM-dd')).toBe(date);
        expect(cards[i]!.props('mealPlan')).toEqual(sparseWeekPlans.find((p) => p.date === date));
      });
    });

    it('renders a DailySummaryCard for each day in order when no days have a meal plan', async () => {
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue([]);
      wrapper = await renderPage();

      const cards = wrapper.findAllComponents(DailySummaryCard);
      expect(cards).toHaveLength(7);
      weekDates.forEach((date, i) => {
        expect(format(cards[i]!.props('date'), 'yyyy-MM-dd')).toBe(date);
        expect(cards[i]!.props('mealPlan')).toBeUndefined();
      });
    });

    it('passes the correct to prop to each DailySummaryCard for navigation', async () => {
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue([]);
      wrapper = await renderPage();

      const cards = wrapper.findAllComponents(DailySummaryCard);
      expect(cards[2]!.props('to')).toEqual({ path: '/planning/day', query: { dt: '2025-12-31' } });
    });
  });
});
