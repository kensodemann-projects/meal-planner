import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Source Details Page', () => {
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

  it.todo('handles source not found');

  it.todo('handles source loading error');

  describe('close button', () => {
    it.todo('navigates to the source list page');
  });

  describe('modify button', () => {
    it.todo('navigates to the source update page');
  });

  describe('delete button', () => {
    it.todo('confirms the delete with the user');

    describe('on confirm', () => {
      it.todo('removes the source');

      it.todo('navigates to the source list page');
    });

    describe('on cancel', () => {
      it.todo('does not remove the source');

      it.todo('does not navigate');
    });

    describe('Generic Restaurant', () => {
      it.todo('cannot be deleted');
    });

    describe('when a recipe uses the source', () => {
      it.todo('does not remove the source');

      it.todo('tells the user the source is in use');
    });
  });
});
