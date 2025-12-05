import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ViewPageActionButtons from '@/components/ViewPageActionButtons.vue';
import { TEST_FOOD } from '@/data/__tests__/test-data';
import { useFoodsData } from '@/data/foods';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

vi.mock('@/data/foods');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Food View Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    // Polyfill visualViewport for Vuetify overlays/dialogs in jsdom
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
    const { getFood } = useFoodsData();
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
    (useRouter as Mock).mockReturnValue({ push: vi.fn(), replace: vi.fn() });
    (getFood as Mock).mockResolvedValue({ ...TEST_FOOD, id: '88f933fiieo' });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', async () => {
    wrapper = mountPage();
    await flushPromises();
    expect(wrapper.exists()).toBe(true);
  });

  it('gets the food item', async () => {
    const { getFood } = useFoodsData();
    wrapper = mountPage();
    await flushPromises();
    expect(getFood).toHaveBeenCalledExactlyOnceWith('88f933fiieo');
  });

  describe('close button', () => {
    it('navigates to the food list page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const actionButtons = wrapper.findComponent(ViewPageActionButtons);
      actionButtons.vm.$emit('close');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('/foods');
    });
  });

  describe('modify button', () => {
    it('navigates to the food update page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const actionButtons = wrapper.findComponent(ViewPageActionButtons);
      actionButtons.vm.$emit('modify');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('/foods/88f933fiieo/update');
    });
  });

  describe('delete button', () => {
    it('confirms the delete with the user', async () => {
      wrapper = mountPage();
      await flushPromises();
      const actionButtons = wrapper.findComponent(ViewPageActionButtons);
      actionButtons.vm.$emit('delete');
      await flushPromises();
      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);
    });

    describe('on confirm', () => {
      it('removes the food', async () => {
        wrapper = mountPage();
        await flushPromises();
        const actionButtons = wrapper.findComponent(ViewPageActionButtons);
        actionButtons.vm.$emit('delete');
        await flushPromises();
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('confirm');
        const { removeFood } = useFoodsData();
        expect(removeFood).toHaveBeenCalledExactlyOnceWith('88f933fiieo');
      });

      it('navigates to the food list page', async () => {
        const router = useRouter();
        wrapper = mountPage();
        await flushPromises();
        const actionButtons = wrapper.findComponent(ViewPageActionButtons);
        actionButtons.vm.$emit('delete');
        await flushPromises();
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('confirm');
        await flushPromises();
        expect(router.replace).toHaveBeenCalledExactlyOnceWith('/foods');
      });
    });

    describe('on cancel', () => {
      it('does not remove the food', async () => {
        wrapper = mountPage();
        await flushPromises();
        const actionButtons = wrapper.findComponent(ViewPageActionButtons);
        actionButtons.vm.$emit('delete');
        await flushPromises();
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('cancel');
        await flushPromises();
        const { removeFood } = useFoodsData();
        expect(removeFood).not.toHaveBeenCalled();
      });

      it('does not navigate', async () => {
        wrapper = mountPage();
        await flushPromises();
        const actionButtons = wrapper.findComponent(ViewPageActionButtons);
        actionButtons.vm.$emit('delete');
        await flushPromises();
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('cancel');
        await flushPromises();
        const router = useRouter();
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });
});
