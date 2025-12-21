import RecipeListItem from '@/components/RecipeListItem.vue';
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
    const { recipes } = useRecipesData();
    (recipes.value as Recipe[]) = TEST_RECIPES;
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

  it('navigates to the given recipe on click', async () => {
    const router = useRouter();
    const { recipes } = useRecipesData();
    (recipes.value as Recipe[]) = TEST_RECIPES;
    wrapper = mountPage();
    const listItems = wrapper.findAllComponents(RecipeListItem);
    const listItem = listItems[0]?.findComponent(components.VListItem);
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

    it('renders the search input field', () => {
      const searchInput = wrapper.findComponent('[data-testid="search-input"]');
      expect(searchInput.exists()).toBe(true);
    });

    it('renders the category filter dropdown', () => {
      const categoryFilter = wrapper.findComponent('[data-testid="filter-category"]');
      expect(categoryFilter.exists()).toBe(true);
    });

    it('renders the cuisine filter dropdown', () => {
      const cuisineFilter = wrapper.findComponent('[data-testid="filter-cuisine"]');
      expect(cuisineFilter.exists()).toBe(true);
    });

    it('renders the calorie range filter dropdown', () => {
      const calorieRangeFilter = wrapper.findComponent('[data-testid="filter-calorie-range"]');
      expect(calorieRangeFilter.exists()).toBe(true);
    });

    it('displays the recipe count', () => {
      const countDisplay = wrapper.find('.text-right.text-medium-emphasis.font-weight-light');
      expect(countDisplay.exists()).toBe(true);
      expect(countDisplay.text()).toContain(`Displaying ${TEST_RECIPES.length} of ${TEST_RECIPES.length} recipe`);
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

    it('does not display "No recipes found" message when loading', () => {
      const { recipes, loading } = useRecipesData();
      (recipes.value as Recipe[]) = [];
      (loading.value as boolean) = true;
      wrapper = mountPage();
      const emptyStateMessage = wrapper.find('h2');
      expect(emptyStateMessage.exists()).toBe(false);
    });

    it('does not display "No recipes found" message when there are recipes', () => {
      const { recipes, loading } = useRecipesData();
      (recipes.value as Recipe[]) = TEST_RECIPES;
      (loading.value as boolean) = false;
      wrapper = mountPage();
      const emptyStateMessage = wrapper.find('h2');
      expect(emptyStateMessage.exists()).toBe(false);
    });
  });
});
