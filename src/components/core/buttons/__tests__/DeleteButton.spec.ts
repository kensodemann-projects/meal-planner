import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DeleteButton from '../DeleteButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(DeleteButton, { global: { plugins: [vuetify] } });

describe('Delete Button', () => {
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

  it('has the proper text', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toBe('Delete');
  });
});
