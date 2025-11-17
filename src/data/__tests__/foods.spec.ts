import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCollection, useFirestore } from 'vuefire';
import { useFoodsData } from '../foods';
import { TEST_FOOD, TEST_FOODS } from './test-data';

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

describe('use foods', () => {
  beforeEach(() => {
    (useFirestore as Mock).mockReturnValue({ id: 42, name: 'my fake fire store' });
  });

  afterEach(() => vi.clearAllMocks());

  it('uses the foods collection', () => {
    useFoodsData();
    expect(collection).toHaveBeenCalledOnce();
    expect(collection).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'foods');
  });

  describe('add food', () => {
    it('adds the food doc', () => {
      const { addFood } = useFoodsData();
      addFood(TEST_FOOD);
      expect(addDoc).toHaveBeenCalledOnce();
      expect(addDoc).toHaveBeenCalledWith('42:col:foods', TEST_FOOD);
    });

    it('resolves the food ID', async () => {
      const { addFood } = useFoodsData();
      (addDoc as Mock).mockResolvedValueOnce({ id: 'Hiir00r93999430ddkf' });
      expect(await addFood(TEST_FOOD)).toBe('Hiir00r93999430ddkf');
    });
  });

  describe('FDC food item exists', () => {
    beforeEach(() => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_FOODS));
    });

    it('returns true if the food already exists in the list', () => {
      const { fdcFoodItemExists } = useFoodsData();
      expect(fdcFoodItemExists(1100002)).toBe(true);
    });

    it('returns false if the food does not exist in the list', () => {
      const { fdcFoodItemExists } = useFoodsData();
      expect(fdcFoodItemExists(1234)).toBe(false);
    });
  });

  describe('get food', () => {
    it('finds the food in the list', async () => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_FOODS));
      const { getFood } = useFoodsData();
      expect(await getFood(TEST_FOODS[2]?.id || '')).toEqual(TEST_FOODS[2]);
    });

    it('goes to the database if the food is not in the list', async () => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_FOODS));
      const { getFood } = useFoodsData();
      expect(await getFood('4885298slasdfk')).toBeNull();
      expect(doc).toHaveBeenCalledExactlyOnceWith({ id: 42, name: 'my fake fire store' }, 'foods', '4885298slasdfk');
      expect(getDoc).toHaveBeenCalledExactlyOnceWith('42:doc:foods:4885298slasdfk');
    });

    it('resolves the food from the database if found', async () => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_FOODS));
      (getDoc as Mock).mockResolvedValueOnce({
        exists: vi.fn().mockReturnValue(true),
        data: vi.fn().mockReturnValue(TEST_FOOD),
      });
      const { getFood } = useFoodsData();
      expect(await getFood('4885298slasdfk')).toEqual({ ...TEST_FOOD, id: '4885298slasdfk' });
    });
  });

  describe('remove food', () => {
    it('obtains a reference to the doc', () => {
      const { removeFood } = useFoodsData();
      removeFood('993-39594-4323');
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'foods/993-39594-4323');
    });

    it('deletes the document', () => {
      const { removeFood } = useFoodsData();
      removeFood('993-39594-4323');
      expect(deleteDoc).toHaveBeenCalledOnce();
      expect(deleteDoc).toHaveBeenCalledWith('42:doc:foods/993-39594-4323');
    });
  });

  describe('update food', () => {
    it('obtains a reference to the doc', () => {
      const { updateFood } = useFoodsData();
      updateFood({
        id: '43334-22343-893',
        ...TEST_FOOD,
      });
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'foods/43334-22343-893');
    });

    it('updates the food document', () => {
      const { updateFood } = useFoodsData();
      updateFood({
        id: '43334-22343-893',
        ...TEST_FOOD,
        calories: 600,
        sodium: 800,
        brand: "John's",
      });
      expect(updateDoc).toHaveBeenCalledOnce();
      expect(updateDoc).toHaveBeenCalledWith('42:doc:foods/43334-22343-893', {
        ...TEST_FOOD,
        calories: 600,
        sodium: 800,
        brand: "John's",
      });
    });
  });
});
