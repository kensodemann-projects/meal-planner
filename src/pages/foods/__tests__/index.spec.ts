import { sampleFoodItems } from '@/data/__mocks__/foods';
import { useFoodsData } from '@/data/foods';
import { mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

vi.mock('@/data/foods');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

it('renders', () => {
  const wrapper = mountPage();
  expect(wrapper.exists()).toBe(true);
});

it('has a title', () => {
  const wrapper = mountPage();
  const title = wrapper.find('h1');
  expect(title.text()).toBe('My Foods');
});

it('uses the food data', () => {
  mountPage();
  expect(useFoodsData).toHaveBeenCalledExactlyOnceWith();
});

it('displays each food item', () => {
  const { foods } = useFoodsData();
  foods.value = sampleFoodItems;
  const wrapper = mountPage();
  const listItems = wrapper.findAllComponents('.food-list-item');
  expect(listItems.length).toBe(sampleFoodItems.length);
});
