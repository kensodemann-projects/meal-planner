import type { MealPlan } from '@/models/meal-plan';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { computed } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

export const useMealPlansData = () => {
  const minDate = format(subWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), 4), 'yyyy-MM-dd');
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

  return { addMealPlan, error, mealPlans, getMealPlan, getMealPlanForDate, loading, removeMealPlan, updateMealPlan };
};
