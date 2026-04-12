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
  minDailyCalories: 1500,
  maxDailyCalories: 2500,
  minDailyProtein: 85,
  maxDailyProtein: 150,
  minDailyCarbs: 130,
  maxDailyCarbs: 300,
  minDailyFat: 20,
  maxDailyFat: 70,
  maxDailySugar: 35,
  tolerance: 15,
  weekStartDay: 1,
});
(settings as any).promise = { value: Promise.resolve(settings.value) };
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useSettingsData: () => SettingsData = vi.fn().mockReturnValue({
  error,
  loading,
  settings,
  updateSettings,
});
