import type { FoodItem } from '@/models';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFirestore } from 'vuefire';
import { useFoodsData } from '../foods';

vi.mock('firebase/firestore', async () => {
  const actual = (await vi.importActual('firebase/firestore')) as any;
  return {
    ...actual,
    addDoc: vi.fn(),
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
    doc: vi.fn().mockImplementation((db: any, path: string) => db.id.toString() + ':doc:' + path),
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

const TEST_FOOD: FoodItem = {
  name: 'Hot Dog',
  brand: "Jimmy's",
  fdcId: 429930,
  category: 'Meats',
  grams: 100,
  unitOfMeasure: { id: 'g', name: 'Grams', type: 'weight', system: 'metric' },
  units: 100,
  calories: 450,
  sodium: 1243,
  sugar: 6,
  carbs: 12,
  protein: 0,
  fat: 16,
  alternativePortions: [],
};
