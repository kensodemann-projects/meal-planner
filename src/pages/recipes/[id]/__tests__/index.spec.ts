import { TEST_RECIPE } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

vi.mock('vue-router');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(IndexPage, { props, global: { plugins: [vuetify] } });

describe('Recipe Details Page', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    const { getRecipe } = useRecipesData();
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
    (getRecipe as Mock).mockResolvedValue({ ...TEST_RECIPE, id: '88f933fiieo' });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('gets the recipe', () => {
    const { getRecipe } = useRecipesData();
    wrapper = mountComponent();
    expect(getRecipe).toHaveBeenCalledExactlyOnceWith('88f933fiieo');
  });

  it('displays the recipe name as the header', async () => {
    wrapper = mountComponent();
    await flushPromises();
    const h1 = wrapper.find('h1');
    expect(h1.text()).toBe(TEST_RECIPE.name);
  });
});
