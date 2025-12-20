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
  calories: 2500,
  sugar: 35,
  protein: 85,
  tolerance: 15,
  cheatDays: 2,
  weekStartDay: 1,
});
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useSettingsData: () => SettingsData = vi.fn().mockReturnValue({
  error,
  loading,
  settings,
  updateSettings,
});
