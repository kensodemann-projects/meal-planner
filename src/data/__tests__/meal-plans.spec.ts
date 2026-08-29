import type { MealItem, PlannedMealItem } from '@/models/meal';
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

  describe('get meal plans for period', () => {
    beforeEach(() => {
      const mealPlans = ref(TEST_MEAL_PLANS);
      (mealPlans as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
    });

    it('finds the meal plans in the list between the start and end', async () => {
      const { getMealPlansForPeriod } = useMealPlansData();
      await expect(getMealPlansForPeriod(TEST_MEAL_PLANS[1]!.date, TEST_MEAL_PLANS[3]?.date)).resolves.toEqual([
        TEST_MEAL_PLANS[1],
        TEST_MEAL_PLANS[2],
        TEST_MEAL_PLANS[3],
      ]);
    });

    it('resolves [] if the start and end dates are reversed', async () => {
      const { getMealPlansForPeriod } = useMealPlansData();
      await expect(getMealPlansForPeriod(TEST_MEAL_PLANS[3]!.date, TEST_MEAL_PLANS[1]?.date)).resolves.toEqual([]);
    });

    it('resolves [] if there are no meal plans', async () => {
      const { getMealPlansForPeriod } = useMealPlansData();
      await expect(getMealPlansForPeriod('2099-01-01', '2099-01-05')).resolves.toEqual([]);
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

  describe('add meal item to meal plan', () => {
    const GENERATED_MEAL_ID = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
    const TEST_MEAL_ITEM: MealItem = {
      id: 'planned-item-1',
      name: 'Overnight Oats',
      recipeId: '4',
      servings: 1,
      nutrition: {
        calories: 320,
        sodium: 100,
        sugar: 10,
        carbs: 55,
        fat: 8,
        protein: 12,
      },
    };

    const seedMealPlans = (plans = TEST_MEAL_PLANS) => {
      const mealPlans = ref(structuredClone(plans));
      (mealPlans as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
    };

    beforeEach(() => {
      vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
        GENERATED_MEAL_ID as `${string}-${string}-${string}-${string}-${string}`,
      );
    });

    afterEach(() => {
      vi.mocked(globalThis.crypto.randomUUID).mockRestore();
    });

    describe('when no meal plan exists for the date', () => {
      const plannedMealItem: PlannedMealItem = {
        mealDate: '2099-01-01',
        mealType: 'Breakfast',
        mealItem: TEST_MEAL_ITEM,
      };

      beforeEach(() => seedMealPlans());

      it('adds a new meal plan document', async () => {
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(addDoc).toHaveBeenCalledOnce();
        expect(addDoc).toHaveBeenCalledWith('42:col:meal-plans', {
          date: '2099-01-01',
          meals: [
            {
              id: GENERATED_MEAL_ID,
              type: 'Breakfast',
              items: [TEST_MEAL_ITEM],
            },
          ],
        });
      });

      it('does not update an existing document', async () => {
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(updateDoc).not.toHaveBeenCalled();
      });
    });

    describe('when a meal plan exists without that meal type', () => {
      const existingPlan = TEST_MEAL_PLANS[1]!;
      const plannedMealItem: PlannedMealItem = {
        mealDate: existingPlan.date,
        mealType: 'Snack',
        mealItem: TEST_MEAL_ITEM,
      };

      beforeEach(() => seedMealPlans());

      it('obtains a reference to the doc', async () => {
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(doc).toHaveBeenCalledOnce();
        expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, `meal-plans/${existingPlan.id}`);
      });

      it('updates the meal plan with a new meal of that type', async () => {
        const { id, ...planFields } = existingPlan;
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(updateDoc).toHaveBeenCalledOnce();
        expect(updateDoc).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
          ...planFields,
          meals: [
            ...planFields.meals,
            {
              id: GENERATED_MEAL_ID,
              type: 'Snack',
              items: [TEST_MEAL_ITEM],
            },
          ],
        });
      });

      it('does not add a new meal plan document', async () => {
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(addDoc).not.toHaveBeenCalled();
      });
    });

    describe('when a meal plan exists with that meal type', () => {
      const existingPlan = TEST_MEAL_PLANS[0]!;
      const plannedMealItem: PlannedMealItem = {
        mealDate: existingPlan.date,
        mealType: 'Lunch',
        mealItem: TEST_MEAL_ITEM,
      };

      beforeEach(() => seedMealPlans());

      it('appends the item to the existing meal', async () => {
        const { id, ...planFields } = existingPlan;
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(updateDoc).toHaveBeenCalledOnce();
        expect(updateDoc).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
          ...planFields,
          meals: planFields.meals.map((meal) =>
            meal.type === 'Lunch' ? { ...meal, items: [...meal.items, TEST_MEAL_ITEM] } : meal,
          ),
        });
      });

      it('does not add a second meal of that type', async () => {
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(updateDoc).toHaveBeenCalledOnce();
        const updatedFields = (updateDoc as Mock).mock.calls[0]?.[1];
        const lunches = updatedFields.meals.filter((meal: { type: string }) => meal.type === 'Lunch');
        expect(lunches).toHaveLength(1);
      });

      it('does not add a new meal plan document', async () => {
        const { addMealItemToMealPlan } = useMealPlansData();
        await addMealItemToMealPlan(plannedMealItem);
        expect(addDoc).not.toHaveBeenCalled();
      });
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
