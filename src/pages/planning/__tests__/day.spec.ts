import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import day from '../day.vue';
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';

vi.mock('vue-router');
vi.mock('@/data/foods');
vi.mock('@/data/meal-plans');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(day, { props, global: { plugins: [vuetify] } });
const renderPage = async (props = {}) => {
  const wrapper = mountPage(props);
  await flushPromises();
  return wrapper;
};

const EMPTY_MEAL_PLAN: MealPlan = {
  id: 'mp-001',
  date: '2025-12-29',
  meals: [],
};
const FULL_MEAL_PLAN: MealPlan = TEST_MEAL_PLANS[0]!;

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

  it('renders', async () => {
    wrapper = await renderPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('parses the date properly', async () => {
    wrapper = await renderPage();
    expect(wrapper.text()).toContain('December 29, 2025');
  });

  it('gets the meal plan for today', async () => {
    const { getMealPlanForDate } = useMealPlansData();
    wrapper = await renderPage();
    expect(getMealPlanForDate).toHaveBeenCalledExactlyOnceWith('2025-12-29');
  });

  it('contains a section for each type of meal', async () => {
    wrapper = await renderPage();
    const headers = wrapper.findAll('h2').map((h) => h.text());
    expect(headers).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snacks']);
  });

  describe('add breakfast button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a breakfast defined', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(true);
      });

      it('does not exist if the meal plan has a breakfast', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(false);
      });
    });
  });

  describe('add lunch button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', async () => {
        wrapper = await renderPage();
        const addLunchButton = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(addLunchButton.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a lunch defined', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(button.exists()).toBe(true);
      });

      it('does not exist if the meal plan has a breakfast', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(button.exists()).toBe(false);
      });
    });
  });

  describe('add dinner button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a dinner defined', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(true);
      });

      it('does not exist if the meal plan has a breakfast', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(false);
      });
    });
  });

  describe('add snack button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a snack defined', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(true);
      });

      it('exists if the meal plan has a breakfast', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(true);
      });
    });
  });
});
