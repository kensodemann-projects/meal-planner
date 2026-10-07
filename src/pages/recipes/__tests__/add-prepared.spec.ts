import RecipeEditor from '@/components/recipes/RecipeEditor.vue';
import { TEST_HOMEMADE_RECIPE } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AddPreparedPage from '../add-prepared.vue';

vi.mock('vue-router');
vi.mock('@/data/recipes');
vi.mock('@/data/sources');
vi.mock('@/core/nutrition-generator');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(AddPreparedPage, { global: { plugins: [vuetify] } });

describe('Recipe Add Prepared Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('passes prepared as the recipe kind', () => {
    wrapper = mountPage();
    const editor = wrapper.findComponent(RecipeEditor);
    expect(editor.props('kind')).toBe('prepared');
  });

  describe('on cancel', () => {
    it('does not create a new recipe', async () => {
      const { addRecipe } = useRecipesData();
      wrapper = mountPage();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(addRecipe).not.toHaveBeenCalled();
    });

    it('navigates to the add recipe page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add');
    });
  });

  describe('on save', () => {
    it('creates a new recipe', async () => {
      const { addRecipe } = useRecipesData();
      wrapper = mountPage();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('save', TEST_HOMEMADE_RECIPE);
      await flushPromises();
      expect(addRecipe).toHaveBeenCalledExactlyOnceWith(TEST_HOMEMADE_RECIPE);
    });

    it('navigates to the recipe list page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('save', TEST_HOMEMADE_RECIPE);
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes');
    });
  });
});
