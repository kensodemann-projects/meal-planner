import RecipeListItem from '@/components/RecipeListItem.vue';
import { TEST_RECIPES } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import type { Recipe } from '@/models/recipe';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

vi.mock('vue-router');
vi.mock('@/data/recipes');

describe('Recipes List Page', () => {
  let wrapper: ReturnType<typeof mountPage>;
  let mockRouter: { push: Mock; replace: Mock };
  let mockRoute: { query: Record<string, string> };

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
    };
    mockRoute = {
      query: {},
    };
    (useRouter as Mock).mockReturnValue(mockRouter);
    (useRoute as Mock).mockReturnValue(mockRoute);
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
    const items = wrapper.findAllComponents(RecipeListItem);
    expect(items.length).toBe(TEST_RECIPES.length);
  });

  it('displays the matching recipes', () => {
    const { recipeMatches } = useRecipesData();
    (recipeMatches as Mock).mockImplementation((recipe: Recipe) => ['1', '3', '4'].some((x) => recipe.id === x));
    wrapper = mountPage();
    const items = wrapper.findAllComponents(RecipeListItem);
    expect(items.length).toBe(3);
  });

  it('navigates to the given recipe on click', async () => {
    const { recipes } = useRecipesData();
    (recipes.value as Recipe[]) = TEST_RECIPES;
    wrapper = mountPage();
    const listItems = wrapper.findAllComponents(RecipeListItem);
    const listItem = listItems[0]?.findComponent(components.VListItem);
    await listItem?.trigger('click');
    expect(mockRouter.push).toHaveBeenCalledExactlyOnceWith(`recipes/${TEST_RECIPES[0]?.id}`);
  });

  describe('add button', () => {
    it('navigates to the recipe add page', async () => {
      wrapper = mountPage();
      const btn = wrapper.findComponent('[data-testid="add-button"]');
      await btn.trigger('click');
      expect(mockRouter.push).toHaveBeenCalledExactlyOnceWith('recipes/add');
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

  describe('URL query parameters', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('initializes search from URL query parameter', async () => {
      mockRoute.query = { search: 'chicken' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).searchKeywords).toBe('chicken');
    });

    it('initializes category filter from URL query parameter', async () => {
      mockRoute.query = { category: 'Soup' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).categoryFilter).toBe('Soup');
    });

    it('initializes cuisine filter from URL query parameter', async () => {
      mockRoute.query = { cuisine: 'Italian' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).cuisineFilter).toBe('Italian');
    });

    it('initializes calorie range filter from URL query parameter', async () => {
      mockRoute.query = { calorieRange: '2' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).calorieFilterId).toBe(2);
    });

    it('initializes multiple filters from URL query parameters', async () => {
      mockRoute.query = {
        search: 'rice',
        category: 'Soup',
        cuisine: 'Italian',
        calorieRange: '1',
      };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).searchKeywords).toBe('rice');
      expect((wrapper.vm as any).categoryFilter).toBe('Soup');
      expect((wrapper.vm as any).cuisineFilter).toBe('Italian');
      expect((wrapper.vm as any).calorieFilterId).toBe(1);
    });

    it('updates URL when search input changes (debounced)', async () => {
      wrapper = mountPage();
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');
      await searchInput.setValue('chicken');

      // Should not update immediately
      expect(mockRouter.replace).not.toHaveBeenCalled();

      // Should update after debounce delay
      vi.advanceTimersByTime(500);
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { search: 'chicken' } });
    });

    it('updates URL when category filter changes', async () => {
      wrapper = mountPage();
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');
      await categoryFilter.setValue('Bread');
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { category: 'Bread' } });
    });

    it('updates URL when cuisine filter changes', async () => {
      wrapper = mountPage();
      const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');
      await cuisineFilter.setValue('Mexican');
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { cuisine: 'Mexican' } });
    });

    it('updates URL when calorie range filter changes', async () => {
      wrapper = mountPage();
      const calorieFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');
      await calorieFilter.setValue(3);
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { calorieRange: '3' } });
    });

    it('updates URL with multiple filters', async () => {
      wrapper = mountPage();
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');
      const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');

      await categoryFilter.setValue('Soup');
      await cuisineFilter.setValue('Italian');
      mockRouter.replace.mockClear();

      await searchInput.setValue('rice');
      vi.advanceTimersByTime(500);

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { search: 'rice', category: 'Soup', cuisine: 'Italian' },
      });
    });

    it('removes filter from URL when cleared', async () => {
      mockRoute.query = { category: 'Soup', cuisine: 'Italian' };
      wrapper = mountPage();
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');

      await categoryFilter.setValue(null);
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { cuisine: 'Italian' } });
    });

    it('handles invalid category gracefully', async () => {
      mockRoute.query = { category: 'InvalidCategory' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).categoryFilter).toBeUndefined();
    });

    it('handles invalid cuisine gracefully', async () => {
      mockRoute.query = { cuisine: 'InvalidCuisine' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).cuisineFilter).toBeUndefined();
    });

    it('handles invalid calorie range gracefully', async () => {
      mockRoute.query = { calorieRange: '999' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).calorieFilterId).toBeUndefined();
    });

    it('handles non-numeric calorie range gracefully', async () => {
      mockRoute.query = { calorieRange: 'invalid' };
      wrapper = mountPage();
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as any).calorieFilterId).toBeUndefined();
    });

    it('debounces search input to avoid excessive URL updates', async () => {
      wrapper = mountPage();
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');

      await searchInput.setValue('c');
      vi.advanceTimersByTime(200);
      await searchInput.setValue('ch');
      vi.advanceTimersByTime(200);
      await searchInput.setValue('chi');
      vi.advanceTimersByTime(200);

      // Should not have updated yet
      expect(mockRouter.replace).not.toHaveBeenCalled();

      // Complete the debounce
      vi.advanceTimersByTime(500);

      // Should only update once with final value
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { search: 'chi' } });
    });
  });
});
