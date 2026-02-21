import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import day from '../day.vue';
import { useMealPlansData } from '@/data/meal-plans';
import type { MealPlan } from '@/models/meal-plan';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import type { Meal, MealItem } from '@/models/meal';

vi.mock('vue-router');
vi.mock('@/data/foods');
vi.mock('@/data/meal-plans');
vi.mock('@/data/recipes');
vi.mock('@/data/settings');

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
  date: '2026-02-18',
  meals: [],
};
const FULL_MEAL_PLAN: MealPlan = { ...TEST_MEAL_PLANS[0]!, date: '2026-02-18' };

const MODIFIED_MEAL_ITEM: MealItem = {
  id: 'modified-item',
  name: 'Modified Item',
  foodItemId: 'food-1',
  units: 2,
  unitOfMeasure: { id: 'cup', name: 'cup', type: 'volume', system: 'customary' },
  nutrition: { calories: 100, sodium: 50, fat: 1, protein: 5, carbs: 20, sugar: 1 },
};
const buildModifiedMeal = (baseMeal: Meal): Meal => ({ ...baseMeal, items: [MODIFIED_MEAL_ITEM] });

describe('day', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    (useRoute as Mock).mockReturnValue({
      query: { dt: '2026-02-18' },
    });
    (useRouter as Mock).mockReturnValue({
      replace: vi.fn(),
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
    expect(wrapper.text()).toContain('February 18, 2026');
  });

  it('gets the meal plan for today', async () => {
    const { getMealPlanForDate } = useMealPlansData();
    wrapper = await renderPage();
    expect(getMealPlanForDate).toHaveBeenCalledExactlyOnceWith('2026-02-18');
  });

  it('contains a section for each type of meal', async () => {
    wrapper = await renderPage();
    const headers = wrapper.findAll('h2').map((h) => h.text());
    expect(headers).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snacks']);
  });

  it.each([
    { case: 'full meal plan', plan: FULL_MEAL_PLAN },
    { case: 'empty meal plan', plan: EMPTY_MEAL_PLAN },
    { case: 'new meal plan', plan: null },
  ])('does not display any meal editors for $case', async ({ plan }: { plan: MealPlan | null }) => {
    const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
    getMealPlanForDate.mockResolvedValueOnce(plan);
    wrapper = await renderPage();
    const editors = wrapper.findAllComponents({ name: 'MealEditor' });
    expect(editors.length).toBe(0);
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

        it('assigns the meal to the breakfast view', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-123', type: 'Breakfast', items: [] };
          await editor.vm.$emit('save', newMeal);
          const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
          expect(breakfastView.exists()).toBe(true);
          expect(breakfastView.props('meal')).toEqual(newMeal);
        });

        it('displays the breakfast in the editor when the breakfast meal view emits the modify event', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          const newMeal: Meal = { id: 'meal-123', type: 'Breakfast', items: [] };
          await editor.vm.$emit('save', newMeal);
          const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
          await breakfastView.vm.$emit('modify');
          const modifyEditor = wrapper.findComponent({ name: 'MealEditor' });
          expect(modifyEditor.exists()).toBe(true);
          expect(modifyEditor.props('meal')).toEqual(newMeal);
          expect(wrapper.findComponent('[data-testid="breakfast-view"]').exists()).toBe(false);
        });
      });
    });
  });

  describe('breakfast view', () => {
    it('is displayed when breakfast data exists and is not being edited', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="breakfast-view"]');
      expect(view.exists()).toBe(true);
    });

    it('is not displayed when there is no breakfast data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="breakfast-view"]');
      expect(view.exists()).toBe(false);
    });

    it('is not displayed when the breakfast editor is showing', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="add-breakfast-button"]');
      await button.trigger('click');
      const view = wrapper.findComponent('[data-testid="breakfast-view"]');
      expect(view.exists()).toBe(false);
    });

    it('displays the correct meal data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
      expect(view.props('meal')).toEqual(FULL_MEAL_PLAN.meals[0]);
    });

    it('displays the breakfast in the editor when the breakfast meal view emits the modify event', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
      await breakfastView.vm.$emit('modify');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      expect(editor.props('meal')).toEqual(FULL_MEAL_PLAN.meals[0]);
      expect(wrapper.findComponent('[data-testid="breakfast-view"]').exists()).toBe(false);
    });

    describe('the delete event', () => {
      it('displays the confirmation dialog', () => {
        // TODO: create the test TDD style. See @src/pages/recipes/[id]/__tests__/index.spec.ts for an example of how to test a confirmation dialog.
      });

      describe('on confirm', () => {
        it('removes the view', async () => {
          // TODO: create the test TDD style.
        });

        it('displays the add button', async () => {
          // TODO: create the test TDD style.
        });
      });

      describe('on deny', () => {
        it('does not remove the view', async () => {
          // TODO: create the test TDD style.
        });

        it('does not display the add button', async () => {
          // TODO: create the test TDD style.
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

      it('does not exist if the meal plan has a lunch', async () => {
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

        it('assigns the meal to the lunch view', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-456', type: 'Lunch', items: [] };
          await editor.vm.$emit('save', newMeal);
          const lunchView = wrapper.findComponent('[data-testid="lunch-view"]') as VueWrapper<any>;
          expect(lunchView.exists()).toBe(true);
          expect(lunchView.props('meal')).toEqual(newMeal);
        });

        it('displays the lunch in the editor when the lunch meal view emits the modify event', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          const newMeal: Meal = { id: 'meal-456', type: 'Lunch', items: [] };
          await editor.vm.$emit('save', newMeal);
          const lunchView = wrapper.findComponent('[data-testid="lunch-view"]') as VueWrapper<any>;
          await lunchView.vm.$emit('modify');
          const modifyEditor = wrapper.findComponent({ name: 'MealEditor' });
          expect(modifyEditor.exists()).toBe(true);
          expect(modifyEditor.props('meal')).toEqual(newMeal);
          expect(wrapper.findComponent('[data-testid="lunch-view"]').exists()).toBe(false);
        });
      });
    });
  });

  describe('lunch view', () => {
    it('is displayed when lunch data exists and is not being edited', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="lunch-view"]');
      expect(view.exists()).toBe(true);
    });

    it('is not displayed when there is no lunch data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="lunch-view"]');
      expect(view.exists()).toBe(false);
    });

    it('is not displayed when the lunch editor is showing', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="add-lunch-button"]');
      await button.trigger('click');
      const view = wrapper.findComponent('[data-testid="lunch-view"]');
      expect(view.exists()).toBe(false);
    });

    it('displays the correct meal data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="lunch-view"]') as VueWrapper<any>;
      expect(view.props('meal')).toEqual(FULL_MEAL_PLAN.meals[1]);
    });

    it('displays the lunch in the editor when the lunch meal view emits the modify event', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const lunchView = wrapper.findComponent('[data-testid="lunch-view"]') as VueWrapper<any>;
      await lunchView.vm.$emit('modify');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      expect(editor.props('meal')).toEqual(FULL_MEAL_PLAN.meals[1]);
      expect(wrapper.findComponent('[data-testid="lunch-view"]').exists()).toBe(false);
    });

    describe('the delete event', () => {
      it('displays the confirmation dialog', () => {
        // TODO: create the test TDD style. See @src/pages/recipes/[id]/__tests__/index.spec.ts for an example of how to test a confirmation dialog.
      });

      describe('on confirm', () => {
        it('removes the view', async () => {
          // TODO: create the test TDD style.
        });

        it('displays the add button', async () => {
          // TODO: create the test TDD style.
        });
      });

      describe('on deny', () => {
        it('does not remove the view', async () => {
          // TODO: create the test TDD style.
        });

        it('does not display the add button', async () => {
          // TODO: create the test TDD style.
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

      it('does not exist if the meal plan has a dinner', async () => {
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

        it('assigns the meal to the dinner view', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-789', type: 'Dinner', items: [] };
          await editor.vm.$emit('save', newMeal);
          const dinnerView = wrapper.findComponent('[data-testid="dinner-view"]') as VueWrapper<any>;
          expect(dinnerView.exists()).toBe(true);
          expect(dinnerView.props('meal')).toEqual(newMeal);
        });

        it('displays the dinner in the editor when the dinner meal view emits the modify event', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          const newMeal: Meal = { id: 'meal-789', type: 'Dinner', items: [] };
          await editor.vm.$emit('save', newMeal);
          const dinnerView = wrapper.findComponent('[data-testid="dinner-view"]') as VueWrapper<any>;
          await dinnerView.vm.$emit('modify');
          const modifyEditor = wrapper.findComponent({ name: 'MealEditor' });
          expect(modifyEditor.exists()).toBe(true);
          expect(modifyEditor.props('meal')).toEqual(newMeal);
          expect(wrapper.findComponent('[data-testid="dinner-view"]').exists()).toBe(false);
        });
      });
    });
  });

  describe('dinner view', () => {
    it('is displayed when dinner data exists and is not being edited', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="dinner-view"]');
      expect(view.exists()).toBe(true);
    });

    it('is not displayed when there is no dinner data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="dinner-view"]');
      expect(view.exists()).toBe(false);
    });

    it('is not displayed when the dinner editor is showing', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="add-dinner-button"]');
      await button.trigger('click');
      const view = wrapper.findComponent('[data-testid="dinner-view"]');
      expect(view.exists()).toBe(false);
    });

    it('displays the correct meal data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="dinner-view"]') as VueWrapper<any>;
      expect(view.props('meal')).toEqual(FULL_MEAL_PLAN.meals[2]);
    });

    it('displays the dinner in the editor when the dinner meal view emits the modify event', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const dinnerView = wrapper.findComponent('[data-testid="dinner-view"]') as VueWrapper<any>;
      await dinnerView.vm.$emit('modify');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      expect(editor.props('meal')).toEqual(FULL_MEAL_PLAN.meals[2]);
      expect(wrapper.findComponent('[data-testid="dinner-view"]').exists()).toBe(false);
    });

    describe('the delete event', () => {
      it('displays the confirmation dialog', () => {
        // TODO: create the test TDD style. See @src/pages/recipes/[id]/__tests__/index.spec.ts for an example of how to test a confirmation dialog.
      });

      describe('on confirm', () => {
        it('removes the view', async () => {
          // TODO: create the test TDD style.
        });

        it('displays the add button', async () => {
          // TODO: create the test TDD style.
        });
      });

      describe('on deny', () => {
        it('does not remove the view', async () => {
          // TODO: create the test TDD style.
        });

        it('does not display the add button', async () => {
          // TODO: create the test TDD style.
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

      it('does not exist if the meal plan has a snack', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(false);
      });
    });

    describe('click', () => {
      it('hides the button', async () => {
        wrapper = await renderPage();
        let button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(true);
        await button.trigger('click');
        button = wrapper.findComponent('[data-testid="add-snack-button"]');
        expect(button.exists()).toBe(false);
      });

      it('displays the editor for snack', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent('[data-testid="add-snack-button"]');
        await button.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        expect(editor.exists()).toBe(true);
        const meal = editor.props('meal');
        expect(meal.type).toBe('Snack');
      });

      describe('on cancel', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-snack-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('cancel');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('shows the add snack button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-snack-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          await editor.vm.$emit('cancel');
          const snackButton = wrapper.findComponent('[data-testid="add-snack-button"]');
          expect(snackButton.exists()).toBe(true);
        });
      });

      describe('on save', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-snack-button"]');
          await button.trigger('click');
          let editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('save');
          editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(false);
        });

        it('does not show the add snack button again', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-snack-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          editor.vm.$emit('save');
          const snackButton = wrapper.findComponent('[data-testid="add-snack-button"]');
          expect(snackButton.exists()).toBe(false);
        });

        it('assigns the meal to the snack view', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-snack-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-snack-123', type: 'Snack', items: [] };
          await editor.vm.$emit('save', newMeal);
          const snackView = wrapper.findComponent('[data-testid="snack-view"]') as VueWrapper<any>;
          expect(snackView.exists()).toBe(true);
          expect(snackView.props('meal')).toEqual(newMeal);
        });

        it('displays the snack in the editor when the snack meal view emits the modify event', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent('[data-testid="add-snack-button"]');
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          const newMeal: Meal = { id: 'meal-snack-123', type: 'Snack', items: [] };
          await editor.vm.$emit('save', newMeal);
          const snackView = wrapper.findComponent('[data-testid="snack-view"]') as VueWrapper<any>;
          await snackView.vm.$emit('modify');
          const modifyEditor = wrapper.findComponent({ name: 'MealEditor' });
          expect(modifyEditor.exists()).toBe(true);
          expect(modifyEditor.props('meal')).toEqual(newMeal);
          expect(wrapper.findComponent('[data-testid="snack-view"]').exists()).toBe(false);
        });
      });
    });
  });

  describe('snack view', () => {
    it('is displayed when snack data exists and is not being edited', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="snack-view"]');
      expect(view.exists()).toBe(true);
    });

    it('is not displayed when there is no snack data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="snack-view"]');
      expect(view.exists()).toBe(false);
    });

    it('is not displayed when the snack editor is showing', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="add-snack-button"]');
      await button.trigger('click');
      const view = wrapper.findComponent('[data-testid="snack-view"]');
      expect(view.exists()).toBe(false);
    });

    it('displays the correct meal data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent('[data-testid="snack-view"]') as VueWrapper<any>;
      expect(view.props('meal')).toEqual(FULL_MEAL_PLAN.meals[3]);
    });

    it('displays the snack in the editor when the snack meal view emits the modify event', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const snackView = wrapper.findComponent('[data-testid="snack-view"]') as VueWrapper<any>;
      await snackView.vm.$emit('modify');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      expect(editor.props('meal')).toEqual(FULL_MEAL_PLAN.meals[3]);
      expect(wrapper.findComponent('[data-testid="snack-view"]').exists()).toBe(false);
    });

    describe('the delete event', () => {
      it('displays the confirmation dialog', () => {
        // TODO: create the test TDD style. See @src/pages/recipes/[id]/__tests__/index.spec.ts for an example of how to test a confirmation dialog.
      });

      describe('on confirm', () => {
        it('removes the view', async () => {
          // TODO: create the test TDD style.
        });

        it('displays the add button', async () => {
          // TODO: create the test TDD style.
        });
      });

      describe('on deny', () => {
        it('does not remove the view', async () => {
          // TODO: create the test TDD style.
        });

        it('does not display the add button', async () => {
          // TODO: create the test TDD style.
        });
      });
    });
  });

  describe('cancel button', () => {
    beforeEach(async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="add-snack-button"]');
      await button.trigger('click');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      const newMeal: Meal = { id: 'meal-snack-123', type: 'Snack', items: [] };
      await editor.vm.$emit('save', newMeal);
    });

    it('exists', async () => {
      const button = wrapper.findComponent('[data-testid="cancel-button"]');
      expect(button.exists()).toBe(true);
    });

    it('does not save the meal plan', async () => {
      const { addMealPlan, updateMealPlan } = useMealPlansData();
      const button = wrapper.findComponent('[data-testid="cancel-button"]');
      await button.trigger('click');
      expect(addMealPlan).not.toHaveBeenCalled();
      expect(updateMealPlan).not.toHaveBeenCalled();
    });

    it('navigates to the week page', async () => {
      const button = wrapper.findComponent('[data-testid="cancel-button"]');
      await button.trigger('click');
      expect(useRouter().replace).toHaveBeenCalledExactlyOnceWith({
        path: '/planning/week',
        query: { dt: '2026-02-16' },
      });
    });
  });

  describe('save button', () => {
    it('exists', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="save-button"]');
      expect(button.exists()).toBe(true);
    });

    describe('for an existing meal plan', () => {
      beforeEach(async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
      });

      it('starts disabled', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        expect(button.attributes('disabled')).toBeDefined();
      });

      it('is enabled if breakfast is modified', async () => {
        const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
        await breakfastView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        const modifiedBreakfast = buildModifiedMeal(FULL_MEAL_PLAN.meals[0]!);
        await editor.vm.$emit('save', modifiedBreakfast);
        const button = wrapper.findComponent('[data-testid="save-button"]');
        expect(button.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if lunch is modified', async () => {
        const lunchView = wrapper.findComponent('[data-testid="lunch-view"]') as VueWrapper<any>;
        await lunchView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        const modifiedLunch = buildModifiedMeal(FULL_MEAL_PLAN.meals[1]!);
        await editor.vm.$emit('save', modifiedLunch);
        const button = wrapper.findComponent('[data-testid="save-button"]');
        expect(button.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if dinner is modified', async () => {
        const dinnerView = wrapper.findComponent('[data-testid="dinner-view"]') as VueWrapper<any>;
        await dinnerView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        const modifiedDinner = buildModifiedMeal(FULL_MEAL_PLAN.meals[2]!);
        await editor.vm.$emit('save', modifiedDinner);
        const button = wrapper.findComponent('[data-testid="save-button"]');
        expect(button.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if snack is modified', async () => {
        const snackView = wrapper.findComponent('[data-testid="snack-view"]') as VueWrapper<any>;
        await snackView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        const modifiedSnack = buildModifiedMeal(FULL_MEAL_PLAN.meals[3]!);
        await editor.vm.$emit('save', modifiedSnack);
        const button = wrapper.findComponent('[data-testid="save-button"]');
        expect(button.attributes('disabled')).toBeUndefined();
      });

      // TODO: add TDD tests verifying that deleting a meal enables the save button.

      it('saves the meal plan', async () => {
        const breakfastView = wrapper.findComponent('[data-testid="breakfast-view"]') as VueWrapper<any>;
        await breakfastView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        const modifiedBreakfast = buildModifiedMeal(FULL_MEAL_PLAN.meals[0]!);
        await editor.vm.$emit('save', modifiedBreakfast);
        const button = wrapper.findComponent('[data-testid="save-button"]');
        await button.trigger('click');
        const { updateMealPlan, addMealPlan } = useMealPlansData();
        expect(addMealPlan).not.toHaveBeenCalled();
        expect(updateMealPlan).toHaveBeenCalledExactlyOnceWith({
          id: FULL_MEAL_PLAN.id,
          date: '2026-02-18',
          meals: [modifiedBreakfast, FULL_MEAL_PLAN.meals[1], FULL_MEAL_PLAN.meals[2], FULL_MEAL_PLAN.meals[3]],
        });
      });
    });

    describe('for a new meal plan', () => {
      beforeEach(async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(null);
        wrapper = await renderPage();
      });

      it('starts disabled', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        expect(button.attributes('disabled')).toBeDefined();
      });

      it('is enabled if a breakfast is added', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        const addButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        await addButton.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-123', type: 'Breakfast', items: [] });
        expect(button.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if a lunch is added', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        const addButton = wrapper.findComponent('[data-testid="add-lunch-button"]');
        await addButton.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-123', type: 'Lunch', items: [] });
        expect(button.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if a dinner is added', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        const addButton = wrapper.findComponent('[data-testid="add-dinner-button"]');
        await addButton.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-123', type: 'Dinner', items: [] });
        expect(button.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if a snack is added', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        const addButton = wrapper.findComponent('[data-testid="add-snack-button"]');
        await addButton.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-123', type: 'Snack', items: [] });
        expect(button.attributes('disabled')).toBeUndefined();
      });
      //
      // TODO: add TDD tests verifying that deleting a meal enables the save button.

      it('saves the meal plan', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        let addButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        await addButton.trigger('click');
        let editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-123', type: 'Breakfast', items: [] });
        addButton = wrapper.findComponent('[data-testid="add-dinner-button"]');
        await addButton.trigger('click');
        editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-456', type: 'Dinner', items: [] });
        await button.trigger('click');
        const { addMealPlan } = useMealPlansData();
        expect(addMealPlan).toHaveBeenCalledExactlyOnceWith({
          date: '2026-02-18',
          meals: [
            { id: 'meal-123', type: 'Breakfast', items: [] },
            { id: 'meal-456', type: 'Dinner', items: [] },
          ],
        });
      });

      it('navigates to the week page', async () => {
        const button = wrapper.findComponent('[data-testid="save-button"]');
        const addButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        await addButton.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('save', { id: 'meal-123', type: 'Breakfast', items: [] });
        await button.trigger('click');
        expect(useRouter().replace).toHaveBeenCalledExactlyOnceWith({
          path: '/planning/week',
          query: { dt: '2026-02-16' },
        });
      });
    });
  });
});
