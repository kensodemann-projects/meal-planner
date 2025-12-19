import { collection, doc } from 'firebase/firestore';
import { computed } from 'vue';
import { useDocument, useFirestore } from 'vuefire';

export const useSettingsData = () => {
  const db = useFirestore();

  const settingsDoc = doc(collection(db, 'settings'), 'application');
  const settings = useDocument(settingsDoc);

  const loading = computed(() => settings.pending.value);
  const error = computed(() => settings.error.value);

  return { error, loading, settings };
};
