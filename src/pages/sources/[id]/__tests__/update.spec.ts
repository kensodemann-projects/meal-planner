import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import UpdatePage from '../update.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(UpdatePage, { global: { plugins: [vuetify] } });

describe('Source Update Page', () => {
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

  it.todo('gets the source');

  it.todo('renders the editor');

  describe('on cancel', () => {
    it.todo('does not save the source');

    it.todo('navigates to the view page');
  });

  describe('on save', () => {
    it.todo('saves the modified source');

    it.todo('navigates to the view page');
  });
});
