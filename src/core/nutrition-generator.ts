import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import { getGenerativeModel } from 'firebase/ai';
import { useFirebaseApp } from './firebase-app';

const nonBlank = (value: string | null | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const optionalRecipeContext = (recipe: Recipe): string[] => {
  const description = nonBlank(recipe.description);
  const category = nonBlank(recipe.category);
  const cuisine = nonBlank(recipe.cuisine);
  const lines: string[] = [];
  if (description) lines.push(`Description: ${description}.`);
  if (category) lines.push(`Category: ${category}.`);
  if (cuisine) lines.push(`Cuisine: ${cuisine}.`);
  return lines;
};

const homemadeUserPrompt = (recipe: Recipe): string =>
  [
    `I am making ${recipe.servings} servings of ${recipe.name}.`,
    `Here are the ingredients: ${JSON.stringify(recipe.ingredients)}.`,
    `Here are the steps to prepare: ${JSON.stringify(recipe.steps)}.`,
    ...optionalRecipeContext(recipe),
    'What is the nutritional breakdown per serving?',
  ].join(' ');

export const useNutritionGenerator = () => {
  // Prepared meals omit ingredients and steps, so the instruction cannot require them on every request.
  const systemInstruction = `You are an expert dietician. You provide a per-serving nutritional breakdown with the following data points:

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
    const result = await model.generateContent(homemadeUserPrompt(recipe));
    const text = result.response.text();
    return JSON.parse(text.replace(captureJson, '$1')) as Nutrition;
  };

  return { generateNutritionData };
};
