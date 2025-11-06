import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CancelButton from '../CancelButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(CancelButton, { global: { plugins: [vuetify] } });

describe('Cancel Button', () => {
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the correct wording', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toBe('Cancel');
  });
});
