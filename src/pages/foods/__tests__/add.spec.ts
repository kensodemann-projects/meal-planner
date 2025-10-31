import FoodEditor from '@/components/FoodEditor.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AddPage from '../add.vue';
import { useFoodsData } from '@/data/foods';
import { useRouter } from 'vue-router';
import { TEST_FOOD } from '@/data/__tests__/test-data';

vi.mock('vue-router');
vi.mock('@/data/foods');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(AddPage, { global: { plugins: [vuetify] } });

describe('Food Add Page', () => {
  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
  });

  it('renders', () => {
    const wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the editor', () => {
    const wrapper = mountPage();
    const editor = wrapper.findComponent(FoodEditor);
    expect(editor.exists()).toBe(true);
  });

  describe('on cancel', () => {
    it('does not create a new food item', () => {
      const { addFood } = useFoodsData();
      const wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('cancel');
      expect(addFood).not.toHaveBeenCalled();
    });

    it('navigates to the search and add page page', () => {
      const { replace } = useRouter();
      const wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('cancel');
      expect(replace).toHaveBeenCalledExactlyOnceWith('/foods/search-and-add');
    });
  });

  describe('on save', () => {
    it('creates a new food item', async () => {
      const { addFood } = useFoodsData();
      const wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', TEST_FOOD);
      await flushPromises();
      expect(addFood).toHaveBeenCalledExactlyOnceWith(TEST_FOOD);
    });

    it('navigates to the food list page', async () => {
      const { replace } = useRouter();
      const wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', TEST_FOOD);
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/foods');
    });
  });
});
