import FoodListItem from '@/components/foods/FoodListItem.vue';
import { TEST_FOODS } from '@/data/__tests__/test-data';
import { useFoodsData } from '@/data/foods';
import type { FoodItem } from '@/models/food';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

vi.mock('vue-router');
vi.mock('@/data/foods');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Foods List Page', () => {
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
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('has a title', () => {
    wrapper = mountPage();
    const title = wrapper.find('h1');
    expect(title.text()).toBe('My Foods');
  });

  it('uses the food data', () => {
    wrapper = mountPage();
    expect(useFoodsData).toHaveBeenCalledExactlyOnceWith();
  });

  it('displays each food item', () => {
    const { foods } = useFoodsData();
    (foods.value as FoodItem[]) = TEST_FOODS;
    wrapper = mountPage();
    const listItems = wrapper.findAllComponents(FoodListItem);
    expect(listItems.length).toBe(TEST_FOODS.length);
  });

  it('navigates to the given food on click', async () => {
    const router = useRouter();
    const { foods } = useFoodsData();
    (foods.value as FoodItem[]) = TEST_FOODS;
    wrapper = mountPage();
    const listItems = wrapper.findAllComponents(FoodListItem);
    const listItem = listItems[2]?.findComponent({ name: 'VListItem' });
    await listItem?.trigger('click');
    expect(router.push).toHaveBeenCalledExactlyOnceWith(`foods/${TEST_FOODS[2]?.id}`);
  });

  describe('floating action button', () => {
    beforeEach(() => {
      const { foods } = useFoodsData();
      (foods.value as FoodItem[]) = TEST_FOODS;
    });

    it('displays a FAB', () => {
      wrapper = mountPage();
      const fab = wrapper.findComponent({ name: 'VFab' });
      expect(fab.exists()).toBe(true);
    });

    it('displays the speed dial component', async () => {
      wrapper = mountPage();
      const speedDial = wrapper.findComponent({ name: 'VSpeedDial' });
      expect(speedDial.exists()).toBe(true);
    });

    it('binds the open state to the speed dial', async () => {
      wrapper = mountPage();
      const speedDial = wrapper.findComponent({ name: 'VSpeedDial' });

      expect(speedDial.props('modelValue')).toBe(false);

      // Update the speed dial model
      await speedDial.vm.$emit('update:modelValue', true);
      await wrapper.vm.$nextTick();

      // The component should have updated
      expect(speedDial.emitted('update:modelValue')?.[0]).toEqual([true]);
    });
  });
});
