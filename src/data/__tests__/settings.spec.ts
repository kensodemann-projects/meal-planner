import { doc, setDoc } from 'firebase/firestore';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocument, useFirestore } from 'vuefire';
import { useSettingsData } from '../settings';
import { flushPromises } from '@vue/test-utils';
import { DEFAULT_SETTINGS } from '@/models/settings';

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
      value: { ...DEFAULT_SETTINGS, calories: 2500 },
      pending: { value: false },
      error: { value: null },
      promise: { value: Promise.resolve({ ...DEFAULT_SETTINGS, calories: 2500 }) },
    });
    useSettingsData();
    await flushPromises();
    expect(setDoc).not.toHaveBeenCalled();
  });
});
