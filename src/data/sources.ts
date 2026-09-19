import type { Source } from '@/models/source';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { computed } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

export const GENERIC_RESTAURANT_SOURCE_ID = 'restaurant';

export const useSourcesData = () => {
  const db = useFirestore();
  const path = 'sources';
  const sourcesCollection = collection(db, path);
  const sources = useCollection<Source>(sourcesCollection);

  const loading = computed(() => sources.pending.value);
  const error = computed(() => sources.error.value);

  const addSource = async (source: Source): Promise<string> => {
    const item = await addDoc(sourcesCollection, source);
    return item.id;
  };

  const removeSource = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, `${path}/${id}`));
  };

  const updateSource = async (id: string, fields: Omit<Source, 'id'>): Promise<void> => {
    await updateDoc(doc(db, `${path}/${id}`), fields);
  };

  const getSource = async (id: string): Promise<Source | null> => {
    await sources.promise.value;
    return sources.value.find((f) => f.id === id) || null;
  };

  return { addSource, error, getSource, loading, sources, removeSource, updateSource };
};
