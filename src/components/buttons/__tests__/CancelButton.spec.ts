import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
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
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the correct wording', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toBe('Cancel');
  });
});
