import type { WeeklyData } from '@/models/weekly-data';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import WeeklySummaryCard from '../WeeklySummaryCard.vue';

const vuetify = createVuetify({ components, directives });

const TEST_WEEK: WeeklyData = {
  startDate: new Date(2025, 11, 22),
  endDate: new Date(2025, 11, 28),
  daysWithMeals: 5,
  averageCalories: 2000,
  averageProtein: 100,
  averageCarbs: 250,
};

const mountComponent = (props: { title: string; week: WeeklyData } = { title: 'This Week', week: TEST_WEEK }) =>
  mount(WeeklySummaryCard, { props, global: { plugins: [vuetify] } });

describe('Weekly Summary Card', () => {
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

  it('displays the title prop in the card title', () => {
    wrapper = mountComponent({ title: 'Next Week (Planning)', week: TEST_WEEK });
    const title = wrapper.findComponent(components.VCardTitle);
    expect(title.text()).toBe('Next Week (Planning)');
  });

  it('displays the date range in the subtitle', () => {
    wrapper = mountComponent();
    const subtitle = wrapper.findComponent(components.VCardSubtitle);
    const formatter = new Intl.DateTimeFormat('en-US');
    const expectedSubtitle = `${formatter.format(TEST_WEEK.startDate)} - ${formatter.format(TEST_WEEK.endDate)}`;
    expect(subtitle.text()).toBe(expectedSubtitle);
  });

  describe('stats', () => {
    beforeEach(() => {
      wrapper = mountComponent();
    });

    it('displays days with meals', () => {
      const text = wrapper.findComponent(components.VCardText);
      expect(text.text()).toContain('Days with Meals: 5');
    });

    it('displays average calories', () => {
      const text = wrapper.findComponent(components.VCardText);
      expect(text.text()).toContain('Average Calories: 2000');
    });

    it('displays average protein with g suffix', () => {
      const text = wrapper.findComponent(components.VCardText);
      expect(text.text()).toContain('Average Protein: 100g');
    });

    it('displays average carbs with g suffix', () => {
      const text = wrapper.findComponent(components.VCardText);
      expect(text.text()).toContain('Average Carbs: 250g');
    });
  });

  it('emits click when the card is clicked', async () => {
    wrapper = mountComponent();
    const card = wrapper.findComponent(components.VCard);
    await card.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
