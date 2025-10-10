import type { FoodItem } from '@/models';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

export const useFoodsData = () => {
  const db = useFirestore();
  const path = `foods`;
  const foodsCollection = collection(db, path);

  const addFood = async (food: FoodItem): Promise<void> => {
    await addDoc(foodsCollection, food);
  };

  const removeFood = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, `${path}/${id}`));
  };

  const updateFood = async (food: FoodItem): Promise<void> => {
    const { id, ...fields } = food;
    await updateDoc(doc(db, `${path}/${id}`), fields);
  };

  return { addFood, foodsCollection, removeFood, updateFood };
};
