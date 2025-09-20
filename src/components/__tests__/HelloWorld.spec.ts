import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import HelloWorld from '../HelloWorld.vue';

const vuetify = createVuetify({
  components,
  directives,
});

it('displays message', () => {
  const wrapper = mount(
    {
      template: '<v-layout><hello-world></hello-world></v-layout>',
    },
    {
      props: {},
      global: {
        components: {
          HelloWorld,
        },
        plugins: [vuetify],
      },
    },
  );

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Components');
});
