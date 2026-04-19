import type { WeeklyData } from '@/models/weekly-data';
import type { Settings } from '@/models/settings';
import { mount } from '@vue/test-utils';
import { format } from 'date-fns';
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
  averageFat: 70,
  averageSugar: 30,
  averageSodium: 2000,
};

const TEST_SETTINGS: Settings = {
  minDailyCalories: 1800,
  maxDailyCalories: 2200,
  minDailyProtein: 50,
  maxDailyProtein: 120,
  minDailyCarbs: 200,
  maxDailyCarbs: 300,
  minDailyFat: 40,
  maxDailyFat: 90,
  minDailySodium: 1800,
  maxDailySodium: 2200,
  maxDailySugar: 50,
  tolerance: 10,
  weekStartDay: 0,
};

const mountComponent = (
  props: { title: string; week: WeeklyData; settings?: Settings } = { title: 'This Week', week: TEST_WEEK },
) => mount(WeeklySummaryCard, { props, global: { plugins: [vuetify] } });

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
    const expectedSubtitle = `${format(TEST_WEEK.startDate, 'M/d/yyyy')} - ${format(TEST_WEEK.endDate, 'M/d/yyyy')}`;
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

    it('displays all average nutrient labels and values', () => {
      expect(wrapper.find('[data-testid="calories"]').text()).toContain('Average Calories: 2000');
      expect(wrapper.find('[data-testid="protein"]').text()).toContain('Average Protein: 100g');
      expect(wrapper.find('[data-testid="carbs"]').text()).toContain('Average Carbs: 250g');
      expect(wrapper.find('[data-testid="fat"]').text()).toContain('Average Fat: 70g');
      expect(wrapper.find('[data-testid="sodium"]').text()).toContain('Average Sodium: 2000mg');
      expect(wrapper.find('[data-testid="sugar"]').text()).toContain('Average Sugar: 30g');
    });

    it('displays status markers when settings are provided', () => {
      wrapper = mountComponent({
        title: 'This Week',
        week: {
          ...TEST_WEEK,
          averageCalories: 2000,
          averageCarbs: 400,
        },
        settings: TEST_SETTINGS,
      });

      const caloriesCell = wrapper.find('[data-testid="calories"]');
      expect(caloriesCell.html()).toContain('mdi-circle');
      expect(caloriesCell.html()).toContain('text-success');

      const carbsCell = wrapper.find('[data-testid="carbs"]');
      expect(carbsCell.html()).toContain('mdi-arrow-up-bold');
      expect(carbsCell.html()).toContain('text-error');
    });
  });

  describe('interactions', () => {
    it('emits click when the card is clicked', async () => {
      wrapper = mountComponent();
      const card = wrapper.findComponent(components.VCard);
      await card.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('emits click when Enter is pressed on the card', async () => {
      wrapper = mountComponent();
      const card = wrapper.findComponent(components.VCard);
      await card.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('emits click and prevents default when Space is pressed on the card', async () => {
      wrapper = mountComponent();
      const card = wrapper.findComponent(components.VCard);
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });

      card.element.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('click')).toHaveLength(1);
      expect(event.defaultPrevented).toBe(true);
    });
  });
});
