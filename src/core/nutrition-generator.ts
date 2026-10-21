import { GENERIC_RESTAURANT_SOURCE_ID } from '@/data/sources';
import type { Nutrition } from '@/models/nutrition';
import type { Recipe } from '@/models/recipe';
import type { Source } from '@/models/source';
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

const namedSourceUserPrompt = (recipe: Recipe, source: Source): string => {
  const url = nonBlank(source.url);
  return [
    `This is a prepared, ready-to-eat item from ${source.name} named ${recipe.name}.`,
    'Prefer published per-serving nutrition. If published numbers are unavailable, use your best estimate.',
    ...(url ? [`Source URL: ${url}.`] : []),
    `Servings: ${recipe.servings}.`,
    ...optionalRecipeContext(recipe),
    'What is the nutritional breakdown per serving?',
  ].join(' ');
};

const genericRestaurantUserPrompt = (recipe: Recipe): string =>
  [
    `Estimate the nutrition for a typical restaurant serving of ${recipe.name}.`,
    'Do not assume a specific restaurant chain unless the dish name clearly includes one.',
    `Servings: ${recipe.servings}.`,
    ...optionalRecipeContext(recipe),
    'What is the nutritional breakdown per serving?',
  ].join(' ');

const userPrompt = (recipe: Recipe, source?: Source): string => {
  if (recipe.kind !== 'prepared') {
    return homemadeUserPrompt(recipe);
  }
  if (!source) {
    throw new Error('A prepared recipe requires a source');
  }
  if (source.id === GENERIC_RESTAURANT_SOURCE_ID) {
    return genericRestaurantUserPrompt(recipe);
  }
  return namedSourceUserPrompt(recipe, source);
};

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

  const generateNutritionData = async (recipe: Recipe, source?: Source): Promise<Nutrition> => {
    const result = await model.generateContent(userPrompt(recipe, source));
    const text = result.response.text();
    return JSON.parse(text.replace(captureJson, '$1')) as Nutrition;
  };

  return { generateNutritionData };
};
