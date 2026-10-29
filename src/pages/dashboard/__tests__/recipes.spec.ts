import ViewPageActionButtons from '@/components/core/ViewPageActionButtons.vue';
import RecipeView from '@/components/recipes/RecipeView.vue';
import { TEST_HOMEMADE_RECIPE, TEST_PREPARED_RECIPE } from '@/data/__tests__/test-data';
import { useMealPlansData } from '@/data/meal-plans';
import { useRecipesData } from '@/data/recipes';
import type { Meal, MealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import type { Recipe } from '@/models/recipe';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipesPage from '../recipes.vue';

vi.mock('vue-router');
vi.mock('@/data/meal-plans');
vi.mock('@/data/recipes');
vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});

const homemadeRecipe: Recipe = { ...TEST_HOMEMADE_RECIPE, id: 'homemade-scallops' };
const preparedRecipe: Recipe = { ...TEST_PREPARED_RECIPE, id: 'prepared-cod' };

const zeroNutrition = {
  calories: 0,
  sodium: 0,
  fat: 0,
  protein: 0,
  carbs: 0,
  sugar: 0,
};

const mealItem = (overrides: Partial<MealItem> & Pick<MealItem, 'id' | 'name' | 'recipeId'>): MealItem => ({
  servings: 1,
  nutrition: zeroNutrition,
  ...overrides,
});

const mealPlanFor = (meals: Meal[]): MealPlan => ({
  id: 'plan-today',
  date: '2025-12-25',
  meals,
});

const mountPage = () => mount(RecipesPage, { global: { plugins: [vuetify] } });

const planRequest = () => useMealPlansData().getMealPlanForDate as Mock;
const recipeRequest = () => useRecipesData().getRecipe as Mock;

const routeState = reactive<{ query: Record<string, unknown> }>({
  query: { mealType: 'breakfast' },
});

const setMealType = (mealType?: string | string[]) => {
  routeState.query = mealType === undefined ? {} : { mealType };
};

describe('meal recipes page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  const renderPage = async () => {
    wrapper = mountPage();
    await flushPromises();
    return wrapper;
  };

  const itemRows = () => wrapper.findAll('div').filter((node) => node.element.parentElement === wrapper.element);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 11, 25));
    setMealType('breakfast');
    (useRoute as Mock).mockReturnValue(routeState);
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
    planRequest().mockReset();
    planRequest().mockResolvedValue(null);
    recipeRequest().mockReset();
    recipeRequest().mockResolvedValue(null);
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  describe('meal headings', () => {
    it.each([
      ['breakfast', 'Breakfast'],
      ['lunch', 'Lunch'],
      ['dinner', 'Dinner'],
      ['snack', 'Snacks'],
    ] as const)('renders %s as the only h1', async (mealType, heading) => {
      setMealType(mealType);
      wrapper = await renderPage();
      const headings = wrapper.findAll('h1');
      expect(headings).toHaveLength(1);
      expect(headings[0]?.text()).toBe(heading);
    });
  });

  describe('unrecognized meal type', () => {
    it.each([
      ['a missing mealType', {}],
      ['an empty mealType', { mealType: '' }],
      ['a different case', { mealType: 'Breakfast' }],
      ['an undefined mealType (brunch)', { mealType: 'brunch' }],
      ['an array', { mealType: ['breakfast'] }],
    ] as const)('rejects %s', async (_label, query) => {
      routeState.query = { ...query };
      wrapper = await renderPage();
      expect(wrapper.text()).toContain('This meal type is not recognized.');
      expect(wrapper.find('h1').exists()).toBe(false);
      expect(planRequest()).not.toHaveBeenCalled();
      expect(recipeRequest()).not.toHaveBeenCalled();
    });
  });

  describe("today's meal", () => {
    const breakfastItems = [
      mealItem({ id: 'b1', name: homemadeRecipe.name, recipeId: homemadeRecipe.id!, servings: 4 }),
      mealItem({ id: 'b2', name: preparedRecipe.name, recipeId: preparedRecipe.id!, servings: 3 }),
    ];

    const planWithAnotherMeal = () =>
      mealPlanFor([
        { id: 'breakfast', type: 'Breakfast', items: breakfastItems },
        {
          id: 'lunch',
          type: 'Lunch',
          items: [mealItem({ id: 'l1', name: 'Other Lunch', recipeId: 'lunch-only', servings: 2 })],
        },
      ]);

    it('loads the plan for today and only the recipes on that meal', async () => {
      planRequest().mockResolvedValue(planWithAnotherMeal());
      recipeRequest().mockImplementation(async (id: string) => {
        if (id === homemadeRecipe.id) return homemadeRecipe;
        if (id === preparedRecipe.id) return preparedRecipe;
        return null;
      });
      wrapper = await renderPage();

      expect(planRequest()).toHaveBeenCalledExactlyOnceWith('2025-12-25');
      expect(recipeRequest()).toHaveBeenCalledTimes(2);
      expect(recipeRequest()).toHaveBeenNthCalledWith(1, homemadeRecipe.id);
      expect(recipeRequest()).toHaveBeenNthCalledWith(2, preparedRecipe.id);
    });

    it('hides the empty copy while the plan request is pending', async () => {
      planRequest().mockReturnValue(new Promise(() => undefined));
      wrapper = mountPage();
      await flushPromises();
      expect(wrapper.find('h1').text()).toBe('Breakfast');
      expect(wrapper.text()).not.toContain('No recipes planned for this meal today.');
      expect(wrapper.findComponent(RecipeView).exists()).toBe(false);
    });

    it('discards a stale lookup when mealType changes and renders the newer meal', async () => {
      const breakfastItem = mealItem({
        id: 'breakfast-item',
        name: homemadeRecipe.name,
        recipeId: homemadeRecipe.id!,
        servings: 4,
      });
      const lunchItem = mealItem({
        id: 'lunch-item',
        name: preparedRecipe.name,
        recipeId: preparedRecipe.id!,
        servings: 3,
      });
      let resolveBreakfastPlan!: (plan: MealPlan) => void;
      let resolveLunchPlan!: (plan: MealPlan) => void;
      planRequest()
        .mockReturnValueOnce(
          new Promise<MealPlan>((resolve) => {
            resolveBreakfastPlan = resolve;
          }),
        )
        .mockReturnValueOnce(
          new Promise<MealPlan>((resolve) => {
            resolveLunchPlan = resolve;
          }),
        );
      recipeRequest().mockImplementation(async (id: string) => {
        if (id === homemadeRecipe.id) return homemadeRecipe;
        if (id === preparedRecipe.id) return preparedRecipe;
        return null;
      });

      wrapper = mountPage();
      await flushPromises();
      expect(wrapper.find('h1').text()).toBe('Breakfast');
      expect(wrapper.findComponent(RecipeView).exists()).toBe(false);

      setMealType('lunch');
      await flushPromises();
      expect(wrapper.find('h1').text()).toBe('Lunch');
      expect(wrapper.findComponent(RecipeView).exists()).toBe(false);
      expect(planRequest()).toHaveBeenCalledTimes(2);

      resolveLunchPlan(mealPlanFor([{ id: 'lunch', type: 'Lunch', items: [lunchItem] }]));
      await flushPromises();
      expect(wrapper.find('h1').text()).toBe('Lunch');
      expect(wrapper.findComponent(RecipeView).props('recipe')).toEqual(preparedRecipe);
      expect(wrapper.text()).toContain('Planned servings: 3');
      expect(wrapper.text()).not.toContain(homemadeRecipe.name);
      expect(recipeRequest()).toHaveBeenCalledExactlyOnceWith(preparedRecipe.id);

      resolveBreakfastPlan(mealPlanFor([{ id: 'breakfast', type: 'Breakfast', items: [breakfastItem] }]));
      await flushPromises();
      expect(wrapper.find('h1').text()).toBe('Lunch');
      expect(wrapper.findComponent(RecipeView).props('recipe')).toEqual(preparedRecipe);
      expect(wrapper.text()).toContain('Planned servings: 3');
      expect(wrapper.text()).not.toContain(homemadeRecipe.name);
      expect(recipeRequest()).toHaveBeenCalledExactlyOnceWith(preparedRecipe.id);
    });
  });

  describe('empty meal', () => {
    const expectEmptyBreakfast = () => {
      expect(wrapper.findAll('h1')).toHaveLength(1);
      expect(wrapper.find('h1').text()).toBe('Breakfast');
      expect(wrapper.text()).toContain('No recipes planned for this meal today.');
      expect(wrapper.findComponent(RecipeView).exists()).toBe(false);
    };

    it('shows the empty copy when there is no plan', async () => {
      planRequest().mockResolvedValue(null);
      wrapper = await renderPage();
      expectEmptyBreakfast();
    });

    it('shows the empty copy when the plan has no meal of that type', async () => {
      planRequest().mockResolvedValue(
        mealPlanFor([
          {
            id: 'lunch',
            type: 'Lunch',
            items: [mealItem({ id: 'l1', name: 'Soup', recipeId: 'soup', servings: 1 })],
          },
        ]),
      );
      wrapper = await renderPage();
      expectEmptyBreakfast();
    });

    it('shows the empty copy when the meal has no items', async () => {
      planRequest().mockResolvedValue(mealPlanFor([{ id: 'breakfast', type: 'Breakfast', items: [] }]));
      wrapper = await renderPage();
      expectEmptyBreakfast();
    });

    it('shows the empty copy when the plan request fails', async () => {
      planRequest().mockRejectedValue(new Error('failed to load the plan'));
      wrapper = await renderPage();
      expectEmptyBreakfast();
    });
  });

  describe('planned recipes', () => {
    it('renders a homemade recipe with the meal item servings', async () => {
      const item = mealItem({
        id: 'homemade-item',
        name: homemadeRecipe.name,
        recipeId: homemadeRecipe.id!,
        servings: 4,
      });
      expect(item.servings).not.toBe(homemadeRecipe.servings);
      planRequest().mockResolvedValue(mealPlanFor([{ id: 'breakfast', type: 'Breakfast', items: [item] }]));
      recipeRequest().mockResolvedValue(homemadeRecipe);
      wrapper = await renderPage();

      const view = wrapper.findComponent(RecipeView);
      expect(view.props('recipe')).toEqual(homemadeRecipe);
      expect(view.props('headingLevel')).toBe(2);
      expect(wrapper.findAll('h1')).toHaveLength(1);
      expect(wrapper.find('h1').text()).toBe('Breakfast');
      const nameHeadings = wrapper.findAll('h2');
      expect(nameHeadings).toHaveLength(1);
      expect(nameHeadings[0]?.text()).toBe(homemadeRecipe.name);
      expect(wrapper.text()).toContain('Planned servings: 4');
    });

    it('renders a prepared recipe with the meal item servings', async () => {
      const item = mealItem({
        id: 'prepared-item',
        name: preparedRecipe.name,
        recipeId: preparedRecipe.id!,
        servings: 3,
      });
      expect(item.servings).not.toBe(preparedRecipe.servings);
      setMealType('lunch');
      planRequest().mockResolvedValue(mealPlanFor([{ id: 'lunch', type: 'Lunch', items: [item] }]));
      recipeRequest().mockResolvedValue(preparedRecipe);
      wrapper = await renderPage();

      const view = wrapper.findComponent(RecipeView);
      expect(view.props('recipe')).toEqual(preparedRecipe);
      expect(view.props('headingLevel')).toBe(2);
      expect(wrapper.findAll('h1')).toHaveLength(1);
      expect(wrapper.find('h1').text()).toBe('Lunch');
      const nameHeadings = wrapper.findAll('h2');
      expect(nameHeadings).toHaveLength(1);
      expect(nameHeadings[0]?.text()).toBe(preparedRecipe.name);
      expect(wrapper.text()).toContain('Planned servings: 3');
    });
  });

  describe('missing recipes', () => {
    const missingName = 'Vanished Stew';

    const expectResolvedRow = (row: ReturnType<typeof itemRows>[number], recipe: Recipe, servings: number) => {
      const view = row.findComponent(RecipeView);
      expect(view.props('recipe')).toEqual(recipe);
      expect(view.props('headingLevel')).toBe(2);
      expect(row.text()).toContain(`Planned servings: ${servings}`);
      expect(row.find('h2').text()).toBe(recipe.name);
    };

    const expectUnavailableRow = (row: ReturnType<typeof itemRows>[number]) => {
      expect(row.text()).toContain(missingName);
      expect(row.text()).toContain('Recipe unavailable.');
      expect(row.findComponent(RecipeView).exists()).toBe(false);
      expect(row.text()).not.toContain('Planned servings:');
    };

    it('keeps a resolved recipe and a null recipe in meal item order', async () => {
      const resolvedItem = mealItem({
        id: 'resolved',
        name: homemadeRecipe.name,
        recipeId: homemadeRecipe.id!,
        servings: 4,
      });
      const missingItem = mealItem({ id: 'missing', name: missingName, recipeId: 'missing-recipe', servings: 9 });
      planRequest().mockResolvedValue(
        mealPlanFor([{ id: 'breakfast', type: 'Breakfast', items: [resolvedItem, missingItem] }]),
      );
      recipeRequest().mockImplementation(async (id: string) => (id === homemadeRecipe.id ? homemadeRecipe : null));
      wrapper = await renderPage();

      const rows = itemRows();
      expect(rows).toHaveLength(2);
      expectResolvedRow(rows[0]!, homemadeRecipe, 4);
      expectUnavailableRow(rows[1]!);
    });

    it('keeps a rejected recipe and a resolved recipe in meal item order', async () => {
      const missingItem = mealItem({ id: 'missing', name: missingName, recipeId: 'missing-recipe', servings: 9 });
      const resolvedItem = mealItem({
        id: 'resolved',
        name: preparedRecipe.name,
        recipeId: preparedRecipe.id!,
        servings: 3,
      });
      planRequest().mockResolvedValue(
        mealPlanFor([{ id: 'breakfast', type: 'Breakfast', items: [missingItem, resolvedItem] }]),
      );
      recipeRequest().mockImplementation(async (id: string) => {
        if (id === 'missing-recipe') throw new Error('failed to load the recipe');
        if (id === preparedRecipe.id) return preparedRecipe;
        return null;
      });
      wrapper = await renderPage();

      const rows = itemRows();
      expect(rows).toHaveLength(2);
      expectUnavailableRow(rows[0]!);
      expectResolvedRow(rows[1]!, preparedRecipe, 3);
    });
  });

  describe('close', () => {
    const expectCloseReturnsToDashboard = async () => {
      expect(wrapper.findComponent(ViewPageActionButtons).exists()).toBe(false);
      await wrapper.find('[data-testid="close-button"]').trigger('click');
      expect(useRouter().push).toHaveBeenCalledExactlyOnceWith('/dashboard');
    };

    it('returns to the dashboard from a populated meal', async () => {
      const item = mealItem({
        id: 'homemade-item',
        name: homemadeRecipe.name,
        recipeId: homemadeRecipe.id!,
        servings: 4,
      });
      planRequest().mockResolvedValue(mealPlanFor([{ id: 'breakfast', type: 'Breakfast', items: [item] }]));
      recipeRequest().mockResolvedValue(homemadeRecipe);
      wrapper = await renderPage();
      await expectCloseReturnsToDashboard();
    });

    it('returns to the dashboard from an empty meal', async () => {
      wrapper = await renderPage();
      await expectCloseReturnsToDashboard();
    });

    it('returns to the dashboard when the meal type is unrecognized', async () => {
      setMealType('brunch');
      wrapper = await renderPage();
      await expectCloseReturnsToDashboard();
    });
  });
});
