/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Meal, MealType, PlannedMealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
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

  const createMealsWithoutItem = (meals: Meal[], plannedMealItem: PlannedMealItem): Meal[] => {
    const newMeals = meals.map((meal) => ({
      ...meal,
      items: meal.items.filter((item) => item.id !== plannedMealItem.mealItem.id),
    }));
    return newMeals.filter((meal) => meal.items.length > 0);
  };

  const addMealItemToMealPlan = async (plannedMealItem: PlannedMealItem): Promise<void> => {
    const mealPlan = await getMealPlanForDate(plannedMealItem.mealDate);

    if (mealPlan?.id) {
      const meals = createMealsWithNewItem(mealPlan.meals, plannedMealItem);
      await updateMealPlan(mealPlan.id, { date: mealPlan.date, meals });
    } else {
      await addMealPlan({
        date: plannedMealItem.mealDate,
        meals: [
          {
            id: globalThis.crypto.randomUUID(),
            type: plannedMealItem.mealType,
            items: [{ ...plannedMealItem.mealItem }],
          },
        ],
      });
    }
  };

  const updateMealItemInMealPlan = async (
    mealItem: PlannedMealItem,
    originalMealDate: string,
    originalMealType: MealType,
  ): Promise<void> => {
    if (originalMealDate === mealItem.mealDate && originalMealType === mealItem.mealType) {
      const mealPlan = await getMealPlanForDate(mealItem.mealDate);
      if (mealPlan?.id) {
        const meals = mealPlan.meals.map((meal) =>
          meal.type === mealItem.mealType
            ? {
                ...meal,
                items: meal.items.map((item) => (item.id === mealItem.mealItem.id ? { ...mealItem.mealItem } : item)),
              }
            : { ...meal },
        );
        await updateMealPlan(mealPlan.id, { date: mealPlan.date, meals });
      }
    } else if (originalMealDate !== mealItem.mealDate) {
      // await removeMealItemFromMealPlan(mealItem.mealItem.id);
      // await addMealItemToMealPlan(mealItem);
    } else {
      const mealPlan = await getMealPlanForDate(mealItem.mealDate);
      if (mealPlan?.id) {
        const meals = createMealsWithNewItem(createMealsWithoutItem(mealPlan.meals, mealItem), mealItem);
        await updateMealPlan(mealPlan.id, { date: mealPlan.date, meals });
      }
    }
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
    removeMealPlan,
    updateMealPlan,
    updateMealItemInMealPlan,
  };
};
