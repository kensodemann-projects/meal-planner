import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCollection, useFirestore } from 'vuefire';
import { useMealPlansData } from '../meal-plans';
import { TEST_MEAL_PLAN, TEST_MEAL_PLANS } from './test-data';

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

describe('Meal Plans Data Service', () => {
  beforeEach(() => {
    (useFirestore as Mock).mockReturnValue({ id: 42, name: 'my fake fire store' });
  });

  afterEach(() => vi.clearAllMocks());

  it('uses the meal plans collection', () => {
    useMealPlansData();
    expect(collection).toHaveBeenCalledOnce();
    expect(collection).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'meal-plans');
  });

  describe('add meal plan', () => {
    it('adds the meal plan doc', () => {
      const { addMealPlan } = useMealPlansData();
      addMealPlan(TEST_MEAL_PLAN);
      expect(addDoc).toHaveBeenCalledOnce();
      expect(addDoc).toHaveBeenCalledWith('42:col:meal-plans', TEST_MEAL_PLAN);
    });

    it('resolves the meal plan ID', async () => {
      const { addMealPlan } = useMealPlansData();
      (addDoc as Mock).mockResolvedValueOnce({ id: 'Hiir00r93999430ddkf' });
      expect(await addMealPlan(TEST_MEAL_PLAN)).toBe('Hiir00r93999430ddkf');
    });
  });

  describe('get meal plan', () => {
    beforeEach(() => {
      const mealPlans = ref(TEST_MEAL_PLANS);
      (mealPlans as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
    });

    it('finds the meal plan in the list', async () => {
      const { getMealPlan } = useMealPlansData();
      await expect(getMealPlan(TEST_MEAL_PLANS[2]?.id || '')).resolves.toEqual(TEST_MEAL_PLANS[2]);
    });

    it('resolves null if the meal plan is not found', async () => {
      const { getMealPlan } = useMealPlansData();
      await expect(getMealPlan('non-existent-id')).resolves.toBeNull();
    });
  });

  describe('get meal plan by date', () => {
    beforeEach(() => {
      const mealPlans = ref(TEST_MEAL_PLANS);
      (mealPlans as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
    });

    it('finds the meal plan in the list by date', async () => {
      const { getMealPlanForDate } = useMealPlansData();
      const targetDate = TEST_MEAL_PLANS[1]?.date || '';
      const foundMealPlan = TEST_MEAL_PLANS.find((mp) => mp.date === targetDate) || null;
      await expect(getMealPlanForDate(targetDate)).resolves.toEqual(foundMealPlan);
    });

    it('resolves null if the meal plan is not found by date', async () => {
      const { getMealPlanForDate } = useMealPlansData();
      await expect(getMealPlanForDate('2099-01-01')).resolves.toBeNull();
    });
  });

  describe('remove meal plan', () => {
    it('obtains a reference to the doc', () => {
      const { removeMealPlan } = useMealPlansData();
      removeMealPlan('993-39594-4323');
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'meal-plans/993-39594-4323');
    });

    it('deletes the document', () => {
      const { removeMealPlan } = useMealPlansData();
      removeMealPlan('993-39594-4323');
      expect(deleteDoc).toHaveBeenCalledOnce();
      expect(deleteDoc).toHaveBeenCalledWith('42:doc:meal-plans/993-39594-4323');
    });
  });

  describe('update meal plan', () => {
    it('obtains a reference to the doc', () => {
      const { updateMealPlan } = useMealPlansData();
      updateMealPlan('43334-22343-893', TEST_MEAL_PLAN);
      expect(doc).toHaveBeenCalledOnce();
      expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, 'meal-plans/43334-22343-893');
    });

    it('updates the meal plan document', () => {
      const { updateMealPlan } = useMealPlansData();
      updateMealPlan('43334-22343-893', TEST_MEAL_PLAN);
      expect(updateDoc).toHaveBeenCalledOnce();
      expect(updateDoc).toHaveBeenCalledWith('42:doc:meal-plans/43334-22343-893', {
        ...TEST_MEAL_PLAN,
      });
    });
  });

  describe('loading state', () => {
    it('exposes the pending state from the collection', () => {
      const mealPlans = ref([]);
      (mealPlans as any).pending = ref(true);
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
      const { loading } = useMealPlansData();
      expect(loading.value).toBe(true);
    });

    it('reflects changes in the pending state', () => {
      const mealPlans = ref([]);
      const pending = ref(false);
      (mealPlans as any).pending = pending;
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
      const { loading } = useMealPlansData();
      expect(loading.value).toBe(false);
      pending.value = true;
      expect(loading.value).toBe(true);
    });
  });

  describe('error state', () => {
    it('exposes the error state from the collection', () => {
      const mealPlans = ref([]);
      const testError = new Error('Test error');
      (mealPlans as any).error = ref(testError);
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
      const { error } = useMealPlansData();
      expect(error.value).toBe(testError);
    });

    it('reflects changes in the error state', () => {
      const mealPlans = ref([]);
      const errorRef = ref<Error | null>(null);
      (mealPlans as any).error = errorRef;
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
      const { error } = useMealPlansData();
      expect(error.value).toBeNull();
      const testError = new Error('Test error');
      errorRef.value = testError;
      expect(error.value).toBe(testError);
    });
  });
});
