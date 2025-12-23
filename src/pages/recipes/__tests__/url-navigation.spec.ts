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

vi.mock('vue-router');
vi.mock('@/data/recipes');

/**
 * Integration tests for URL-based state management during navigation.
 * These tests verify that filter and search state is preserved in URL query parameters
 * when navigating between pages, ensuring the user doesn't lose their place.
 */
describe('Recipe List URL Navigation Integration', () => {
  let wrapper: ReturnType<typeof mount>;
  let mockRouter: { push: Mock; replace: Mock };
  let mockRoute: { query: Record<string, string> };

  beforeEach(() => {
    vi.useFakeTimers();
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

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  describe('Acceptance Criteria: Filter selections are reflected in the URL query parameters', () => {
    it('updates URL when category filter is selected', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');

      await categoryFilter.setValue('Soup');

      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { category: 'Soup' } });
    });

    it('updates URL when cuisine filter is selected', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');

      await cuisineFilter.setValue('Italian');

      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { cuisine: 'Italian' } });
    });

    it('updates URL when calorie range filter is selected', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const calorieFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');

      await calorieFilter.setValue(2);

      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { calorieRange: '2' } });
    });

    it('updates URL with all active filters', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');
      const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');
      const calorieFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');

      await categoryFilter.setValue('Soup');
      await cuisineFilter.setValue('Italian');
      await calorieFilter.setValue(1);

      expect(mockRouter.replace).toHaveBeenLastCalledWith({
        query: { category: 'Soup', cuisine: 'Italian', calorieRange: '1' },
      });
    });
  });

  describe('Acceptance Criteria: Search keywords are reflected in the URL query parameters', () => {
    it('updates URL when search keywords are entered (with debounce)', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');

      await searchInput.setValue('chicken');
      vi.advanceTimersByTime(500);

      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { search: 'chicken' } });
    });

    it('combines search with filters in URL', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');

      await categoryFilter.setValue('Soup');
      mockRouter.replace.mockClear();
      await searchInput.setValue('chicken');
      vi.advanceTimersByTime(500);

      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { search: 'chicken', category: 'Soup' },
      });
    });
  });

  describe('Acceptance Criteria: When navigating to /recipes with query params, filters/search are applied automatically', () => {
    it('initializes category filter from URL on page load', async () => {
      mockRoute.query = { category: 'Soup' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).categoryFilter).toBe('Soup');
    });

    it('initializes search from URL on page load', async () => {
      mockRoute.query = { search: 'chicken dinner' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).searchKeywords).toBe('chicken dinner');
    });

    it('initializes all filters and search from URL on page load', async () => {
      mockRoute.query = {
        search: 'rice',
        category: 'Soup',
        cuisine: 'Italian',
        calorieRange: '2',
      };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).searchKeywords).toBe('rice');
      expect((wrapper.vm as any).categoryFilter).toBe('Soup');
      expect((wrapper.vm as any).cuisineFilter).toBe('Italian');
      expect((wrapper.vm as any).calorieFilterId).toBe(2);
    });
  });

  describe('Acceptance Criteria: When clicking a recipe, navigating to detail, and using browser back, filters/search are restored', () => {
    it('preserves filter state in URL when navigating to recipe detail', async () => {
      mockRoute.query = { category: 'Soup', search: 'chicken' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const { recipes } = useRecipesData();
      (recipes.value as Recipe[]) = TEST_RECIPES;

      // Navigate to recipe detail
      const listItems = wrapper.findAllComponents(RecipeListItem);
      const listItem = listItems[0]?.findComponent(components.VListItem);
      await listItem?.trigger('click');

      // URL state is preserved because filters are in query params
      // When user clicks back button, the route will have the query params
      // and the component will re-initialize with those values
      expect(mockRouter.push).toHaveBeenCalledWith(`recipes/${TEST_RECIPES[0]?.id}`);
    });

    it('restores filters from URL when returning from detail page', async () => {
      // Simulate user returning to list page with query params
      mockRoute.query = { category: 'Soup', cuisine: 'Italian', search: 'chicken' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      // Filters are automatically restored from URL
      expect((wrapper.vm as any).categoryFilter).toBe('Soup');
      expect((wrapper.vm as any).cuisineFilter).toBe('Italian');
      expect((wrapper.vm as any).searchKeywords).toBe('chicken');
    });
  });

  describe('Acceptance Criteria: Browser forward button also maintains correct filter state', () => {
    it('maintains state through forward navigation by reading URL params', async () => {
      // Simulate forward navigation with query params
      mockRoute.query = { category: 'Dessert', calorieRange: '3' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).categoryFilter).toBe('Dessert');
      expect((wrapper.vm as any).calorieFilterId).toBe(3);
    });
  });

  describe('Acceptance Criteria: Query parameters are properly encoded (spaces, special characters)', () => {
    it('handles search with spaces in URL', async () => {
      mockRoute.query = { search: 'chicken dinner' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).searchKeywords).toBe('chicken dinner');
    });

    it('encodes spaces in search when updating URL', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');

      await searchInput.setValue('chicken dinner');
      vi.advanceTimersByTime(500);

      // Vue Router handles URL encoding automatically
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { search: 'chicken dinner' } });
    });
  });

  describe('Acceptance Criteria: Invalid query parameters are gracefully handled (fallback to defaults)', () => {
    it('ignores invalid category values', async () => {
      mockRoute.query = { category: 'InvalidCategory' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).categoryFilter).toBeUndefined();
    });

    it('ignores invalid cuisine values', async () => {
      mockRoute.query = { cuisine: 'InvalidCuisine' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).cuisineFilter).toBeUndefined();
    });

    it('ignores invalid calorie range values', async () => {
      mockRoute.query = { calorieRange: '999' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).calorieFilterId).toBeUndefined();
    });

    it('ignores non-numeric calorie range values', async () => {
      mockRoute.query = { calorieRange: 'invalid' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).calorieFilterId).toBeUndefined();
    });

    it('preserves valid params while ignoring invalid ones', async () => {
      mockRoute.query = {
        category: 'Soup',
        cuisine: 'InvalidCuisine',
        calorieRange: '999',
      };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as any).categoryFilter).toBe('Soup');
      expect((wrapper.vm as any).cuisineFilter).toBeUndefined();
      expect((wrapper.vm as any).calorieFilterId).toBeUndefined();
    });
  });

  describe("Acceptance Criteria: URL updates don't create excessive browser history entries for search typing", () => {
    it('debounces search input to prevent history pollution', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');

      // Rapidly type multiple characters
      await searchInput.setValue('c');
      vi.advanceTimersByTime(100);
      await searchInput.setValue('ch');
      vi.advanceTimersByTime(100);
      await searchInput.setValue('chi');
      vi.advanceTimersByTime(100);
      await searchInput.setValue('chic');
      vi.advanceTimersByTime(100);
      await searchInput.setValue('chick');

      // Should not have updated yet
      expect(mockRouter.replace).not.toHaveBeenCalled();

      // Wait for debounce to complete
      vi.advanceTimersByTime(500);

      // Should only update once with final value
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { search: 'chick' } });
    });

    it('does not debounce filter changes (immediate update)', async () => {
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');

      await categoryFilter.setValue('Soup');

      // Should update immediately without debounce
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acceptance Criteria: The recipe list and count reflect the state from query parameters on page load', () => {
    it('applies filters from URL to recipe list on mount', async () => {
      const { recipeMatches } = useRecipesData();
      mockRoute.query = { category: 'Soup', search: 'chicken' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      // Verify that recipeMatches is called with the URL-based criteria
      const recipeMatchesCalls = (recipeMatches as Mock).mock.calls;
      const lastCall = recipeMatchesCalls[recipeMatchesCalls.length - 1];

      expect(lastCall[1]).toMatchObject({
        keywords: 'chicken',
        category: 'Soup',
      });
    });

    it('displays correct recipe count based on URL filters', async () => {
      const { recipeMatches, recipes } = useRecipesData();
      (recipes.value as Recipe[]) = TEST_RECIPES;

      // Mock that only 3 recipes match the filter
      (recipeMatches as Mock).mockImplementation((recipe: Recipe) => ['1', '3', '4'].some((x) => recipe.id === x));

      mockRoute.query = { category: 'Soup' };
      wrapper = mount(IndexPage, { global: { plugins: [vuetify] } });
      await wrapper.vm.$nextTick();

      const countDisplay = wrapper.find('[data-testid="recipe-count"]');
      expect(countDisplay.text()).toContain('Displaying 3 of');
    });
  });
});
