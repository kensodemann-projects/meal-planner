import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DefaultMobileLayout from '../DefaultMobileLayout.vue';
import type { MenuItem } from '../menu-item';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (menuItems: MenuItem[]) =>
  mount(DefaultMobileLayout, { props: { menuItems }, global: { plugins: [vuetify], stubs: { 'router-view': true } } });

describe('default mobile layout', () => {
  it('always includes logout and settings menu items', () => {
    const wrapper = mountComponent([]);
    const items = wrapper.findAllComponents(components.VListItem);
    expect(items.length).toBe(2);
    expect(items[0].text()).toBe('Settings');
    expect(items[1].text()).toBe('Logout');
  });

  it('renders each menu item', () => {
    const wrapper = mountComponent([
      { icon: 'mdi-folder', title: 'My Files', value: 'myfiles', path: '/' },
      { icon: 'mdi-account-multiple', title: 'Shared with me', value: 'shared', path: '/planning' },
      { icon: 'mdi-star', title: 'Starred', value: 'starred', path: '/recipes' },
      { icon: 'mdi-information-outline', title: 'About', value: 'about', path: '/about' },
    ]);
    const items = wrapper.findAllComponents(components.VListItem);
    expect(items.length).toBe(6);
    expect(items[0].text()).toBe('My Files');
    expect(items[1].text()).toBe('Shared with me');
    expect(items[2].text()).toBe('Starred');
    expect(items[3].text()).toBe('About');
    expect(items[4].text()).toBe('Settings');
    expect(items[5].text()).toBe('Logout');
  });
});
