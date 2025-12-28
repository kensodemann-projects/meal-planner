import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import error from '../error.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(error, { props, global: { plugins: [vuetify] } });

describe('error', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays a snarky title', () => {
    wrapper = mountPage();
    expect(wrapper.find('.title').text()).toBe('I find this failure to load to be disturbing.');
  });

  it('displays an equally snarky subtitle', () => {
    wrapper = mountPage();
    expect(wrapper.find('.subtitle').text()).toBe('This is not the page you are looking for.');
  });
});
