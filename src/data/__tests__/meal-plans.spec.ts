import type { MealItem, PlannedMealItem } from '@/models/meal';
import { addDoc, collection, deleteDoc, doc, runTransaction, updateDoc, writeBatch } from 'firebase/firestore';
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
    writeBatch: vi.fn().mockImplementation(() => ({
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      commit: vi.fn().mockResolvedValue(undefined),
    })),
    runTransaction: vi.fn(),
    getDocs: vi.fn().mockResolvedValue([]),
    getDoc: vi.fn().mockResolvedValue({ exists: vi.fn().mockResolvedValue(false) }),
    doc: vi.fn().mockImplementation((dbOrCol: any, ...paths: string[]) => {
      if (paths.length === 0) {
        return String(dbOrCol).replace(':col:', ':doc:') + '/new';
      }
      return dbOrCol.id.toString() + ':doc:' + paths.join(':');
    }),
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

  describe('update meal item in meal plan', () => {
    const GENERATED_MEAL_ID = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

    const seedMealPlans = (plans = TEST_MEAL_PLANS) => {
      const mealPlans = ref(structuredClone(plans));
      (mealPlans as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
    };

    const updatedItemFor = (id: string): MealItem => ({
      id,
      name: 'Steel Cut Oats',
      recipeId: 'recipe-updated',
      servings: 2,
      nutrition: {
        calories: 640,
        sodium: 200,
        sugar: 4,
        carbs: 108,
        fat: 12,
        protein: 20,
      },
    });

    beforeEach(() => {
      vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
        GENERATED_MEAL_ID as `${string}-${string}-${string}-${string}-${string}`,
      );
    });

    afterEach(() => {
      vi.mocked(globalThis.crypto.randomUUID).mockRestore();
    });

    describe('when the date and meal type are unchanged', () => {
      const existingPlan = TEST_MEAL_PLANS[0]!;
      const originalItem = existingPlan.meals[0]!.items[0]!;
      const originalMealDate = existingPlan.date;
      const originalMealType = 'Breakfast' as const;
      const updatedItem: MealItem = {
        id: originalItem.id,
        name: 'Steel Cut Oats',
        recipeId: 'recipe-updated',
        servings: 2,
        nutrition: {
          calories: 640,
          sodium: 200,
          sugar: 4,
          carbs: 108,
          fat: 12,
          protein: 20,
        },
      };
      const updated: PlannedMealItem = {
        mealDate: existingPlan.date,
        mealType: 'Breakfast',
        mealItem: updatedItem,
      };

      beforeEach(() => seedMealPlans());

      it('replaces the matching item with the updated fields', async () => {
        const { id, ...planFields } = existingPlan;
        const { updateMealItemInMealPlan } = useMealPlansData();
        await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
        expect(updateDoc).toHaveBeenCalledOnce();
        expect(updateDoc).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
          ...planFields,
          meals: planFields.meals.map((meal) =>
            meal.type === 'Breakfast'
              ? {
                  ...meal,
                  items: meal.items.map((item) => (item.id === originalItem.id ? updatedItem : item)),
                }
              : meal,
          ),
        });
      });

      it('leaves other items and meals unchanged', async () => {
        const { updateMealItemInMealPlan } = useMealPlansData();
        await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
        expect(updateDoc).toHaveBeenCalledOnce();
        const updatedFields = (updateDoc as Mock).mock.calls[0]?.[1];
        const breakfast = updatedFields.meals.find((meal: { type: string }) => meal.type === 'Breakfast');
        expect(breakfast.items).toHaveLength(2);
        expect(breakfast.items.find((item: { id: string }) => item.id === 'item-1-1-2')).toEqual(
          existingPlan.meals[0]!.items[1],
        );
        expect(updatedFields.meals.filter((meal: { type: string }) => meal.type !== 'Breakfast')).toEqual(
          existingPlan.meals.filter((meal) => meal.type !== 'Breakfast'),
        );
      });

      it('does not add or delete a meal plan document', async () => {
        const { updateMealItemInMealPlan } = useMealPlansData();
        await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
        expect(updateDoc).toHaveBeenCalledOnce();
        expect(addDoc).not.toHaveBeenCalled();
        expect(deleteDoc).not.toHaveBeenCalled();
      });
    });

    describe('when the meal type changes on the same date', () => {
      describe('when the destination meal already exists', () => {
        const existingPlan = TEST_MEAL_PLANS[0]!;
        const originalItem = existingPlan.meals[0]!.items[0]!;
        const originalMealDate = existingPlan.date;
        const originalMealType = 'Breakfast' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: existingPlan.date,
          mealType: 'Lunch',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('appends the updated item to the destination meal', async () => {
          const { id, ...planFields } = existingPlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          expect(updateDoc).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) => {
              if (meal.type === 'Breakfast') {
                return { ...meal, items: meal.items.filter((item) => item.id !== originalItem.id) };
              }
              if (meal.type === 'Lunch') {
                return { ...meal, items: [...meal.items, updatedItem] };
              }
              return meal;
            }),
          });
        });

        it('leaves the remaining items on the source meal', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          const updatedFields = (updateDoc as Mock).mock.calls[0]?.[1];
          const breakfast = updatedFields.meals.find((meal: { type: string }) => meal.type === 'Breakfast');
          expect(breakfast.items).toEqual([existingPlan.meals[0]!.items[1]]);
        });

        it('does not add or delete a meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          expect(addDoc).not.toHaveBeenCalled();
          expect(deleteDoc).not.toHaveBeenCalled();
        });
      });

      describe('when the destination meal does not exist', () => {
        const existingPlan = TEST_MEAL_PLANS[1]!;
        const originalItem = existingPlan.meals[0]!.items[0]!;
        const originalMealDate = existingPlan.date;
        const originalMealType = 'Breakfast' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: existingPlan.date,
          mealType: 'Snack',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('adds a new meal of that type containing the updated item', async () => {
          const { id, ...planFields } = existingPlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          expect(updateDoc).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: [
              ...planFields.meals.map((meal) =>
                meal.type === 'Breakfast'
                  ? { ...meal, items: meal.items.filter((item) => item.id !== originalItem.id) }
                  : meal,
              ),
              {
                id: GENERATED_MEAL_ID,
                type: 'Snack',
                items: [updatedItem],
              },
            ],
          });
        });

        it('does not add or delete a meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          expect(addDoc).not.toHaveBeenCalled();
          expect(deleteDoc).not.toHaveBeenCalled();
        });
      });

      describe('when the item was the last in the source meal', () => {
        const existingPlan = TEST_MEAL_PLANS[0]!;
        const originalItem = existingPlan.meals.find((meal) => meal.type === 'Snack')!.items[0]!;
        const originalMealDate = existingPlan.date;
        const originalMealType = 'Snack' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: existingPlan.date,
          mealType: 'Lunch',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('removes the empty source meal from the plan', async () => {
          const { id, ...planFields } = existingPlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          expect(updateDoc).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals
              .filter((meal) => meal.type !== 'Snack')
              .map((meal) => (meal.type === 'Lunch' ? { ...meal, items: [...meal.items, updatedItem] } : meal)),
          });
        });

        it('does not delete the meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          expect(updateDoc).toHaveBeenCalledOnce();
          expect(deleteDoc).not.toHaveBeenCalled();
          expect(addDoc).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the date changes', () => {
      const sourcePlan = TEST_MEAL_PLANS[0]!;
      const destPlan = TEST_MEAL_PLANS[1]!;
      const soloItem: MealItem = {
        id: 'item-solo-1',
        name: 'Solo Lunch',
        recipeId: 'food-test-1',
        servings: 1,
        nutrition: {
          calories: 200,
          sodium: 50,
          sugar: 1,
          carbs: 10,
          fat: 5,
          protein: 15,
        },
      };
      const soloPlan = {
        id: 'mp-solo',
        date: '2025-12-20',
        meals: [{ id: 'meal-solo-1', type: 'Lunch' as const, items: [soloItem] }],
      };

      type MockWriteBatch = {
        update: Mock;
        delete: Mock;
        set: Mock;
        commit: Mock;
      };

      const getWriteBatch = (): MockWriteBatch => {
        expect(writeBatch).toHaveBeenCalledOnce();
        expect(writeBatch).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' });
        return vi.mocked(writeBatch).mock.results[0]!.value as MockWriteBatch;
      };

      const expectNoDirectWrites = () => {
        expect(updateDoc).not.toHaveBeenCalled();
        expect(addDoc).not.toHaveBeenCalled();
        expect(deleteDoc).not.toHaveBeenCalled();
      };

      describe('when a meal plan exists for the new date with that meal type', () => {
        const originalItem = sourcePlan.meals[0]!.items[0]!;
        const originalMealDate = sourcePlan.date;
        const originalMealType = 'Breakfast' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: destPlan.date,
          mealType: 'Breakfast',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('updates the destination meal plan with the updated item', async () => {
          const { id, ...planFields } = destPlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) =>
              meal.type === 'Breakfast' ? { ...meal, items: [...meal.items, updatedItem] } : meal,
            ),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('removes the item from the source meal and leaves remaining items', async () => {
          const { id, ...planFields } = sourcePlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) =>
              meal.type === 'Breakfast'
                ? { ...meal, items: meal.items.filter((item) => item.id !== originalItem.id) }
                : meal,
            ),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('does not add or delete a meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledTimes(2);
          expect(batch.set).not.toHaveBeenCalled();
          expect(batch.delete).not.toHaveBeenCalled();
          expect(batch.commit).toHaveBeenCalledOnce();
          expectNoDirectWrites();
        });
      });

      describe('when a meal plan exists for the new date without that meal type', () => {
        const originalItem = sourcePlan.meals[0]!.items[0]!;
        const originalMealDate = sourcePlan.date;
        const originalMealType = 'Breakfast' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: destPlan.date,
          mealType: 'Snack',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('adds a new meal of that type on the destination plan', async () => {
          const { id, ...planFields } = destPlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: [
              ...planFields.meals,
              {
                id: GENERATED_MEAL_ID,
                type: 'Snack',
                items: [updatedItem],
              },
            ],
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('removes the item from the source meal plan', async () => {
          const { id, ...planFields } = sourcePlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) =>
              meal.type === 'Breakfast'
                ? { ...meal, items: meal.items.filter((item) => item.id !== originalItem.id) }
                : meal,
            ),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('does not add or delete a meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledTimes(2);
          expect(batch.set).not.toHaveBeenCalled();
          expect(batch.delete).not.toHaveBeenCalled();
          expect(batch.commit).toHaveBeenCalledOnce();
          expectNoDirectWrites();
        });
      });

      describe('when no meal plan exists for the new date', () => {
        const originalItem = sourcePlan.meals[0]!.items[0]!;
        const originalMealDate = sourcePlan.date;
        const originalMealType = 'Breakfast' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: '2099-01-01',
          mealType: 'Breakfast',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('adds a new meal plan document for the destination date', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.set).toHaveBeenCalledOnce();
          expect(batch.set).toHaveBeenCalledWith('42:doc:meal-plans/new', {
            date: '2099-01-01',
            meals: [
              {
                id: GENERATED_MEAL_ID,
                type: 'Breakfast',
                items: [updatedItem],
              },
            ],
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('removes the item from the source meal plan', async () => {
          const { id, ...planFields } = sourcePlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledOnce();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) =>
              meal.type === 'Breakfast'
                ? { ...meal, items: meal.items.filter((item) => item.id !== originalItem.id) }
                : meal,
            ),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('does not delete a meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.set).toHaveBeenCalledOnce();
          expect(batch.update).toHaveBeenCalledOnce();
          expect(batch.delete).not.toHaveBeenCalled();
          expect(batch.commit).toHaveBeenCalledOnce();
          expectNoDirectWrites();
        });
      });

      describe('when the item was the last in the source meal', () => {
        const originalItem = sourcePlan.meals.find((meal) => meal.type === 'Snack')!.items[0]!;
        const originalMealDate = sourcePlan.date;
        const originalMealType = 'Snack' as const;
        const updatedItem = updatedItemFor(originalItem.id);
        const updated: PlannedMealItem = {
          mealDate: destPlan.date,
          mealType: 'Breakfast',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans());

        it('removes the empty source meal from the source plan', async () => {
          const { id, ...planFields } = sourcePlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.filter((meal) => meal.type !== 'Snack'),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('updates the destination meal plan with the updated item', async () => {
          const { id, ...planFields } = destPlan;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) =>
              meal.type === 'Breakfast' ? { ...meal, items: [...meal.items, updatedItem] } : meal,
            ),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('does not delete the source meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledTimes(2);
          expect(batch.delete).not.toHaveBeenCalled();
          expect(batch.set).not.toHaveBeenCalled();
          expect(batch.commit).toHaveBeenCalledOnce();
          expectNoDirectWrites();
        });
      });

      describe('when the item was the last on the source plan', () => {
        const originalMealDate = soloPlan.date;
        const originalMealType = 'Lunch' as const;
        const updatedItem = updatedItemFor(soloItem.id);
        const destWithType = TEST_MEAL_PLANS[0]!;
        const updated: PlannedMealItem = {
          mealDate: destWithType.date,
          mealType: 'Lunch',
          mealItem: updatedItem,
        };

        beforeEach(() => seedMealPlans([soloPlan, ...TEST_MEAL_PLANS]));

        it('deletes the source meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.delete).toHaveBeenCalledOnce();
          expect(batch.delete).toHaveBeenCalledWith('42:doc:meal-plans/mp-solo');
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('updates the destination meal plan with the updated item', async () => {
          const { id, ...planFields } = destWithType;
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.update).toHaveBeenCalledOnce();
          expect(batch.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
            ...planFields,
            meals: planFields.meals.map((meal) =>
              meal.type === 'Lunch' ? { ...meal, items: [...meal.items, updatedItem] } : meal,
            ),
          });
          expect(batch.commit).toHaveBeenCalledOnce();
        });

        it('does not add a meal plan document', async () => {
          const { updateMealItemInMealPlan } = useMealPlansData();
          await updateMealItemInMealPlan(updated, originalMealDate, originalMealType);
          const batch = getWriteBatch();
          expect(batch.delete).toHaveBeenCalledOnce();
          expect(batch.update).toHaveBeenCalledOnce();
          expect(batch.set).not.toHaveBeenCalled();
          expect(batch.commit).toHaveBeenCalledOnce();
          expectNoDirectWrites();
        });

        describe('and no meal plan exists for the new date', () => {
          const moved: PlannedMealItem = {
            mealDate: '2099-01-01',
            mealType: 'Lunch',
            mealItem: updatedItem,
          };

          it('deletes the source meal plan and adds a new destination plan', async () => {
            const { updateMealItemInMealPlan } = useMealPlansData();
            await updateMealItemInMealPlan(moved, originalMealDate, originalMealType);
            const batch = getWriteBatch();
            expect(batch.delete).toHaveBeenCalledOnce();
            expect(batch.delete).toHaveBeenCalledWith('42:doc:meal-plans/mp-solo');
            expect(batch.set).toHaveBeenCalledOnce();
            expect(batch.set).toHaveBeenCalledWith('42:doc:meal-plans/new', {
              date: '2099-01-01',
              meals: [
                {
                  id: GENERATED_MEAL_ID,
                  type: 'Lunch',
                  items: [updatedItem],
                },
              ],
            });
            expect(batch.update).not.toHaveBeenCalled();
            expect(batch.commit).toHaveBeenCalledOnce();
            expectNoDirectWrites();
          });
        });
      });
    });
  });

  describe('remove meal item from meal plan', () => {
    type MockTransaction = {
      get: Mock;
      set: Mock;
      update: Mock;
      delete: Mock;
    };

    let transaction: MockTransaction;

    const seedMealPlans = (plans = TEST_MEAL_PLANS) => {
      const mealPlans = ref(structuredClone(plans));
      (mealPlans as any).promise = { value: Promise.resolve() };
      (useCollection as Mock).mockReturnValueOnce(mealPlans);
    };

    const snapshotOf = (plan: { date: string; meals: unknown[] }, exists = true) => ({
      exists: () => exists,
      data: () => (exists ? { date: plan.date, meals: structuredClone(plan.meals) } : undefined),
    });

    const seedTransactionSnapshot = (plan: { date: string; meals: unknown[] }, exists = true) => {
      transaction.get.mockResolvedValue(snapshotOf(plan, exists));
    };

    const getTransaction = (): MockTransaction => {
      expect(runTransaction).toHaveBeenCalledOnce();
      expect(runTransaction).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, expect.any(Function));
      return transaction;
    };

    const expectNoDirectWrites = () => {
      expect(updateDoc).not.toHaveBeenCalled();
      expect(addDoc).not.toHaveBeenCalled();
      expect(deleteDoc).not.toHaveBeenCalled();
    };

    beforeEach(() => {
      transaction = {
        get: vi.fn().mockResolvedValue(snapshotOf({ date: '', meals: [] }, false)),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      };
      vi.mocked(runTransaction).mockImplementation(async (_db, updateFunction) => {
        await updateFunction(transaction);
      });
    });

    describe('when no meal plan exists for the date', () => {
      const plannedMealItem: PlannedMealItem = {
        mealDate: '2099-01-01',
        mealType: 'Breakfast',
        mealItem: TEST_MEAL_PLANS[0]!.meals[0]!.items[0]!,
      };

      beforeEach(() => {
        seedMealPlans();
        vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        vi.mocked(console.error).mockRestore();
      });

      it('does not start a transaction or write a meal plan document', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        expect(runTransaction).not.toHaveBeenCalled();
        expectNoDirectWrites();
      });

      it('logs an error', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        expect(console.error).toHaveBeenCalledExactlyOnceWith('Meal plan not found for date:', '2099-01-01');
      });
    });

    describe('when the meal plan document no longer exists', () => {
      const existingPlan = TEST_MEAL_PLANS[0]!;
      const plannedMealItem: PlannedMealItem = {
        mealDate: existingPlan.date,
        mealType: 'Breakfast',
        mealItem: existingPlan.meals[0]!.items[0]!,
      };

      beforeEach(() => {
        seedMealPlans();
        seedTransactionSnapshot(existingPlan, false);
        vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        vi.mocked(console.error).mockRestore();
      });

      it('does not update or delete the meal plan document', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.update).not.toHaveBeenCalled();
        expect(txn.delete).not.toHaveBeenCalled();
        expectNoDirectWrites();
      });

      it('logs an error', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        expect(console.error).toHaveBeenCalledExactlyOnceWith('Meal plan not found for date:', existingPlan.date);
      });
    });

    describe('when the meal still has remaining items', () => {
      const existingPlan = TEST_MEAL_PLANS[0]!;
      const itemToRemove = existingPlan.meals[0]!.items[0]!;
      const plannedMealItem: PlannedMealItem = {
        mealDate: existingPlan.date,
        mealType: 'Breakfast',
        mealItem: itemToRemove,
      };

      beforeEach(() => {
        seedMealPlans();
        seedTransactionSnapshot(existingPlan);
      });

      it('obtains a reference to the doc and reads it in the transaction', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        expect(doc).toHaveBeenCalledOnce();
        expect(doc).toHaveBeenCalledWith({ id: 42, name: 'my fake fire store' }, `meal-plans/${existingPlan.id}`);
        const txn = getTransaction();
        expect(txn.get).toHaveBeenCalledOnce();
        expect(txn.get).toHaveBeenCalledWith(`42:doc:meal-plans/${existingPlan.id}`);
      });

      it('updates the meal plan without the item', async () => {
        const { id, ...planFields } = existingPlan;
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.update).toHaveBeenCalledOnce();
        expect(txn.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
          date: planFields.date,
          meals: planFields.meals.map((meal) =>
            meal.type === 'Breakfast'
              ? { ...meal, items: meal.items.filter((item) => item.id !== itemToRemove.id) }
              : meal,
          ),
        });
        expectNoDirectWrites();
      });

      it('leaves remaining items and other meals unchanged', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.update).toHaveBeenCalledOnce();
        const updatedFields = txn.update.mock.calls[0]?.[1];
        const breakfast = updatedFields.meals.find((meal: { type: string }) => meal.type === 'Breakfast');
        expect(breakfast.items).toEqual([existingPlan.meals[0]!.items[1]]);
        expect(updatedFields.meals.filter((meal: { type: string }) => meal.type !== 'Breakfast')).toEqual(
          existingPlan.meals.filter((meal) => meal.type !== 'Breakfast'),
        );
      });

      it('does not add or delete a meal plan document', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.update).toHaveBeenCalledOnce();
        expect(txn.delete).not.toHaveBeenCalled();
        expectNoDirectWrites();
      });

      it('applies the removal to the document state read in the transaction', async () => {
        const { id, ...planFields } = existingPlan;
        const extraItem = { ...itemToRemove, id: 'item-concurrent-1', name: 'Concurrent Item' };
        const snapshotMeals = planFields.meals.map((meal) =>
          meal.type === 'Breakfast' ? { ...meal, items: [...meal.items, extraItem] } : meal,
        );
        seedTransactionSnapshot({ date: planFields.date, meals: snapshotMeals });

        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);

        const txn = getTransaction();
        expect(txn.update).toHaveBeenCalledOnce();
        expect(txn.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
          date: planFields.date,
          meals: snapshotMeals.map((meal) =>
            meal.type === 'Breakfast'
              ? { ...meal, items: meal.items.filter((item) => item.id !== itemToRemove.id) }
              : meal,
          ),
        });
      });
    });

    describe('when the item was the last in the meal', () => {
      const existingPlan = TEST_MEAL_PLANS[0]!;
      const itemToRemove = existingPlan.meals.find((meal) => meal.type === 'Snack')!.items[0]!;
      const plannedMealItem: PlannedMealItem = {
        mealDate: existingPlan.date,
        mealType: 'Snack',
        mealItem: itemToRemove,
      };

      beforeEach(() => {
        seedMealPlans();
        seedTransactionSnapshot(existingPlan);
      });

      it('removes the empty meal from the plan', async () => {
        const { id, ...planFields } = existingPlan;
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.update).toHaveBeenCalledOnce();
        expect(txn.update).toHaveBeenCalledWith(`42:doc:meal-plans/${id}`, {
          date: planFields.date,
          meals: planFields.meals.filter((meal) => meal.type !== 'Snack'),
        });
        expectNoDirectWrites();
      });

      it('does not delete the meal plan document', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.update).toHaveBeenCalledOnce();
        expect(txn.delete).not.toHaveBeenCalled();
        expectNoDirectWrites();
      });
    });

    describe('when the item was the last on the plan', () => {
      const soloItem: MealItem = {
        id: 'item-solo-1',
        name: 'Solo Lunch',
        recipeId: 'food-test-1',
        servings: 1,
        nutrition: {
          calories: 200,
          sodium: 50,
          sugar: 1,
          carbs: 10,
          fat: 5,
          protein: 15,
        },
      };
      const soloPlan = {
        id: 'mp-solo',
        date: '2025-12-20',
        meals: [{ id: 'meal-solo-1', type: 'Lunch' as const, items: [soloItem] }],
      };
      const plannedMealItem: PlannedMealItem = {
        mealDate: soloPlan.date,
        mealType: 'Lunch',
        mealItem: soloItem,
      };

      beforeEach(() => {
        seedMealPlans([soloPlan]);
        seedTransactionSnapshot(soloPlan);
      });

      it('deletes the meal plan document', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.delete).toHaveBeenCalledOnce();
        expect(txn.delete).toHaveBeenCalledWith('42:doc:meal-plans/mp-solo');
      });

      it('does not update or add a meal plan document', async () => {
        const { removeMealItemFromMealPlan } = useMealPlansData();
        await removeMealItemFromMealPlan(plannedMealItem);
        const txn = getTransaction();
        expect(txn.delete).toHaveBeenCalledOnce();
        expect(txn.update).not.toHaveBeenCalled();
        expectNoDirectWrites();
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
