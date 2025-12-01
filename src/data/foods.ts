import type { FoodItem } from '@/models/food';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';

export const useFoodsData = () => {
  const db = useFirestore();
  const path = 'foods';
  const foodsCollection = collection(db, path);
  const foods = useCollection<FoodItem>(foodsCollection);

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

  const getFoodFromDatabase = async (id: string): Promise<FoodItem | null> => {
    try {
      const snapshot = await getDoc(doc(db, path, id));
      return snapshot.exists() ? { ...(snapshot.data() as FoodItem), id } : null;
    } catch {
      return null;
    }
  };

  const getFood = async (id: string): Promise<FoodItem | null> =>
    foods.value.find((f) => f.id === id) || getFoodFromDatabase(id);

  const fdcFoodItemExists = (fdcId: number): boolean => !!foods.value.find((f) => f.fdcId === fdcId);

  return { addFood, fdcFoodItemExists, foods, getFood, removeFood, updateFood };
};
