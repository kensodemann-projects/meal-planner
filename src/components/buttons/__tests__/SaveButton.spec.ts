import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SaveButton from '../SaveButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(SaveButton, { global: { plugins: [vuetify] } });

describe('Save Button', () => {
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
    expect(wrapper.text()).toBe('Save');
  });
});
