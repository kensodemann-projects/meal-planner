import type { MealPlan } from '@/models/meal-plan';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { computed } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

export const useMealPlansData = () => {
  const db = useFirestore();
  const path = 'meal-plans';
  const mealPlansCollection = collection(db, path);
  const mealPlans = useCollection<MealPlan>(mealPlansCollection);

  const loading = computed(() => mealPlans.pending.value);
  const error = computed(() => mealPlans.error.value);

  const addMealPlan = async (mealPlan: MealPlan): Promise<string> => {
    const item = await addDoc(mealPlansCollection, mealPlan);
    return item.id;
  };

  const removeMealPlan = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, `${path}/${id}`));
  };

  const updateMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    const { id, ...fields } = mealPlan;
    await updateDoc(doc(db, `${path}/${id}`), fields);
  };

  const getMealPlan = async (id: string): Promise<MealPlan | null> => {
    await mealPlans.promise.value;
    return mealPlans.value.find((f) => f.id === id) || null;
  };

  return { addMealPlan, error, mealPlans, getMealPlan, loading, removeMealPlan, updateMealPlan };
};
