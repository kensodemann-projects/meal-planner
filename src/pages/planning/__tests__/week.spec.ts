import DailySummaryCard from '@/components/planning/DailySummaryCard.vue';
import { TEST_MEAL_PLAN, TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import { useMealPlansData } from '@/data/meal-plans';
import type { PlannedMealItem } from '@/models/meal';
import { flushPromises, mount } from '@vue/test-utils';
import { format } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import week from '../week.vue';
import { useSettingsData } from '@/data/settings';

vi.mock('vue-router');
vi.mock('@/data/meal-plans');
vi.mock('@/data/settings');

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
      query: { weekStartDate: '2025-12-29' },
    });
    (useRouter as Mock).mockReturnValue({
      back: vi.fn(),
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

  it('gets the settings', async () => {
    wrapper = await renderPage();
    expect(useSettingsData).toHaveBeenCalledExactlyOnceWith();
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
      const { settings } = useSettingsData();
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue(weekPlans);
      wrapper = await renderPage();

      const cards = wrapper.findAllComponents(DailySummaryCard);
      expect(cards).toHaveLength(7);
      weekDates.forEach((date, i) => {
        expect(format(cards[i]!.props('date'), 'yyyy-MM-dd')).toBe(date);
        expect(cards[i]!.props('mealPlan')).toEqual(weekPlans[i]);
        expect(cards[i]!.props('settings')).toEqual(settings.value);
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
  });

  describe('close button', () => {
    it('is rendered', async () => {
      wrapper = await renderPage();
      expect(wrapper.find('[data-testid="close-button"]').exists()).toBe(true);
    });

    it('navigates back when clicked', async () => {
      wrapper = await renderPage();
      await wrapper.find('[data-testid="close-button"]').trigger('click');
      const { back } = useRouter();
      expect(back).toHaveBeenCalledTimes(1);
    });
  });

  describe('add button', () => {
    it('is rendered', async () => {
      wrapper = await renderPage();
      expect(wrapper.findComponent('[data-testid="add-button"]').exists()).toBe(true);
    });

    it('navigates to the add page with the week start date when clicked', async () => {
      wrapper = await renderPage();
      await wrapper.findComponent('[data-testid="add-button"]').trigger('click');
      const { push } = useRouter();
      expect(push).toHaveBeenCalledExactlyOnceWith({ path: 'add', query: { weekStartDate: '2025-12-29' } });
    });
  });

  describe('modify event', () => {
    const plannedMealItemFor = (
      mealPlan: (typeof TEST_MEAL_PLANS)[number],
      mealIndex = 0,
      itemIndex = 0,
    ): PlannedMealItem => {
      const meal = mealPlan.meals[mealIndex]!;
      return {
        mealItem: meal.items[itemIndex]!,
        mealDate: mealPlan.date,
        mealType: meal.type,
      };
    };

    const emitModifyFromCard = (mealPlan: (typeof TEST_MEAL_PLANS)[number], plannedMealItem: PlannedMealItem) => {
      const card = wrapper.findAllComponents(DailySummaryCard).find((c) => c.props('mealPlan')?.id === mealPlan.id);
      expect(card).toBeDefined();
      card!.vm.$emit('modify', plannedMealItem);
    };

    it('navigates to the update page with the meal item details when a meal item is modified', async () => {
      const mealPlan = TEST_MEAL_PLANS.find((plan) => plan.date === '2025-12-29')!;
      const plannedMealItem = plannedMealItemFor(mealPlan, 1, 0);
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue([mealPlan]);
      wrapper = await renderPage();

      emitModifyFromCard(mealPlan, plannedMealItem);

      const { push } = useRouter();
      expect(push).toHaveBeenCalledExactlyOnceWith({
        path: 'update',
        query: {
          weekStartDate: '2025-12-29',
          mealPlanId: mealPlan.id,
          mealType: plannedMealItem.mealType,
          mealItemId: plannedMealItem.mealItem.id,
        },
      });
    });

    it('navigates using the meal plan for the day that emitted modify', async () => {
      const firstDayPlan = TEST_MEAL_PLANS.find((plan) => plan.date === '2025-12-29')!;
      const secondDayPlan = TEST_MEAL_PLANS.find((plan) => plan.date === '2025-12-30')!;
      const plannedMealItem = plannedMealItemFor(secondDayPlan);
      (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValue([firstDayPlan, secondDayPlan]);
      wrapper = await renderPage();

      emitModifyFromCard(secondDayPlan, plannedMealItem);

      const { push } = useRouter();
      expect(push).toHaveBeenCalledExactlyOnceWith({
        path: 'update',
        query: {
          weekStartDate: '2025-12-29',
          mealPlanId: secondDayPlan.id,
          mealType: plannedMealItem.mealType,
          mealItemId: plannedMealItem.mealItem.id,
        },
      });
    });
  });
});
