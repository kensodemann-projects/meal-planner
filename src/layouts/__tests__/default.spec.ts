import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
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

describe('DefaultLayout', () => {
  it('displays the menu items for this application', () => {
    const wrapper = mountComponent();
    const items = wrapper.findAllComponents(components.VListItem);
    expect(items.length).toBe(5);
    expect(items[0].text()).toBe('Dashboard');
    expect(items[1].text()).toBe('Planning');
    expect(items[2].text()).toBe('Shopping');
    expect(items[3].text()).toBe('Recipes');
    expect(items[4].text()).toBe('Logout');
  });
});
