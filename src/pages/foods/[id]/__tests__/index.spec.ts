import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import { useRoute, useRouter } from 'vue-router';
import { useFoodsData } from '@/data/foods';
import { TEST_FOOD } from '@/data/__tests__/test-data';

vi.mock('@/data/foods');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Food View Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
  });

  beforeEach(() => {
    const { getFood } = useFoodsData();
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
    (useRouter as Mock).mockReturnValue({ push: vi.fn() });
    (getFood as Mock).mockResolvedValue(TEST_FOOD);
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
      const button = wrapper.findComponent('[data-testid="close-button"]');
      await button.trigger('click');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('/foods');
    });
  });

  describe('modify button', () => {
    it('navigates to the food update page', async () => {
      const router = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const button = wrapper.findComponent('[data-testid="modify-button"]');
      await button.trigger('click');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('/foods/88f933fiieo/update');
    });
  });
});
