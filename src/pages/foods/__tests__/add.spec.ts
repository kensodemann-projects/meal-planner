import FoodEditor from '@/components/FoodEditor.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
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
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    // Polyfill visualViewport for Vuetify overlays/snackbars in jsdom
    if (!window.visualViewport) {
      // @ts-expect-error Polyfill for Vuetify overlay in jsdom
      window.visualViewport = {
        addEventListener: () => {},
        removeEventListener: () => {},
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
      };
    }
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
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

  it('renders the editor', () => {
    wrapper = mountPage();
    const editor = wrapper.findComponent(FoodEditor);
    expect(editor.exists()).toBe(true);
  });

  describe('on cancel', () => {
    it('does not create a new food item', async () => {
      const { addFood } = useFoodsData();
      wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(addFood).not.toHaveBeenCalled();
    });

    it('navigates to the search and add page page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/foods');
    });
  });

  describe('on save', () => {
    it('creates a new food item', async () => {
      const { addFood } = useFoodsData();
      wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', TEST_FOOD);
      await flushPromises();
      expect(addFood).toHaveBeenCalledExactlyOnceWith(TEST_FOOD);
    });

    it('shows success if adding the food resolves', async () => {
      const { addFood } = useFoodsData();
      (addFood as Mock).mockResolvedValueOnce(undefined);
      wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', TEST_FOOD);
      await flushPromises();
      const snackbar = document.body.querySelector('.v-snackbar');
      expect(snackbar).not.toBeNull();
      expect(snackbar!.textContent).toContain('The food has been added to your food list.');
    });

    it('shows error if addFood throws', async () => {
      const { addFood } = useFoodsData();
      (addFood as Mock).mockRejectedValueOnce(new Error('fail'));
      wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', TEST_FOOD);
      await flushPromises();
      const snackbar = document.body.querySelector('.v-snackbar');
      expect(snackbar).not.toBeNull();
      expect(snackbar!.textContent).toContain('Failed to add food. Please try again.');
    });

    it('does not navigate', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(FoodEditor);
      editor.vm.$emit('save', TEST_FOOD);
      await flushPromises();
      expect(replace).not.toHaveBeenCalled();
    });
  });
});
