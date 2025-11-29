import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCollection, useFirestore } from 'vuefire';
import { useRecipesData } from '../recipes';
import { TEST_RECIPE, TEST_RECIPES } from './test-data';

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

describe('Recipe Data Service', () => {
  beforeEach(() => {
    (useFirestore as Mock).mockReturnValue({ id: 42, name: 'my fake fire store' });
  });

  afterEach(() => vi.clearAllMocks());

  it('uses the recipes collection', () => {
    useRecipesData();
    expect(collection).toHaveBeenCalledOnce();
    expect(collection).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'recipes');
  });

  describe('add recipe', () => {
    it('adds the recipe doc', () => {
      const { addRecipe } = useRecipesData();
      addRecipe(TEST_RECIPE);
      expect(addDoc).toHaveBeenCalledOnce();
      expect(addDoc).toHaveBeenCalledWith('42:col:recipes', TEST_RECIPE);
    });

    it('resolves the recipe ID', async () => {
      const { addRecipe } = useRecipesData();
      (addDoc as Mock).mockResolvedValueOnce({ id: 'Hiir00r93999430ddkf' });
      expect(await addRecipe(TEST_RECIPE)).toBe('Hiir00r93999430ddkf');
    });
  });

  describe('get recipe', () => {
    it('finds the recipe in the list', async () => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_RECIPES));
      const { getRecipe } = useRecipesData();
      expect(await getRecipe(TEST_RECIPES[2]?.id || '')).toEqual(TEST_RECIPES[2]);
    });

    it('goes to the database if the recipe is not in the list', async () => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_RECIPES));
      const { getRecipe } = useRecipesData();
      expect(await getRecipe('4885298slasdfk')).toBeNull();
      expect(doc).toHaveBeenCalledExactlyOnceWith({ id: 42, name: 'my fake fire store' }, 'recipes', '4885298slasdfk');
      expect(getDoc).toHaveBeenCalledExactlyOnceWith('42:doc:recipes:4885298slasdfk');
    });

    it('resolves the recipe from the database if found', async () => {
      (useCollection as Mock).mockReturnValueOnce(ref(TEST_RECIPES));
      (getDoc as Mock).mockResolvedValueOnce({
        exists: vi.fn().mockReturnValue(true),
        data: vi.fn().mockReturnValue(TEST_RECIPE),
      });
      const { getRecipe } = useRecipesData();
      expect(await getRecipe('4885298slasdfk')).toEqual({ ...TEST_RECIPE, id: '4885298slasdfk' });
    });
  });

  describe('remove recipe', () => {
    it('obtains a reference to the doc', () => {
      const { removeRecipe } = useRecipesData();
      removeRecipe('993-39594-4323');
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'recipes/993-39594-4323');
    });

    it('deletes the document', () => {
      const { removeRecipe } = useRecipesData();
      removeRecipe('993-39594-4323');
      expect(deleteDoc).toHaveBeenCalledOnce();
      expect(deleteDoc).toHaveBeenCalledWith('42:doc:recipes/993-39594-4323');
    });
  });

  describe('update recipe', () => {
    it('obtains a reference to the doc', () => {
      const { updateRecipe } = useRecipesData();
      updateRecipe({
        id: '43334-22343-893',
        ...TEST_RECIPE,
      });
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'recipes/43334-22343-893');
    });

    it('updates the recipe document', () => {
      const { updateRecipe } = useRecipesData();
      updateRecipe({
        id: '43334-22343-893',
        ...TEST_RECIPE,
        calories: 600,
        sodium: 800,
        servings: 15,
      });
      expect(updateDoc).toHaveBeenCalledOnce();
      expect(updateDoc).toHaveBeenCalledWith('42:doc:recipes/43334-22343-893', {
        ...TEST_RECIPE,
        calories: 600,
        sodium: 800,
        servings: 15,
      });
    });
  });
});
