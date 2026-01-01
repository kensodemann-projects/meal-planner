import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ResetButton from '../ResetButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(ResetButton, { global: { plugins: [vuetify] } });

describe('Reset Button', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the correct wording', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toBe('Reset');
  });
});
