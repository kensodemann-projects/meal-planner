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

  it('renders SettingsEditor with settings prop', () => {
    wrapper = mountPage();
    const settingsEditor = wrapper.findComponent({ name: 'SettingsEditor' });
    expect(settingsEditor.exists()).toBe(true);
    expect(settingsEditor.props('settings')).toEqual({
      dailyCalorieLimit: 2500,
      dailySugarLimit: 35,
      dailyProteinTarget: 85,
      tolerance: 15,
      cheatDays: 2,
      weekStartDay: 1,
    });
  });

  it('calls updateSettings when SettingsEditor emits save event', async () => {
    wrapper = mountPage();
    const settingsEditor = wrapper.findComponent({ name: 'SettingsEditor' });
    const { updateSettings } = useSettingsData();

    const updatedSettings = {
      dailyCalorieLimit: 2100,
      dailySugarLimit: 45,
      dailyProteinTarget: 90,
      tolerance: 12,
      cheatDays: 1,
      weekStartDay: 0,
    };

    await settingsEditor.vm.$emit('save', updatedSettings);

    expect(updateSettings).toHaveBeenCalledOnce();
    expect(updateSettings).toHaveBeenCalledWith(updatedSettings);
  });
});
