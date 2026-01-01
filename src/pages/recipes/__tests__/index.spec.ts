import { TEST_RECIPES } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import type { Recipe } from '@/models/recipe';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import RecipeSummaryCard from '@/components/recipes/RecipeSummaryCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

vi.mock('vue-router');
vi.mock('@/data/recipes');

describe('Recipes List Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
    const { recipeMatches, recipes } = useRecipesData();
    (recipes.value as Recipe[]) = TEST_RECIPES;
    (recipeMatches as Mock).mockReturnValue(true);
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('has a title', () => {
    wrapper = mountPage();
    const title = wrapper.find('h1');
    expect(title.text()).toBe('My Recipes');
  });

  it('displays each recipe', () => {
    wrapper = mountPage();
    const items = wrapper.findAllComponents(RecipeSummaryCard);
    expect(items.length).toBe(TEST_RECIPES.length);
  });

  it('displays the matching recipes', () => {
    const { recipeMatches } = useRecipesData();
    (recipeMatches as Mock).mockImplementation((recipe: Recipe) => ['1', '3', '4'].some((x) => recipe.id === x));
    wrapper = mountPage();
    const items = wrapper.findAllComponents(RecipeSummaryCard);
    expect(items.length).toBe(3);
  });

  it('navigates to the given recipe on click', async () => {
    const router = useRouter();
    const { recipes } = useRecipesData();
    (recipes.value as Recipe[]) = TEST_RECIPES;
    wrapper = mountPage();
    const listItems = wrapper.findAllComponents(RecipeSummaryCard);
    const listItem = listItems[0]?.findComponent(components.VCard);
    await listItem?.trigger('click');
    expect(router.push).toHaveBeenCalledExactlyOnceWith(`recipes/${TEST_RECIPES[0]?.id}`);
  });

  describe('add button', () => {
    it('navigates to the recipe add page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      const btn = wrapper.findComponent('[data-testid="add-button"]');
      await btn.trigger('click');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('recipes/add');
    });
  });

  describe('search and filter UI', () => {
    beforeEach(() => {
      wrapper = mountPage();
    });

    describe('search input', () => {
      it('renders', () => {
        const searchInput = wrapper.findComponent('[data-testid="search-input"]');
        expect(searchInput.exists()).toBe(true);
      });

      it('re-runs the filter on new search text', async () => {
        const searchInput = wrapper.findComponent('[data-testid="search-input"]');
        const { recipeMatches } = useRecipesData();
        (recipeMatches as Mock).mockClear();
        await searchInput.setValue('test');
        expect(recipeMatches).toHaveBeenCalledTimes(TEST_RECIPES.length);
        expect(recipeMatches).toHaveBeenCalledWith(expect.any(Object), {
          keywords: 'test',
          category: undefined,
          cuisine: undefined,
          minCalories: undefined,
          maxCalories: undefined,
        });
      });
    });

    describe('category filter', () => {
      it('renders', () => {
        const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');
        expect(categoryFilter.exists()).toBe(true);
      });

      it('re-runs the filter on category change', async () => {
        const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');
        const { recipeMatches } = useRecipesData();
        (recipeMatches as Mock).mockClear();
        await categoryFilter.setValue('Bread');
        expect(recipeMatches).toHaveBeenCalledTimes(TEST_RECIPES.length);
        expect(recipeMatches).toHaveBeenCalledWith(expect.any(Object), {
          keywords: '',
          category: 'Bread',
          cuisine: undefined,
          minCalories: undefined,
          maxCalories: undefined,
        });
      });
    });

    describe('cuisine filter', () => {
      it('renders', () => {
        const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');
        expect(cuisineFilter.exists()).toBe(true);
      });

      it('re-runs the filter on cuisine change', async () => {
        const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');
        const { recipeMatches } = useRecipesData();
        (recipeMatches as Mock).mockClear();
        await cuisineFilter.setValue('Italian');
        expect(recipeMatches).toHaveBeenCalledTimes(TEST_RECIPES.length);
        expect(recipeMatches).toHaveBeenCalledWith(expect.any(Object), {
          keywords: '',
          category: undefined,
          cuisine: 'Italian',
          minCalories: undefined,
          maxCalories: undefined,
        });
      });
    });

    describe('calorie range filter', () => {
      it('renders', () => {
        const calorieRangeFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');
        expect(calorieRangeFilter.exists()).toBe(true);
      });

      it('re-runs the filter on calorie range change', async () => {
        const calorieRangeFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');
        const { recipeMatches } = useRecipesData();
        (recipeMatches as Mock).mockClear();
        await calorieRangeFilter.setValue(2);
        expect(recipeMatches).toHaveBeenCalledTimes(TEST_RECIPES.length);
        expect(recipeMatches).toHaveBeenCalledWith(expect.any(Object), {
          keywords: '',
          category: undefined,
          cuisine: undefined,
          minCalories: 501,
          maxCalories: 750,
        });
      });

      it('resets minCalories and maxCalories to undefined when filter is cleared', async () => {
        const calorieRangeFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');
        const { recipeMatches } = useRecipesData();

        // First set a calorie range
        await calorieRangeFilter.setValue(2);
        (recipeMatches as Mock).mockClear();

        // Then clear the filter
        await calorieRangeFilter.setValue(null);
        expect(recipeMatches).toHaveBeenCalledTimes(TEST_RECIPES.length);
        expect(recipeMatches).toHaveBeenCalledWith(expect.any(Object), {
          keywords: '',
          category: undefined,
          cuisine: undefined,
          minCalories: undefined,
          maxCalories: undefined,
        });
      });
    });

    describe('recipe count', () => {
      it('displays the recipe count', () => {
        const countDisplay = wrapper.find('[data-testid="recipe-count"]');
        expect(countDisplay.exists()).toBe(true);
        expect(countDisplay.text()).toEqual(`Displaying ${TEST_RECIPES.length} of ${TEST_RECIPES.length} recipes`);
      });

      it('displays filtered count', async () => {
        const { recipeMatches } = useRecipesData();
        (recipeMatches as Mock).mockImplementation((recipe: Recipe) => ['1', '3', '4'].some((x) => recipe.id === x));
        const countDisplay = wrapper.find('[data-testid="recipe-count"]');
        const searchInput = wrapper.findComponent('[data-testid="search-input"]');
        await searchInput.setValue('test');
        expect(countDisplay.text()).toEqual(`Displaying 3 of ${TEST_RECIPES.length} recipes`);
      });
    });
  });

  describe('empty state', () => {
    it('displays "No recipes found" message when there are no recipes and not loading', () => {
      const { recipes, loading } = useRecipesData();
      (recipes.value as Recipe[]) = [];
      (loading.value as boolean) = false;
      wrapper = mountPage();
      const emptyStateMessage = wrapper.find('h2');
      expect(emptyStateMessage.exists()).toBe(true);
      expect(emptyStateMessage.text()).toBe('No recipes found.');
    });

    it('displays "No recipes match your search criteria" when recipes are loaded but no matches are found', () => {
      const { recipeMatches, recipes, loading } = useRecipesData();
      (recipes.value as Recipe[]) = TEST_RECIPES;
      (loading.value as boolean) = false;
      (recipeMatches as Mock).mockImplementation(() => false);
      wrapper = mountPage();
      const emptyStateMessage = wrapper.find('h2');
      expect(emptyStateMessage.exists()).toBe(true);
      expect(emptyStateMessage.text()).toBe('No recipes match your search criteria.');
    });

    it('does not display a message when loading', () => {
      const { recipes, loading } = useRecipesData();
      (recipes.value as Recipe[]) = [];
      (loading.value as boolean) = true;
      wrapper = mountPage();
      const emptyStateMessage = wrapper.find('h2');
      expect(emptyStateMessage.exists()).toBe(false);
    });

    it('does not display a message when there are matching recipes', () => {
      const { recipes, loading } = useRecipesData();
      (recipes.value as Recipe[]) = TEST_RECIPES;
      (loading.value as boolean) = false;
      wrapper = mountPage();
      const emptyStateMessage = wrapper.find('h2');
      expect(emptyStateMessage.exists()).toBe(false);
    });
  });
});
