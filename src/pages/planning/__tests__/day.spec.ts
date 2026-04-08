import ConfirmDialog from '@/components/core/ConfirmDialog.vue';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import { useMealPlansData } from '@/data/meal-plans';
import type { Meal, MealItem, MealType } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import day from '../day.vue';

vi.mock('vue-router');
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
  recipeId: 'recipe-1',
  servings: 2,
  nutrition: { calories: 100, sodium: 50, fat: 1, protein: 5, carbs: 20, sugar: 1 },
};

type MealTypeConfig = {
  label: string;
  type: MealType;
  addButtonTestId: string;
  viewTestId: string;
  mealIndex: number;
};

const MEAL_TYPE_CONFIGS: MealTypeConfig[] = [
  {
    label: 'breakfast',
    type: 'Breakfast',
    addButtonTestId: 'add-breakfast-button',
    viewTestId: 'breakfast-view',
    mealIndex: 0,
  },
  { label: 'lunch', type: 'Lunch', addButtonTestId: 'add-lunch-button', viewTestId: 'lunch-view', mealIndex: 1 },
  { label: 'dinner', type: 'Dinner', addButtonTestId: 'add-dinner-button', viewTestId: 'dinner-view', mealIndex: 2 },
  { label: 'snack', type: 'Snack', addButtonTestId: 'add-snack-button', viewTestId: 'snack-view', mealIndex: 3 },
];

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

  describe.each(MEAL_TYPE_CONFIGS)('add $label button', ({ label, type, addButtonTestId, viewTestId }) => {
    describe('on a day without a meal plan', () => {
      it('exists', async () => {
        wrapper = await renderPage();
        expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it(`it exists if the meal plan does not have a ${label} defined`, async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
        wrapper = await renderPage();
        expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(true);
      });

      it(`does not exist if the meal plan has a ${label}`, async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(false);
      });
    });

    describe('click', () => {
      it('hides the button', async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
        expect(button.exists()).toBe(true);
        await button.trigger('click');
        expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(false);
      });

      it(`displays the editor for ${label}`, async () => {
        wrapper = await renderPage();
        const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
        await button.trigger('click');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        expect(editor.exists()).toBe(true);
        expect(editor.props('meal').type).toBe(type);
      });

      describe('on cancel', () => {
        it('hides the editor', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          await editor.vm.$emit('close');
          expect(wrapper.findComponent({ name: 'MealEditor' }).exists()).toBe(false);
        });

        it(`shows the add ${label} button again`, async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          await editor.vm.$emit('close');
          expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(true);
        });
      });

      describe('on meal changed', () => {
        it('keeps the editor open', async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-new-123', type, items: [MODIFIED_MEAL_ITEM] };
          await editor.vm.$emit('meal-changed', newMeal);
          expect(wrapper.findComponent({ name: 'MealEditor' }).exists()).toBe(true);
        });

        it(`does not show the add ${label} button again`, async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-new-123', type, items: [MODIFIED_MEAL_ITEM] };
          await editor.vm.$emit('meal-changed', newMeal);
          await wrapper.vm.$nextTick();
          expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(false);
        });

        it(`assigns the meal to the ${label} view after the editor is closed`, async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          expect(editor.exists()).toBe(true);
          const newMeal: Meal = { id: 'meal-new-123', type, items: [MODIFIED_MEAL_ITEM] };
          await editor.vm.$emit('meal-changed', newMeal);
          await editor.vm.$emit('close');
          const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
          expect(mealView.exists()).toBe(true);
          expect(mealView.props('meal')).toEqual(newMeal);
        });

        it(`displays the ${label} in the editor when the ${label} view emits the modify event`, async () => {
          wrapper = await renderPage();
          const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
          await button.trigger('click');
          const editor = wrapper.findComponent({ name: 'MealEditor' });
          const newMeal: Meal = { id: 'meal-new-123', type, items: [MODIFIED_MEAL_ITEM] };
          await editor.vm.$emit('meal-changed', newMeal);
          await editor.vm.$emit('close');
          const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
          await mealView.vm.$emit('modify');
          const modifyEditor = wrapper.findComponent({ name: 'MealEditor' });
          expect(modifyEditor.exists()).toBe(true);
          expect(modifyEditor.props('meal')).toEqual(newMeal);
          expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(false);
        });
      });
    });
  });

  describe.each(MEAL_TYPE_CONFIGS)('$label view', ({ addButtonTestId, viewTestId, mealIndex }) => {
    it('is displayed when data exists and is not being edited', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(true);
    });

    it('is not displayed when there is no data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(EMPTY_MEAL_PLAN);
      wrapper = await renderPage();
      expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(false);
    });

    it('is not displayed when the editor is showing', async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent(`[data-testid="${addButtonTestId}"]`);
      await button.trigger('click');
      expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(false);
    });

    it('displays the correct meal data', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const view = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
      expect(view.props('meal')).toEqual(FULL_MEAL_PLAN.meals[mealIndex]);
    });

    it('displays the meal in the editor when the view emits the modify event', async () => {
      const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
      getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
      wrapper = await renderPage();
      const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
      await mealView.vm.$emit('modify');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      expect(editor.props('meal')).toEqual(FULL_MEAL_PLAN.meals[mealIndex]);
      expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(false);
    });

    describe('when the meal editor is cancelled after modify', () => {
      it('hides the editor', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
        await mealView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('close');
        expect(wrapper.findComponent({ name: 'MealEditor' }).exists()).toBe(false);
      });

      it('shows the view again', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
        await mealView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('close');
        expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(true);
      });

      it('does not show the add button', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
        await mealView.vm.$emit('modify');
        const editor = wrapper.findComponent({ name: 'MealEditor' });
        await editor.vm.$emit('close');
        expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(false);
      });
    });

    describe('the delete event', () => {
      it('displays the confirmation dialog', async () => {
        const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
        getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
        wrapper = await renderPage();
        const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
        await mealView.vm.$emit('delete');
        await flushPromises();
        expect(wrapper.findComponent(ConfirmDialog).exists()).toBe(true);
      });

      describe('on confirm', () => {
        it('removes the view', async () => {
          const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
          getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
          wrapper = await renderPage();
          const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
          await mealView.vm.$emit('delete');
          await flushPromises();
          wrapper.findComponent(ConfirmDialog).vm.$emit('confirm');
          await flushPromises();
          expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(false);
        });

        it('displays the add button', async () => {
          const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
          getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
          wrapper = await renderPage();
          const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
          await mealView.vm.$emit('delete');
          await flushPromises();
          wrapper.findComponent(ConfirmDialog).vm.$emit('confirm');
          await flushPromises();
          expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(true);
        });
      });

      describe('on deny', () => {
        it('does not remove the view', async () => {
          const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
          getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
          wrapper = await renderPage();
          const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
          await mealView.vm.$emit('delete');
          await flushPromises();
          wrapper.findComponent(ConfirmDialog).vm.$emit('cancel');
          await flushPromises();
          expect(wrapper.findComponent(`[data-testid="${viewTestId}"]`).exists()).toBe(true);
        });

        it('does not display the add button', async () => {
          const getMealPlanForDate = useMealPlansData().getMealPlanForDate as Mock;
          getMealPlanForDate.mockResolvedValueOnce(FULL_MEAL_PLAN);
          wrapper = await renderPage();
          const mealView = wrapper.findComponent(`[data-testid="${viewTestId}"]`) as VueWrapper<any>;
          await mealView.vm.$emit('delete');
          await flushPromises();
          wrapper.findComponent(ConfirmDialog).vm.$emit('cancel');
          await flushPromises();
          expect(wrapper.findComponent(`[data-testid="${addButtonTestId}"]`).exists()).toBe(false);
        });
      });
    });
  });

  describe('close button', () => {
    beforeEach(async () => {
      wrapper = await renderPage();
      const button = wrapper.findComponent('[data-testid="add-snack-button"]');
      await button.trigger('click');
      const editor = wrapper.findComponent({ name: 'MealEditor' });
      expect(editor.exists()).toBe(true);
      const newMeal: Meal = { id: 'meal-snack-123', type: 'Snack', items: [MODIFIED_MEAL_ITEM] };
      await editor.vm.$emit('meal-changed', newMeal);
      vi.clearAllMocks();
    });

    it('exists', async () => {
      const button = wrapper.find('[data-testid="day-footer"] [data-testid="close-button"]');
      expect(button.exists()).toBe(true);
    });

    it('does not save the meal plan', async () => {
      const { addMealPlan, updateMealPlan } = useMealPlansData();
      expect(addMealPlan).not.toHaveBeenCalled();
      const button = wrapper.find('[data-testid="day-footer"] [data-testid="close-button"]');
      await button.trigger('click');
      expect(addMealPlan).not.toHaveBeenCalled();
      expect(updateMealPlan).not.toHaveBeenCalled();
    });

    it('navigates to the week page', async () => {
      const button = wrapper.find('[data-testid="day-footer"] [data-testid="close-button"]');
      await button.trigger('click');
      expect(useRouter().replace).toHaveBeenCalledExactlyOnceWith({
        path: '/planning/week',
        query: { dt: '2026-02-16' },
      });
    });
  });
});
