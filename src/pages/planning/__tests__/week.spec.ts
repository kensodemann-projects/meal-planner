import { flushPromises, mount } from '@vue/test-utils';
import { intlFormat } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { useMealPlansData } from '@/data/meal-plans';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { MealPlan } from '@/models/meal-plan';
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

  it('displays the proper headers for the week starting with dt', async () => {
    wrapper = await renderPage();
    const headers = wrapper.findAll('h2');
    expect(headers).toHaveLength(7);
    expect(headers[0]!.text()).toBe(intlFormat(new Date(2025, 11, 29), { dateStyle: 'full' }));
    expect(headers[1]!.text()).toBe(intlFormat(new Date(2025, 11, 30), { dateStyle: 'full' }));
    expect(headers[2]!.text()).toBe(intlFormat(new Date(2025, 11, 31), { dateStyle: 'full' }));
    expect(headers[3]!.text()).toBe(intlFormat(new Date(2026, 0, 1), { dateStyle: 'full' }));
    expect(headers[4]!.text()).toBe(intlFormat(new Date(2026, 0, 2), { dateStyle: 'full' }));
    expect(headers[5]!.text()).toBe(intlFormat(new Date(2026, 0, 3), { dateStyle: 'full' }));
    expect(headers[6]!.text()).toBe(intlFormat(new Date(2026, 0, 4), { dateStyle: 'full' }));
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

  it('shows "No meal plan for this day." for every day when no plans are returned', async () => {
    wrapper = await renderPage();
    const noPlanMessages = wrapper.findAll('p').filter((p) => p.text() === 'No meal plan for this day.');
    expect(noPlanMessages).toHaveLength(7);
  });

  it('shows the meals for a day that has a plan', async () => {
    const planForTuesday: MealPlan = { ...TEST_MEAL_PLANS[0]!, date: '2025-12-30' };
    (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValueOnce([planForTuesday]);
    wrapper = await renderPage();
    const mealTypes = wrapper.findAll('li').map((li) => li.text());
    expect(mealTypes).toContain('Breakfast');
    expect(mealTypes).toContain('Lunch');
    expect(mealTypes).toContain('Dinner');
  });

  it('does not show the meals section for days without a plan', async () => {
    const planForTuesday: MealPlan = { ...TEST_MEAL_PLANS[0]!, date: '2025-12-30' };
    (useMealPlansData().getMealPlansForPeriod as Mock).mockResolvedValueOnce([planForTuesday]);
    wrapper = await renderPage();
    expect(wrapper.findAll('ul')).toHaveLength(1);
  });

  it('navigates to the day planning page when a day header is clicked', async () => {
    wrapper = await renderPage();
    await wrapper.findAll('h2')[0]!.trigger('click');
    const { push } = useRouter();
    expect(push).toHaveBeenCalledExactlyOnceWith({ path: '/planning/day', query: { dt: '2025-12-29' } });
  });

  describe('close button', () => {
    it('is rendered', async () => {
      wrapper = await renderPage();
      expect(wrapper.find('[data-testid="close-button"]').exists()).toBe(true);
    });

    it('navigates to /planning when clicked', async () => {
      wrapper = await renderPage();
      await wrapper.find('[data-testid="close-button"]').trigger('click');
      const { push } = useRouter();
      expect(push).toHaveBeenCalledExactlyOnceWith('/planning');
    });
  });
});
