import { DEFAULT_SETTINGS, type Settings } from '@/models/settings';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { computed } from 'vue';
import { useDocument, useFirestore } from 'vuefire';

export const useSettingsData = () => {
  const db = useFirestore();

  const settingsDoc = doc(collection(db, 'settings'), 'application');
  const settings = useDocument<Settings>(settingsDoc);

  const loading = computed(() => settings.pending.value);
  const error = computed(() => settings.error.value);

  settings.promise.value.then((data) => {
    if (!data) {
      setDoc(settingsDoc, DEFAULT_SETTINGS);
    }
  });

  const updateSettings = async (settingsData: Settings): Promise<void> => {
    await updateDoc(settingsDoc, settingsData as any);
  };

  return { error, loading, settings, updateSettings };
};
