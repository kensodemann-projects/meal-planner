import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ModifyButton from '../ModifyButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(ModifyButton, { global: { plugins: [vuetify] } });

describe('Modify Button', () => {
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('has the proper text', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toBe('Modify');
  });
});
