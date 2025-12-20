import { type Settings } from '@/models/settings';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { computed } from 'vue';
import { useDocument, useFirestore } from 'vuefire';

const DEFAULT_SETTINGS: Settings = {
  calories: 2000,
  sugar: 50,
  protein: 75,
  tolerance: 10,
  cheatDays: 1,
  weekStartDay: 0, // Sunday
};

export const useSettingsData = () => {
  const db = useFirestore();

  const settingsDoc = doc(collection(db, 'settings'), 'application');
  const settings = useDocument<Settings>(settingsDoc);

  const loading = computed(() => settings.pending.value);
  const error = computed(() => settings.error.value);

  settings.promise.value
    ?.then((data) => {
      if (!data) {
        setDoc(settingsDoc, DEFAULT_SETTINGS);
      }
    })
    .catch((err) => {
      if (import.meta.env.DEV) {
        console.error('Failed to initialize application settings', err);
      }
    });

  const updateSettings = async (settingsData: Settings): Promise<void> => {
    await updateDoc(settingsDoc, settingsData as Partial<Settings>);
  };

  return { error, loading, settings, updateSettings };
};
