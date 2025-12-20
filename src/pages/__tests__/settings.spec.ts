import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SettingsPage from '../settings.vue';
import packageInfo from '../../../package.json';
import { useSettingsData } from '@/data/settings';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(SettingsPage, { global: { plugins: [vuetify] } });

vi.mock('@/data/settings');

describe('SettingsPage', () => {
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

  it('displays the application name and version in the header', () => {
    wrapper = mountPage();
    const header = wrapper.find('h1');
    expect(header.text()).toBe(`${packageInfo.description} - v${packageInfo.version}`);
  });

  it('uses the settings data', () => {
    wrapper = mountPage();
    expect(useSettingsData).toHaveBeenCalledExactlyOnceWith();
  });
});
