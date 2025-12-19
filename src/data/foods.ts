import type { FoodItem } from '@/models/food';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { computed } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

export const useFoodsData = () => {
  const db = useFirestore();
  const path = 'foods';
  const foodsCollection = collection(db, path);
  const foods = useCollection<FoodItem>(foodsCollection);

  const loading = computed(() => foods.pending.value);
  const error = computed(() => foods.error.value);

  const addFood = async (food: FoodItem): Promise<string> => {
    const item = await addDoc(foodsCollection, food);
    return item.id;
  };

  const removeFood = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, `${path}/${id}`));
  };

  const updateFood = async (food: FoodItem): Promise<void> => {
    const { id, ...fields } = food;
    await updateDoc(doc(db, `${path}/${id}`), fields);
  };

  const getFood = async (id: string): Promise<FoodItem | null> => {
    await foods.promise.value;
    return foods.value.find((f) => f.id === id) || null;
  };

  const fdcFoodItemExists = (fdcId: number): boolean => !!foods.value.find((f) => f.fdcId === fdcId);

  return { addFood, error, fdcFoodItemExists, foods, getFood, loading, removeFood, updateFood };
};
