import { type Settings } from '@/models/settings';
import { flushPromises } from '@vue/test-utils';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocument, useFirestore } from 'vuefire';
import { useSettingsData } from '../settings';

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
    setDoc: vi.fn().mockResolvedValue({ id: '123' }),
    doc: vi.fn().mockImplementation((col: any, ...paths: string[]) => col + ':doc:' + paths.join(':')),
  };
});
vi.mock('vuefire', async () => {
  const actual = (await vi.importActual('vuefire')) as any;
  return {
    ...actual,
    useDocument: vi.fn().mockReturnValue({
      value: null,
      pending: { value: false },
      error: { value: null },
      promise: { value: Promise.resolve(null) },
    }),
    useFirestore: vi.fn(),
  };
});

describe('Settings Data Service', () => {
  beforeEach(() => {
    (useFirestore as Mock).mockReturnValue({ id: 42, name: 'my fake fire store' });
  });

  afterEach(() => vi.clearAllMocks());

  it('uses the application document from the settings collection', () => {
    useSettingsData();
    expect(doc).toHaveBeenCalledExactlyOnceWith('42:col:settings', 'application');
    expect(useDocument).toHaveBeenCalledExactlyOnceWith('42:col:settings:doc:application');
  });

  it('sets the default settings if they do not exist', async () => {
    useSettingsData();
    await flushPromises();
    expect(setDoc).toHaveBeenCalledExactlyOnceWith('42:col:settings:doc:application', DEFAULT_SETTINGS);
  });

  it('does not set the settings doc if it already exists', async () => {
    (useDocument as Mock).mockReturnValueOnce({
      value: { ...DEFAULT_SETTINGS, dailyCalorieLimit: 2500 },
      pending: { value: false },
      error: { value: null },
      promise: { value: Promise.resolve({ ...DEFAULT_SETTINGS, dailyCalorieLimit: 2500 }) },
    });
    useSettingsData();
    await flushPromises();
    expect(setDoc).not.toHaveBeenCalled();
  });

  describe('loading state', () => {
    it('exposes the pending state from useDocument', () => {
      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: true },
        error: { value: null },
        promise: { value: Promise.resolve(null) },
      });
      const { loading } = useSettingsData();
      expect(loading.value).toBe(true);
    });

    it('reflects changes in the pending state', () => {
      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: false },
        error: { value: null },
        promise: { value: Promise.resolve(null) },
      });
      const { loading } = useSettingsData();
      expect(loading.value).toBe(false);
    });
  });

  describe('error state', () => {
    it('exposes the error state from useDocument', () => {
      const testError = new Error('Test error');
      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: false },
        error: { value: testError },
        promise: { value: Promise.resolve(null) },
      });
      const { error } = useSettingsData();
      expect(error.value).toBe(testError);
    });

    it('reflects null when no error exists', () => {
      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: false },
        error: { value: null },
        promise: { value: Promise.resolve(null) },
      });
      const { error } = useSettingsData();
      expect(error.value).toBeNull();
    });
  });

  describe('update settings', () => {
    it('updates the "application" document', () => {
      const { updateSettings } = useSettingsData();
      const newSettings = { ...DEFAULT_SETTINGS, dailyCalorieLimit: 3000 };
      updateSettings(newSettings);
      expect(updateDoc).toHaveBeenCalledExactlyOnceWith('42:col:settings:doc:application', newSettings);
    });
  });

  describe('error handling', () => {
    it('logs error in development mode when promise initialization fails', async () => {
      const originalDev = import.meta.env.DEV;
      import.meta.env.DEV = true;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const initError = new Error('Failed to load settings');

      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: false },
        error: { value: null },
        promise: { value: Promise.reject(initError) },
      });

      useSettingsData();
      await flushPromises();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize application settings', initError);

      consoleSpy.mockRestore();
      import.meta.env.DEV = originalDev;
    });

    it('does not log error in production mode when promise initialization fails', async () => {
      const originalDev = import.meta.env.DEV;
      import.meta.env.DEV = false;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: false },
        error: { value: null },
        promise: { value: Promise.reject(new Error('Failed')) },
      });

      useSettingsData();
      await flushPromises();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
      import.meta.env.DEV = originalDev;
    });

    it('does not throw when promise initialization fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (useDocument as Mock).mockReturnValueOnce({
        value: null,
        pending: { value: false },
        error: { value: null },
        promise: { value: Promise.reject(new Error('Failed')) },
      });

      expect(() => useSettingsData()).not.toThrow();
      await flushPromises();

      consoleSpy.mockRestore();
    });
  });
});

const DEFAULT_SETTINGS: Settings = {
  dailyCalorieLimit: 2000,
  dailySugarLimit: 50,
  dailyProteinTarget: 75,
  tolerance: 10,
  cheatDays: 1,
  weekStartDay: 0,
};
