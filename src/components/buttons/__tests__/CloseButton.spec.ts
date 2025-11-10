import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CloseButton from '../CloseButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(CloseButton, { global: { plugins: [vuetify] } });

describe('Close Button', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the correct text', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toBe('Close');
  });
});
