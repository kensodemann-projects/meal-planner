import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
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
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('has no text by default', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toBe('');
  });
});
