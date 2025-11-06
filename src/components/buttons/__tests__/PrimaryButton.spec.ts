import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PrimaryButton from '../PrimaryButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(PrimaryButton, { global: { plugins: [vuetify] } });

describe('Primary Button', () => {
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('contains no text by default', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toBe('');
  });
});
