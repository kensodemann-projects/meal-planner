import type { Recipe } from '@/models/recipe';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';

export const useRecipesData = () => {
  const db = useFirestore();
  const path = 'recipes';
  const recipesCollection = collection(db, path);
  const recipes = useCollection<Recipe>(recipesCollection);

  const addRecipe = async (recipe: Recipe): Promise<string> => {
    const item = await addDoc(recipesCollection, recipe);
    return item.id;
  };

  const removeRecipe = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, `${path}/${id}`));
  };

  const updateRecipe = async (recipe: Recipe): Promise<void> => {
    const { id, ...fields } = recipe;
    await updateDoc(doc(db, `${path}/${id}`), fields);
  };

  const getRecipe = async (id: string): Promise<Recipe | null> => {
    await recipes.promise.value;
    return recipes.value.find((f) => f.id === id) || null;
  };

  return { addRecipe, recipes, getRecipe, removeRecipe, updateRecipe };
};
