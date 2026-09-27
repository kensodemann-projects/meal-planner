import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import { useSourcesData } from '@/data/sources';

vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Sources List Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    const { sources } = useSourcesData();
    sources.value = [
      {
        name: 'Generic Restaurant',
        id: 'restaurant',
      },
      {
        name: 'Hungryroot',
        id: '1004399v09asdfkfe1',
      },
      {
        name: 'Instacart',
        id: '1004399v09asdfkfe2',
      },
      {
        name: 'Kroger',
        id: '1004399v09asdfkfe3',
      },
      {
        name: 'Peapod',
        id: '1004399v09asdfkfe4',
      },
    ];
  });

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

  it('has a title', () => {
    wrapper = mountPage();
    expect(wrapper.find('h1').text()).toBe('Sources for Recipes');
  });

  it('displays each source', () => {
    wrapper = mountPage();
    const items = wrapper.findAllComponents(components.VListItem);
    expect(items.length).toBe(5);
    expect(items[0].text()).toBe('Generic Restaurant');
    expect(items[1].text()).toBe('Hungryroot');
    expect(items[2].text()).toBe('Instacart');
    expect(items[3].text()).toBe('Kroger');
    expect(items[4].text()).toBe('Peapod');
  });

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
