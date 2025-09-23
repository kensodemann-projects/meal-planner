import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

it('renders', () => {
  const wrapper = mountPage();
  expect(wrapper.text()).toBe('This is the recipe list page');
});
