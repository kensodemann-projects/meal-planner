import { getGenerativeModel } from 'firebase/ai';
import { useFirebaseApp } from './firebase-app';
import type { RecipeIngredient } from '@/models/recipe';

const systemInstruction = `You are an expert dietician. Given the list of ingredients in a recipe and the number of servings the recipe makes, you provide a per-serving nutritional breakdown with the following data points:

- calories
- carbs (g)
- sugar (g)
- sodium (mg)
- protein (g)
- fat (g)

Your response must be a JSON object in the following format:
{
  "calories": number,
  "sodium": number in milligrams,
  "sugar": number in grams,
  "totalCarbs": number in grams,
  "fat": number in grams,
  "protein": number in grams,
}

If I forget to give you the number of servings, ask for it.
You will only respond with the nutrition information JSON without surrounding text.

You will only respond to nutritional information requests.
For other requests, you will respond that you only provide nutritional information.`;

// For now, this is just an experiment. I could see this being used for any of the following workflows:
//   1. Generate a recipe matching vague constraints ('Italian Spicy Breakfast Difficult')
//   2. Generating a recipe for a specific food (Denver Omelet)
//   3. Given a list of foods on hand, generate a recipe that uses at least some of that food
//
// Some of these could be other "agents" that are set up. Depending on how the integration with tooling works out,
// one "agent" could be connected to the main database to, for example, generate an initial meal plan or generate
// shopping lists.

const { aiBackend } = useFirebaseApp();
const model = getGenerativeModel(aiBackend, { model: 'gemini-2.5-flash', systemInstruction });
const captureJson = /^\s*`{3}json\s*(\{.*\})\s*`{3}\s*$/s;

const generate = async (ingredients: RecipeIngredient[], servings: number): Promise<string> => {
  const userPrompt = `Here are the ingredients for my recipe, which makes ${servings} servings: ${JSON.stringify(ingredients)}. What is the nutritional breakdown per serving?`;
  const result = await model.generateContent(userPrompt);
  const response = result.response;
  const text = response.text();
  return text.replace(captureJson, '$1');
};

export const useNutritionGenerator = () => ({ generate });
