import type { Source } from '@/models/source';
import { vi } from 'vitest';
import type { Ref } from 'vue';
import { ref } from 'vue';

interface SourcesData {
  addSource: (source: Source) => Promise<string>;
  sources: Ref<Source[]>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  getSource: (id: string) => Promise<Source | null>;
  removeSource: (id: string) => Promise<void>;
  updateSource: (id: string, fields: Omit<Source, 'id'>) => Promise<void>;
}

const addSource = vi.fn();
const getSource = vi.fn().mockResolvedValue(null);
const removeSource = vi.fn();
const updateSource = vi.fn();
const sources = ref<Source[]>([]);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

export const useSourcesData: () => SourcesData = vi.fn().mockReturnValue({
  addSource,
  error,
  getSource,
  loading,
  sources,
  removeSource,
  updateSource,
});
