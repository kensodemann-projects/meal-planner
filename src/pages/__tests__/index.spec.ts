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

it('displays the HelloWorld component', () => {
  const wrapper = mount(
    {
      template: '<v-layout><IndexPage></IndexPage></v-layout>',
    },
    {
      props: {},
      global: {
        components: {
          IndexPage,
        },
        plugins: [vuetify],
      },
    },
  );
  expect(wrapper.text()).toContain('Components');
});
