import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
    beforeEach(() => {
      const recipes = ref(TEST_RECIPES);
      (recipes as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(recipes);
    });

    it('finds the recipe in the list', async () => {
      const { getRecipe } = useRecipesData();
      expect(await getRecipe(TEST_RECIPES[2]?.id || '')).toEqual(TEST_RECIPES[2]);
    });

    it('resolves null if the recipe is not in the list', async () => {
      const { getRecipe } = useRecipesData();
      await expect(getRecipe('non-existent-id')).resolves.toBeNull();
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

  describe('loading state', () => {
    it('exposes the pending state from the collection', () => {
      const recipes = ref([]);
      (recipes as any).pending = ref(true);
      (useCollection as Mock).mockReturnValueOnce(recipes);
      const { loading } = useRecipesData();
      expect(loading.value).toBe(true);
    });

    it('reflects changes in the pending state', () => {
      const recipes = ref([]);
      const pending = ref(false);
      (recipes as any).pending = pending;
      (useCollection as Mock).mockReturnValueOnce(recipes);
      const { loading } = useRecipesData();
      expect(loading.value).toBe(false);
      pending.value = true;
      expect(loading.value).toBe(true);
    });
  });

  describe('error state', () => {
    it('exposes the error state from the collection', () => {
      const recipes = ref([]);
      const testError = new Error('Test error');
      (recipes as any).error = ref(testError);
      (useCollection as Mock).mockReturnValueOnce(recipes);
      const { error } = useRecipesData();
      expect(error.value).toBe(testError);
    });

    it('reflects changes in the error state', () => {
      const recipes = ref([]);
      const errorRef = ref<Error | null>(null);
      (recipes as any).error = errorRef;
      (useCollection as Mock).mockReturnValueOnce(recipes);
      const { error } = useRecipesData();
      expect(error.value).toBeNull();
      const testError = new Error('Test error');
      errorRef.value = testError;
      expect(error.value).toBe(testError);
    });
  });

  describe('recipe matches', () => {
    it('returns true if there are no filter parameters', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: '' })).toBe(true);
      expect(recipeMatches(TEST_RECIPE, {})).toBe(true);
    });

    it('returns false if the recipe does not match the keyword', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'nonexistentkeyword' })).toBe(false);
    });

    it('returns true if the recipe contains the keyword in the name', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'Pan-Seared' })).toBe(true);
      expect(recipeMatches(TEST_RECIPE, { keywords: 'pAN-sEAREd' })).toBe(true);
    });

    it('returns true if the recipe contains the keyword in the description', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'caramelized' })).toBe(true);
      expect(recipeMatches(TEST_RECIPE, { keywords: 'CarAmeliZEd' })).toBe(true);
    });

    it('returns true if the recipe contains the keyword in an ingredient name', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'olive' })).toBe(true);
      expect(recipeMatches(TEST_RECIPE, { keywords: 'OliVE' })).toBe(true);
    });

    it('returns true if the recipe contains the keywords in the name, but not together', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'Pan-Seared sauce' })).toBe(true);
    });

    it('returns true if the recipe contains the keywords in the description, but not together', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'caramelized simple' })).toBe(true);
    });

    it('returns true if the keywords are spread between name, description, and ingredients', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'olive Pan-seared simple' })).toBe(true);
    });

    it('returns false if most but not all keywords match', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { keywords: 'olive bogus Pan-seared simple' })).toBe(false);
    });

    it('returns true if the category matches', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { category: TEST_RECIPE.category })).toBe(true);
    });

    it('returns false if the category does not match', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { category: 'Lamb' })).toBe(false);
    });

    it('returns true if the category and keywords match', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { category: TEST_RECIPE.category, keywords: TEST_RECIPE.name })).toBe(true);
    });

    it('returns false if the category matches but keywords do not', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { category: TEST_RECIPE.category, keywords: 'BogusKeyword' })).toBe(false);
    });

    it('returns true if the cuisine matches', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { cuisine: TEST_RECIPE.cuisine })).toBe(true);
    });

    it('returns false if the cuisine does not match', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { cuisine: 'American' })).toBe(false);
    });

    it('returns true if the cuisine and keywords match', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { cuisine: TEST_RECIPE.cuisine, keywords: TEST_RECIPE.name })).toBe(true);
    });

    it('returns false if the cuisine matches but keywords do not', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { cuisine: TEST_RECIPE.cuisine, keywords: 'BogusKeyword' })).toBe(false);
    });

    it('returns true if the cuisine, category, and keywords match', () => {
      const { recipeMatches } = useRecipesData();
      expect(
        recipeMatches(TEST_RECIPE, {
          cuisine: TEST_RECIPE.cuisine,
          category: TEST_RECIPE.category,
          keywords: TEST_RECIPE.name,
        }),
      ).toBe(true);
    });

    it('returns false if the cuisine and keywords match but not the category', () => {
      const { recipeMatches } = useRecipesData();
      expect(
        recipeMatches(TEST_RECIPE, {
          cuisine: TEST_RECIPE.cuisine,
          category: 'Lamb',
          keywords: TEST_RECIPE.name,
        }),
      ).toBe(false);
    });

    it('returns false if the category and keywords match but not the cuisine', () => {
      const { recipeMatches } = useRecipesData();
      expect(
        recipeMatches(TEST_RECIPE, {
          cuisine: 'American',
          category: TEST_RECIPE.category,
          keywords: TEST_RECIPE.name,
        }),
      ).toBe(false);
    });

    it('returns false if the cuisine and category match but not the keywords', () => {
      const { recipeMatches } = useRecipesData();
      expect(
        recipeMatches(TEST_RECIPE, {
          cuisine: TEST_RECIPE.cuisine,
          category: TEST_RECIPE.category,
          keywords: 'BogusKeyword',
        }),
      ).toBe(false);
    });

    it('returns false if the keyword matches but the category does not', () => {
      const { recipeMatches } = useRecipesData();
      expect(recipeMatches(TEST_RECIPE, { category: 'Lamb', keywords: TEST_RECIPE.name })).toBe(false);
    });
  });
});
