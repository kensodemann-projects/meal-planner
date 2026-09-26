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

describe('Sources List Page', () => {
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

  it.todo('has a title');

  it.todo('displays each source');

  it.todo('displays the matching sources');

  it.todo('navigates to the given source on click');

  describe('add button', () => {
    it.todo('navigates to the source add page');
  });

  describe('search', () => {
    it.todo('renders');

    it.todo('re-runs the filter on new search text');

    describe('source count', () => {
      it.todo('displays the source count');

      it.todo('displays the filtered count');
    });
  });

  describe('empty state', () => {
    it.todo('displays a message when there are no sources and not loading');

    it.todo('displays a message when sources are loaded but no matches are found');

    it.todo('does not display a message when loading');

    it.todo('does not display a message when there are matching sources');
  });
});
