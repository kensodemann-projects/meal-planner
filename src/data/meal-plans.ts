import type { Meal, MealType, PlannedMealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import { format, startOfWeek, subWeeks } from 'date-fns';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { computed } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

export const useMealPlansData = () => {
  const minDate = format(subWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), 5), 'yyyy-MM-dd');
  const db = useFirestore();
  const path = 'meal-plans';
  const mealPlansCollection = collection(db, path);
  const q = query(mealPlansCollection, where('date', '>=', minDate), orderBy('date'));
  const mealPlans = useCollection<MealPlan>(q);

  const loading = computed(() => mealPlans.pending.value);
  const error = computed(() => mealPlans.error.value);

  const addMealPlan = async (mealPlan: MealPlan): Promise<string> => {
    const item = await addDoc(mealPlansCollection, mealPlan);
    return item.id;
  };

  const removeMealPlan = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, `${path}/${id}`));
  };

  const updateMealPlan = async (id: string, fields: Omit<MealPlan, 'id'>): Promise<void> => {
    await updateDoc(doc(db, `${path}/${id}`), fields);
  };

  const getMealPlan = async (id: string): Promise<MealPlan | null> => {
    await mealPlans.promise.value;
    return mealPlans.value.find((f) => f.id === id) || null;
  };

  const getMealPlanForDate = async (dt: string): Promise<MealPlan | null> => {
    await mealPlans.promise.value;
    return mealPlans.value.find((f) => f.date === dt) || null;
  };

  const getMealPlansForPeriod = async (startDate: string, endDate: string): Promise<MealPlan[]> => {
    await mealPlans.promise.value;
    return mealPlans.value.filter((f) => f.date >= startDate && f.date <= endDate);
  };

  const createMealsWithNewItem = (meals: Meal[], plannedMealItem: PlannedMealItem): Meal[] => {
    const newItem = { ...plannedMealItem.mealItem };
    const newMeals = meals.map((meal) =>
      meal.type === plannedMealItem.mealType ? { ...meal, items: [...meal.items, newItem] } : { ...meal },
    );
    if (!newMeals.some((meal) => meal.type === plannedMealItem.mealType)) {
      newMeals.push({ id: globalThis.crypto.randomUUID(), type: plannedMealItem.mealType, items: [newItem] });
    }
    return newMeals;
  };

  const createMealsWithUpdatedItem = (meals: Meal[], plannedMealItem: PlannedMealItem): Meal[] => {
    const newMeals = meals.map((meal) =>
      meal.type === plannedMealItem.mealType
        ? {
            ...meal,
            items: meal.items.map((item) =>
              item.id === plannedMealItem.mealItem.id ? { ...plannedMealItem.mealItem } : item,
            ),
          }
        : { ...meal },
    );
    return newMeals;
  };

  const createMealsWithoutItem = (meals: Meal[], plannedMealItem: PlannedMealItem): Meal[] => {
    const newMeals = meals.map((meal) => ({
      ...meal,
      items: meal.items.filter((item) => item.id !== plannedMealItem.mealItem.id),
    }));
    return newMeals.filter((meal) => meal.items.length > 0);
  };

  const mealsAreEmpty = (meals: Meal[]): boolean => meals.flatMap((meal) => meal.items).length === 0;

  const addMealItemToMealPlan = async (plannedMealItem: PlannedMealItem): Promise<void> => {
    const mealPlan = await getMealPlanForDate(plannedMealItem.mealDate);
    const meals = createMealsWithNewItem(mealPlan?.meals || [], plannedMealItem);

    if (mealPlan?.id) {
      await updateMealPlan(mealPlan.id, { date: mealPlan.date, meals });
    } else {
      await addMealPlan({
        date: plannedMealItem.mealDate,
        meals,
      });
    }
  };

  const moveMealItemToNewDate = async (sourcePlan: MealPlan, plannedMealItem: PlannedMealItem): Promise<void> => {
    const sourceMeals = createMealsWithoutItem(sourcePlan.meals, plannedMealItem);
    const destPlan = await getMealPlanForDate(plannedMealItem.mealDate);
    const destMeals = createMealsWithNewItem(destPlan?.meals || [], plannedMealItem);
    const batch = writeBatch(db);

    if (mealsAreEmpty(sourceMeals)) {
      batch.delete(doc(db, `${path}/${sourcePlan.id}`));
    } else {
      batch.update(doc(db, `${path}/${sourcePlan.id}`), { date: sourcePlan.date, meals: sourceMeals });
    }

    if (destPlan?.id) {
      batch.update(doc(db, `${path}/${destPlan.id}`), { date: destPlan.date, meals: destMeals });
    } else {
      batch.set(doc(mealPlansCollection), { date: plannedMealItem.mealDate, meals: destMeals });
    }

    await batch.commit();
  };

  const updateMealItemInMealPlan = async (
    plannedMealItem: PlannedMealItem,
    originalMealDate: string,
    originalMealType: MealType,
  ): Promise<void> => {
    const mealPlan = await getMealPlanForDate(originalMealDate);
    if (!mealPlan?.id) {
      console.error('Meal plan not found for date:', originalMealDate);
      return;
    }

    if (originalMealDate !== plannedMealItem.mealDate) {
      await moveMealItemToNewDate(mealPlan, plannedMealItem);
    } else if (originalMealType !== plannedMealItem.mealType) {
      const meals = createMealsWithNewItem(createMealsWithoutItem(mealPlan.meals, plannedMealItem), plannedMealItem);
      await updateMealPlan(mealPlan.id, { date: mealPlan.date, meals });
    } else {
      const meals = createMealsWithUpdatedItem(mealPlan.meals, plannedMealItem);
      await updateMealPlan(mealPlan.id, { date: mealPlan.date, meals });
    }
  };

  const removeMealItemFromMealPlan = async (plannedMealItem: PlannedMealItem): Promise<void> => {
    const mealPlan = await getMealPlanForDate(plannedMealItem.mealDate);
    if (!mealPlan?.id) {
      console.error('Meal plan not found for date:', plannedMealItem.mealDate);
      return;
    }

    const planRef = doc(db, `${path}/${mealPlan.id}`);
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(planRef);
      if (!snapshot.exists()) {
        console.error('Meal plan not found for date:', plannedMealItem.mealDate);
        return;
      }
      const { date, meals: currentMeals } = snapshot.data() as MealPlan;
      const meals = createMealsWithoutItem(currentMeals, plannedMealItem);
      if (mealsAreEmpty(meals)) {
        transaction.delete(planRef);
      } else {
        transaction.update(planRef, { date, meals });
      }
    });
  };

  return {
    addMealPlan,
    addMealItemToMealPlan,
    error,
    mealPlans,
    getMealPlan,
    getMealPlanForDate,
    getMealPlansForPeriod,
    loading,
    removeMealItemFromMealPlan,
    removeMealPlan,
    updateMealPlan,
    updateMealItemInMealPlan,
  };
};
