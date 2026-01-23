import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import day from '../day.vue';
import { useMealPlansData } from '@/data/meal-plans';

vi.mock('vue-router');
vi.mock('@/data/foods');
vi.mock('@/data/meal-plans');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(day, { props, global: { plugins: [vuetify] } });

describe('day', () => {
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

  it('parses the date properly', () => {
    wrapper = mountPage();
    expect(wrapper.text()).toContain('December 29, 2025');
  });

  it('gets the meal plan for today', () => {
    const { getMealPlanForDate } = useMealPlansData();
    wrapper = mountPage();
    expect(getMealPlanForDate).toHaveBeenCalledExactlyOnceWith('2025-12-29');
  });

  it('contains a section for each type of meal', () => {
    wrapper = mountPage();
    const headers = wrapper.findAll('h2').map((h) => h.text());
    expect(headers).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snacks']);
  });

  describe('add breakfast button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a breakfast defined', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(true);
      });
    });
  });

  describe('add lunch button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', () => {
        wrapper = mountPage();
        const addLunchButton = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(addLunchButton.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a lunch defined', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(button.exists()).toBe(true);
      });
    });
  });

  describe('add dinner button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a dinner defined', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(true);
      });
    });
  });

  describe('add snack button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a snack defined', () => {
        wrapper = mountPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(true);
      });
    });
  });
});
