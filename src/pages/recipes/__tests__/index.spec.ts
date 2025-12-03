import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import { useRouter } from 'vue-router';
import RecipeListItem from '@/components/RecipeListItem.vue';
import { useRecipesData } from '@/data/recipes';
import { TEST_RECIPES } from '@/data/__tests__/test-data';

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
    recipes.value = TEST_RECIPES;
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
    recipes.value = TEST_RECIPES;
    wrapper = mountPage();
    const listItems = wrapper.findAllComponents(RecipeListItem);
    const listItem = listItems[0]?.findComponent({ name: 'VListItem' });
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
});
