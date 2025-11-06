import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DangerButton from '../DangerButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(DangerButton, { global: { plugins: [vuetify] } });

describe('Danger Button', () => {
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('has no text by default', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toBe('');
  });
});
