import RecipeEditor from '@/components/recipes/RecipeEditor.vue';
import { TEST_RECIPE } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import update from '../update.vue';

vi.mock('vue-router');
vi.mock('@/data/foods');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(update, { props, global: { plugins: [vuetify] } });

describe('update', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    const { getRecipe } = useRecipesData();
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
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
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('gets the recipe item', async () => {
    const { getRecipe } = useRecipesData();
    wrapper = mountPage();
    await flushPromises();
    expect(getRecipe).toHaveBeenCalledExactlyOnceWith('88f933fiieo');
  });

  it('renders the editor', async () => {
    wrapper = mountPage();
    await flushPromises();
    const editor = wrapper.findComponent(RecipeEditor);
    expect(editor.exists()).toBe(true);
  });

  describe('on cancel', () => {
    it('does not save the recipe item', async () => {
      const { updateRecipe } = useRecipesData();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(updateRecipe).not.toHaveBeenCalled();
    });

    it('navigates to the view page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(router.replace).toHaveBeenCalledExactlyOnceWith('/recipes/88f933fiieo');
    });
  });

  describe('on save', () => {
    it('saves the modified recipe', async () => {
      const { updateRecipe } = useRecipesData();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('save', { ...TEST_RECIPE, name: 'this is a modified name', id: '88f933fiieo' });
      await flushPromises();
      expect(updateRecipe).toHaveBeenCalledExactlyOnceWith({
        ...TEST_RECIPE,
        name: 'this is a modified name',
        id: '88f933fiieo',
      });
    });

    it('navigates to the view page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('save', { ...TEST_RECIPE, name: 'this is a modified name', id: '88f933fiieo' });
      await flushPromises();
      expect(router.replace).toHaveBeenCalledExactlyOnceWith('/recipes/88f933fiieo');
    });
  });
});
