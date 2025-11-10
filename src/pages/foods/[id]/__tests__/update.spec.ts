import FoodEditor from '@/components/FoodEditor.vue';
import { TEST_FOOD } from '@/data/__tests__/test-data';
import { useFoodsData } from '@/data/foods';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import UpdatePage from '../update.vue';

vi.mock('vue-router');
vi.mock('@/data/foods');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(UpdatePage, { global: { plugins: [vuetify] } });

describe('Food Update Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
  });

  beforeEach(() => {
    const { getFood } = useFoodsData();
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
    (getFood as Mock).mockResolvedValue({ ...TEST_FOOD, id: '88f933fiieo' });
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('gets the food item', async () => {
    const { getFood } = useFoodsData();
    wrapper = mountPage();
    await flushPromises();
    expect(getFood).toHaveBeenCalledExactlyOnceWith('88f933fiieo');
  });

  it('renders the editor', async () => {
    wrapper = mountPage();
    await flushPromises();
    const editor = wrapper.findComponent(FoodEditor);
    expect(editor.exists()).toBe(true);
  });

  describe('on cancel', () => {
    it('does not save the food item', async () => {
      const { updateFood } = useFoodsData();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('cancel');
      expect(updateFood).not.toHaveBeenCalled();
    });

    it('navigates to the view page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('cancel');
      expect(router.replace).toHaveBeenCalledExactlyOnceWith('/foods/88f933fiieo');
    });
  });

  describe('on save', () => {
    it('saves the modified food item', async () => {
      const { updateFood } = useFoodsData();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', { ...TEST_FOOD, name: 'this is a modified name', id: '88f933fiieo' });
      expect(updateFood).toHaveBeenCalledExactlyOnceWith({
        ...TEST_FOOD,
        name: 'this is a modified name',
        id: '88f933fiieo',
      });
    });

    it('navigates to the view page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', { ...TEST_FOOD, name: 'this is a modified name', id: '88f933fiieo' });
      await flushPromises();
      expect(router.replace).toHaveBeenCalledExactlyOnceWith('/foods/88f933fiieo');
    });
  });
});
