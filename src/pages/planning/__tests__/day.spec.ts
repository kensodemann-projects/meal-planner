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

  it.each([FULL_MEAL_PLAN, EMPTY_MEAL_PLAN, null])(
    'does not display any meal editors',
    async (plan: MealPlan | null) => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(plan);
      wrapper = await renderPage();
      const editors = wrapper.findAllComponents({ name: 'MealEditor' });
      expect(editors.length).toBe(0);
    },
  );

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

    describe('click', () => {
      it('hides the button', async () => {
        wrapper = await renderPage();
        let button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(true);
        await button.trigger('click');
        button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(button.exists()).toBe(false);
      });

      it('displays the editor for breakfast', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        await button.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        expect(editor.exists()).toBe(true);
        const meal = editor.props('meal');
        expect(meal.type).toBe('Breakfast');
      });

      describe('on cancel', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('cancel');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('shows the add breakfast button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          await editor.vm.$emit('cancel');
          const breakfastButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          expect(breakfastButton.exists()).toBe(true);
        });
      });

      describe('on save', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('save');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('does not show the add breakfast button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          editor.vm.$emit('save');
          const breakfastButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          expect(breakfastButton.exists()).toBe(false);
        });
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

    describe('click', () => {
      it('hides the button', async () => {
        wrapper = await renderPage();
        let button = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(button.exists()).toBe(true);
        await button.trigger('click');
        button = wrapper.findComponent('[data-testid="add-lunch-button"]');
        expect(button.exists()).toBe(false);
      });

      it('displays the editor for lunch', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
        await button.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        expect(editor.exists()).toBe(true);
        const meal = editor.props('meal');
        expect(meal.type).toBe('Lunch');
      });

      describe('on cancel', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('cancel');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('shows the add lunch button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          await editor.vm.$emit('cancel');
          const lunchButton = wrapper.findComponent('[data-testid="add-lunch-button"]');
          expect(lunchButton.exists()).toBe(true);
        });
      });

      describe('on save', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('save');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('does not show the add lunch button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('save');
          const lunchButton = wrapper.findComponent('[data-testid="add-lunch-button"]');
          expect(lunchButton.exists()).toBe(false);
        });
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

    describe('click', () => {
      it('hides the button', async () => {
        wrapper = await renderPage();
        let button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(true);
        await button.trigger('click');
        button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        expect(button.exists()).toBe(false);
      });

      it('displays the editor for dinner', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
        await button.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        expect(editor.exists()).toBe(true);
        const meal = editor.props('meal');
        expect(meal.type).toBe('Dinner');
      });

      describe('on cancel', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('cancel');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('shows the add dinner button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          await editor.vm.$emit('cancel');
          const dinnerButton = wrapper.findComponent('[data-testid="add-dinner-button"]');
          expect(dinnerButton.exists()).toBe(true);
        });
      });

      describe('on save', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('save');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('does not show the add dinner button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('save');
          const dinnerButton = wrapper.findComponent('[data-testid="add-dinner-button"]');
          expect(dinnerButton.exists()).toBe(false);
        });
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

  describe('cancel button', () => {
    it('exists', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="cancel-button"]');
      expect(button.exists()).toBe(true);
    });
  });

  describe('save button', () => {
    it('exists', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="save-button"]');
      expect(button.exists()).toBe(true);
    });
  });
});
