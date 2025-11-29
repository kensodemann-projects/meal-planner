import type { Recipe } from '@/models/recipe';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';

export const useRecipesData = () => {
  const db = useFirestore();
  const path = 'recipes';
  const recipesCollection = collection(db, path);
  const recipes = useCollection(recipesCollection);

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

  const getRecipeFromDatabase = async (id: string): Promise<Recipe | null> => {
    try {
      const snapshot = await getDoc(doc(db, path, id));
      return snapshot.exists() ? { ...(snapshot.data() as Recipe), id } : null;
    } catch {
      return null;
    }
  };

  const getRecipe = async (id: string): Promise<Recipe | null> =>
    (recipes.value.find((f) => f.id === id) as Recipe) || getRecipeFromDatabase(id);

  return { addRecipe, recipes, getRecipe, removeRecipe, updateRecipe };
};
