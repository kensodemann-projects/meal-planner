import { useMealPlansData } from '@/data/meal-plans';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
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

  // TODO: Add a test that verifies the correct meal plans are rendered for the week once loaded.
  //       Include that they are rendered in the correct order (sorted by date) and that the
  //       DailySummaryCard component is used for day, including days without a meal plan.
});
