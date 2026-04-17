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
      minDailyCalories: 1500,
      maxDailyCalories: 2500,
      minDailyProtein: 85,
      maxDailyProtein: 150,
      minDailyCarbs: 130,
      maxDailyCarbs: 300,
      minDailyFat: 20,
      maxDailyFat: 70,
      minDailySodium: 1550,
      maxDailySodium: 2340,
      maxDailySugar: 35,
      tolerance: 15,
      weekStartDay: 1,
    });
  });

  it('calls updateSettings when SettingsEditor emits save event', async () => {
    wrapper = mountPage();
    const settingsEditor = wrapper.findComponent({ name: 'SettingsEditor' });
    const { updateSettings } = useSettingsData();

    const updatedSettings = {
      minDailyCalories: 1950,
      maxDailyCalories: 2150,
      minDailyProtein: 140,
      maxDailyProtein: 160,
      minDailyCarbs: 210,
      maxDailyCarbs: 235,
      minDailyFat: 60,
      maxDailyFat: 75,
      minDailySodium: 1600,
      maxDailySodium: 2200,
      maxDailySugar: 38,
      tolerance: 12,
      weekStartDay: 0,
    };

    await settingsEditor.vm.$emit('save', updatedSettings);

    expect(updateSettings).toHaveBeenCalledOnce();
    expect(updateSettings).toHaveBeenCalledWith(updatedSettings);
  });
});
