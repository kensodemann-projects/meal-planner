import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DefaultLayout from '../default.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () =>
  mount(
    {
      template: '<v-layout><DefaultLayout></DefaultLayout></v-layout>',
    },
    {
      props: {},
      global: {
        components: {
          DefaultLayout,
        },
        plugins: [vuetify],
        stubs: {
          'router-view': true,
        },
      },
    },
  );

it('renders', () => {
  const wrapper = mountComponent();
  expect(wrapper.text()).toBe('This is the default layout');
});
