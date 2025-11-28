import { getGenerativeModel } from 'firebase/ai';
import { useFirebaseApp } from './firebase-app';

const systemInstruction = `You are an assistant for home cooks. You provide the requested recipes. The request may also include some attributes. These attributes may include items such as:
     - cuisine
     - [breakfast, lunch, dinner]
     - spice level
     - a short list of target ingredients to include

Your response must be a JSON objejct in the following format:
{
  "name": "Name of the recipe",
  "description": "A short description of the recipe",
  "category": "Appetizer | Beverage | Breakfast | Bread | Pasta | Beef | Pork | Lamb | Poultry | Seafood | Vegetarian | Side Dish | Soup | Salad | Sauce | Dessert",
  "difficulty": "Easy | Normal | Advanced",
  "calories": number,
  "sodium": number in milligrams,
  "sugar": number in grams,
  "totalCarbs": number in grams,
  "fat": number in grams,
  "protein": number in grams,
  "ingrients": [{
    "units": number,
    "unitOfMeasure": "c | pint | qt | gal | tsp | tbsp | floz | oz | lb | g | kg | ml | l | pinch | item" (only these, use 'item' if nothing else fits),
    "name": "the name of the ingredient"}],
  "steps": ["string"],
}

For a recipe request, you will only respond with the recipe JSON without surrounding text.

For other requests, you will respond that you only provide recipes. In such cases, provide a link to Gemini chat.`;

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

const generate = async (): Promise<string> => {
  const result = await model.generateContent('I need a recipe for a denver omelet');
  const response = result.response;
  const text = response.text();
  try {
    return text.replace(captureJson, '$1');
  } catch {
    return text;
  }
};

export const useRecipeGenerator = () => ({ generate });
