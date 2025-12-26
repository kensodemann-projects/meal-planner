import type { Settings } from '@/models/settings';
import { vi } from 'vitest';
import type { Ref } from 'vue';
import { ref } from 'vue';

interface SettingsData {
  settings: Ref<Settings>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  updateSettings: (settings: Settings) => Promise<void>;
}

const updateSettings = vi.fn();
const settings = ref<Settings>({
  dailyCalorieLimit: 2500,
  dailySugarLimit: 35,
  dailyProteinTarget: 85,
  tolerance: 15,
  cheatDays: 2,
  weekStartDay: 1,
});
(settings as any).promise = { value: Promise.resolve(settings) };
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useSettingsData: () => SettingsData = vi.fn().mockReturnValue({
  error,
  loading,
  settings,
  updateSettings,
});
