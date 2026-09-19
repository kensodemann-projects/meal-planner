import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCollection, useFirestore } from 'vuefire';
import { GENERIC_RESTAURANT_SOURCE_ID, useSourcesData } from '../sources';
import { TEST_SOURCE, TEST_SOURCES } from './test-data';

vi.mock('firebase/firestore', async () => {
  const actual = (await vi.importActual('firebase/firestore')) as any;
  return {
    ...actual,
    addDoc: vi.fn().mockResolvedValue({ id: '123' }),
    collection: vi.fn().mockImplementation((db: any, path: string) => db.id.toString() + ':col:' + path),
    query: vi
      .fn()
      .mockImplementation((col: string, ...args: Array<string>) =>
        args.reduce((accumulator, current) => accumulator + current, col),
      ),
    where: vi
      .fn()
      .mockImplementation((col: string, op: string, value: number) => ':where:' + col + op + value.toString()),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDocs: vi.fn().mockResolvedValue([]),
    getDoc: vi.fn().mockResolvedValue({ exists: vi.fn().mockResolvedValue(false) }),
    doc: vi.fn().mockImplementation((db: any, ...paths: string[]) => db.id.toString() + ':doc:' + paths.join(':')),
  };
});
vi.mock('vuefire', async () => {
  const actual = (await vi.importActual('vuefire')) as any;
  return {
    ...actual,
    useCollection: vi.fn(),
    useFirestore: vi.fn(),
  };
});

describe('Source Data Service', () => {
  beforeEach(() => {
    (useFirestore as Mock).mockReturnValue({ id: 42, name: 'my fake fire store' });
  });

  afterEach(() => vi.clearAllMocks());

  it('uses the sources collection', () => {
    useSourcesData();
    expect(collection).toHaveBeenCalledOnce();
    expect(collection).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'sources');
  });

  it('exports the generic restaurant source id', () => {
    expect(GENERIC_RESTAURANT_SOURCE_ID).toBe('restaurant');
  });

  describe('add source', () => {
    it('adds the source doc', () => {
      const { addSource } = useSourcesData();
      addSource(TEST_SOURCE);
      expect(addDoc).toHaveBeenCalledOnce();
      expect(addDoc).toHaveBeenCalledWith('42:col:sources', TEST_SOURCE);
    });

    it('resolves the source ID', async () => {
      const { addSource } = useSourcesData();
      (addDoc as Mock).mockResolvedValueOnce({ id: 'Hiir00r93999430ddkf' });
      expect(await addSource(TEST_SOURCE)).toBe('Hiir00r93999430ddkf');
    });
  });

  describe('get source', () => {
    beforeEach(() => {
      const sources = ref(TEST_SOURCES);
      (sources as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(sources);
    });

    it('finds the source in the list', async () => {
      const { getSource } = useSourcesData();
      expect(await getSource(TEST_SOURCES[2]?.id || '')).toEqual(TEST_SOURCES[2]);
    });

    it('resolves null if the source is not in the list', async () => {
      const { getSource } = useSourcesData();
      await expect(getSource('non-existent-id')).resolves.toBeNull();
    });
  });

  describe('remove source', () => {
    it('obtains a reference to the doc', () => {
      const { removeSource } = useSourcesData();
      removeSource('993-39594-4323');
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'sources/993-39594-4323');
    });

    it('deletes the document', () => {
      const { removeSource } = useSourcesData();
      removeSource('993-39594-4323');
      expect(deleteDoc).toHaveBeenCalledOnce();
      expect(deleteDoc).toHaveBeenCalledWith('42:doc:sources/993-39594-4323');
    });
  });

  describe('update source', () => {
    it('obtains a reference to the doc', () => {
      const { updateSource } = useSourcesData();
      updateSource('43334-22343-893', TEST_SOURCE);
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'sources/43334-22343-893');
    });

    it('updates the source document', () => {
      const { updateSource } = useSourcesData();
      updateSource('43334-22343-893', {
        name: 'I am just a fake thing',
      });
      expect(updateDoc).toHaveBeenCalledOnce();
      expect(updateDoc).toHaveBeenCalledWith('42:doc:sources/43334-22343-893', {
        name: 'I am just a fake thing',
      });
    });
  });

  describe('loading state', () => {
    it('exposes the pending state from the collection', () => {
      const sources = ref([]);
      (sources as any).pending = ref(true);
      (useCollection as Mock).mockReturnValueOnce(sources);
      const { loading } = useSourcesData();
      expect(loading.value).toBe(true);
    });

    it('reflects changes in the pending state', () => {
      const sources = ref([]);
      const pending = ref(false);
      (sources as any).pending = pending;
      (useCollection as Mock).mockReturnValueOnce(sources);
      const { loading } = useSourcesData();
      expect(loading.value).toBe(false);
      pending.value = true;
      expect(loading.value).toBe(true);
    });
  });

  describe('error state', () => {
    it('exposes the error state from the collection', () => {
      const sources = ref([]);
      const testError = new Error('Test error');
      (sources as any).error = ref(testError);
      (useCollection as Mock).mockReturnValueOnce(sources);
      const { error } = useSourcesData();
      expect(error.value).toBe(testError);
    });

    it('reflects changes in the error state', () => {
      const sources = ref([]);
      const errorRef = ref<Error | null>(null);
      (sources as any).error = errorRef;
      (useCollection as Mock).mockReturnValueOnce(sources);
      const { error } = useSourcesData();
      expect(error.value).toBeNull();
      const testError = new Error('Test error');
      errorRef.value = testError;
      expect(error.value).toBe(testError);
    });
  });
});
