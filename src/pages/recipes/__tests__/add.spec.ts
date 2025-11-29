import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AddPage from '../add.vue';
import { useRouter } from 'vue-router';
import RecipeEditor from '@/components/RecipeEditor.vue';

vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(AddPage, { global: { plugins: [vuetify] } });

describe('Recipe Add Page', () => {
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

  describe('on cancel', () => {
    // it('does not create a new recipe', async () => {
    //   const { addFood } = useFoodsData();
    //   wrapper = mountPage();
    //   const editor = wrapper.findComponent(FoodEditor);
    //   editor.vm.$emit('cancel');
    //   await flushPromises();
    //   expect(addFood).not.toHaveBeenCalled();
    // });

    it('navigates to the recipe list page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(RecipeEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes');
    });
  });
});
