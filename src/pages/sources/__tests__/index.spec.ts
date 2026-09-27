import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import { useSourcesData } from '@/data/sources';
import type { Ref } from 'vue';

vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Sources List Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    const { loading, sources } = useSourcesData();
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
    (loading as Ref<boolean>).value = false;
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

  it('shows a loading indicator while sources are being fetched', () => {
    const { loading } = useSourcesData();
    (loading as Ref<boolean>).value = true;
    wrapper = mountPage();
    expect(wrapper.findComponent(components.VProgressCircular).exists()).toBe(true);
    expect(wrapper.findComponent(components.VList).exists()).toBe(false);
  });

  it('hides the loading indicator once sources have loaded', () => {
    wrapper = mountPage();
    expect(wrapper.findComponent(components.VProgressCircular).exists()).toBe(false);
    expect(wrapper.findComponent(components.VList).exists()).toBe(true);
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

  it.todo('navigates to the given source on click');

  describe('delete button', () => {
    it.todo('renders unless the source is the generic restaurant');
    it.todo('deletes the source');
  });

  describe('add button', () => {
    it.todo('navigates to the source add page');
  });

  describe('empty state message', () => {
    it('is displayed when there are no sources and not loading', () => {
      const { sources } = useSourcesData();
      sources.value = [];
      wrapper = mountPage();
      expect(wrapper.findComponent(components.VList).exists()).toBe(false);
      expect(wrapper.find('h2').text()).toBe('No sources found');
    });

    it('is not displayed when loading', () => {
      const { loading, sources } = useSourcesData();
      sources.value = [];
      (loading as Ref<boolean>).value = true;
      wrapper = mountPage();
      expect(wrapper.findComponent(components.VList).exists()).toBe(false);
      expect(wrapper.find('h2').exists()).toBe(false);
    });

    it('is not displayed when sources exist', () => {
      wrapper = mountPage();
      expect(wrapper.find('h2').exists()).toBe(false);
    });
  });
});
