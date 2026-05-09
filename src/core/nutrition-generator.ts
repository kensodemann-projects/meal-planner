import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import { getGenerativeModel } from 'firebase/ai';
import { useFirebaseApp } from './firebase-app';

export const useNutritionGenerator = () => {
  const systemInstruction = `You are an expert dietician. Given the recipe name, list of ingredients, steps to prepare, and the number of servings the recipe makes, you provide a per-serving nutritional breakdown with the following data points:

- calories
- carbs (g)
- sugar (g)
- sodium (mg)
- protein (g)
- fat (g)

Your response must be a JSON object in the following format:
{
  "calories": integer,
  "sodium": integer in milligrams,
  "sugar": integer in grams,
  "carbs": integer in grams,
  "fat": integer in grams,
  "protein": integer in grams
}

You will only respond with the nutrition information JSON without surrounding text.

You will only respond to nutritional information requests.
For other requests, you will respond that you only provide nutritional information.`;

  const { aiBackend } = useFirebaseApp();
  const model = getGenerativeModel(aiBackend, { model: 'gemini-2.5-flash', systemInstruction });
  const captureJson = /^\s*`{3}json\s*(\{.*\})\s*`{3}\s*$/s;

  const generateNutritionData = async (recipe: Recipe): Promise<Nutrition> => {
    const userPrompt = `I am making ${recipe.servings} servings of ${recipe.name}. Here are the ingredients: ${JSON.stringify(recipe.ingredients)}. Here are the steps to prepare: ${JSON.stringify(recipe.steps)}. What is the nutritional breakdown per serving?`;
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    return JSON.parse(text.replace(captureJson, '$1')) as Nutrition;
  };

  return { generateNutritionData };
};
