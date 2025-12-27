import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PageLoadError from '../PageLoadError.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = { message: 'whatever, dude' }) =>
  mount(PageLoadError, { props, global: { plugins: [vuetify] } });

describe('PageLoadError', () => {
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

  it('displays a snarky title', () => {
    wrapper = mountComponent();
    expect(wrapper.find('.title').text()).toBe('I find this failure to load to be disturbing.');
  });

  it('displays the message', () => {
    wrapper = mountComponent({ message: 'This station will soon be operational.' });
    expect(wrapper.find('.subtitle').text()).toBe('This station will soon be operational.');
  });
});
