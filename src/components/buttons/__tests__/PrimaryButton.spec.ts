import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
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
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('contains no text by default', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toBe('');
  });
});
