import { TEST_SOURCES } from '@/data/__tests__/test-data';
import type { Recipe } from '@/models/recipe';
import type { Source } from '@/models/source';
import { getGenerativeModel } from 'firebase/ai';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { findUnitOfMeasure } from '../find-unit-of-measure';
import { useNutritionGenerator, type NutritionPromptRecipe } from '../nutrition-generator';

const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('firebase/ai', () => ({
  getGenerativeModel: vi.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  }),
}));

vi.mock('../firebase-app', () => ({
  useFirebaseApp: vi.fn().mockReturnValue({
    aiBackend: { name: 'mock-ai-backend' },
  }),
}));

const mockRecipe: Recipe = {
  id: 'recipe-1',
  name: 'Grilled Chicken',
  description: 'Simple grilled chicken breast',
  kind: 'homemade',
  category: 'Poultry',
  cuisine: 'American',
  difficulty: 'Easy',
  servings: 4,
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  calories: 0,
  sodium: 0,
  fat: 0,
  protein: 0,
  carbs: 0,
  sugar: 0,
  ingredients: [{ id: 'ing-1', units: 4, unitOfMeasure: findUnitOfMeasure('item'), name: 'chicken breasts' }],
  steps: [{ id: 'step-1', instruction: 'Grill chicken for 20 minutes' }],
};

const withoutOptionalContext = (recipe: Recipe): NutritionPromptRecipe => ({
  ...recipe,
  description: null,
  category: undefined,
  cuisine: undefined,
});

const mockNutrition = {
  calories: 250,
  sodium: 75,
  fat: 5,
  protein: 47,
  carbs: 0,
  sugar: 0,
};

describe('use nutrition generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generate nutrition data', () => {
    it('calls the AI model to generate content', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      expect(mockGenerateContent).toHaveBeenCalledOnce();
    });

    it('includes the recipe name in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain(
        JSON.stringify({ name: mockRecipe.name, ingredients: mockRecipe.ingredients, steps: mockRecipe.steps }),
      );
      expect(prompt).not.toContain('I am making');
    });

    it('keeps an injected homemade name only inside the recipe JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const recipe = { ...mockRecipe, name: 'ZZZ-INJECTED-NAME' };
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(recipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      const payload = JSON.stringify({ name: recipe.name, ingredients: recipe.ingredients, steps: recipe.steps });
      expect(prompt.replace(payload, '')).not.toContain('ZZZ-INJECTED-NAME');
    });

    it('includes the number of servings in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain(String(mockRecipe.servings));
    });

    it('includes ingredient names in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain(
        JSON.stringify({ name: mockRecipe.name, ingredients: mockRecipe.ingredients, steps: mockRecipe.steps }),
      );
      expect(prompt).toContain(mockRecipe.ingredients[0]!.name);
    });

    it('includes the preparation steps in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain(
        JSON.stringify({ name: mockRecipe.name, ingredients: mockRecipe.ingredients, steps: mockRecipe.steps }),
      );
      expect(prompt).toContain('Grill chicken for 20 minutes');
    });

    it('includes description, category, and cuisine when they are set', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain('Simple grilled chicken breast');
      expect(prompt).toContain('Category');
      expect(prompt).toContain('Poultry');
      expect(prompt).toContain('Cuisine');
      expect(prompt).toContain('American');
    });

    it('omits description, category, and cuisine when they are absent', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      const recipe = withoutOptionalContext(mockRecipe);
      await generateNutritionData(recipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).not.toContain('Category');
      expect(prompt).not.toContain('Cuisine');
      expect(prompt).not.toMatch(/description/i);
      expect(prompt).toContain(String(recipe.servings));
      expect(prompt).toContain(
        JSON.stringify({ name: recipe.name, ingredients: recipe.ingredients, steps: recipe.steps }),
      );
    });

    it('initializes the Gemini model lazily inside the composable', () => {
      useNutritionGenerator();
      expect(getGenerativeModel).toHaveBeenCalledOnce();
      const modelParams = vi.mocked(getGenerativeModel).mock.calls[0]![1];
      if (!modelParams || !('systemInstruction' in modelParams) || typeof modelParams.systemInstruction !== 'string') {
        throw new Error('expected a string system instruction');
      }
      expect(modelParams.systemInstruction).toContain('calories');
      expect(modelParams.systemInstruction).toContain('sodium');
      expect(modelParams.systemInstruction).toContain('sugar');
      expect(modelParams.systemInstruction).toContain('carbs');
      expect(modelParams.systemInstruction).toContain('fat');
      expect(modelParams.systemInstruction).toContain('protein');
      expect(modelParams.systemInstruction).not.toContain('list of ingredients');
      expect(modelParams.systemInstruction).not.toContain('steps to prepare');
      expect(modelParams.systemInstruction).toContain('per-serving nutritional breakdown');
    });

    it('returns the parsed nutrition when the response is plain JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      const result = await generateNutritionData(mockRecipe);
      expect(result).toEqual(mockNutrition);
    });

    it('extracts and parses JSON from markdown code blocks', async () => {
      const markdownResponse = '```json\n' + JSON.stringify(mockNutrition) + '\n```';
      mockGenerateContent.mockResolvedValue({
        response: { text: () => markdownResponse },
      });
      const { generateNutritionData } = useNutritionGenerator();
      const result = await generateNutritionData(mockRecipe);
      expect(result).toEqual(mockNutrition);
    });

    it('handles markdown code blocks with extra whitespace', async () => {
      const markdownResponse = '  ```json  \n' + JSON.stringify(mockNutrition) + '\n  ```  ';
      mockGenerateContent.mockResolvedValue({
        response: { text: () => markdownResponse },
      });
      const { generateNutritionData } = useNutritionGenerator();
      const result = await generateNutritionData(mockRecipe);
      expect(result).toEqual(mockNutrition);
    });

    it('throws when the AI backend fails', async () => {
      mockGenerateContent.mockRejectedValue(new Error('AI service unavailable'));
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('AI service unavailable');
    });

    it('propagates network errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network error'));
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Network error');
    });

    it('throws when the AI returns malformed JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'this is not valid JSON {{ bad }}' },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow(SyntaxError);
    });

    it('accepts zero and fractional nutrition values', async () => {
      const nutrition = { calories: 0, sodium: 0, sugar: 0, carbs: 0, fat: 0, protein: 1.5 };
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(nutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).resolves.toEqual(nutrition);
    });

    it('rejects a string calorie value', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify({ ...mockNutrition, calories: '250' }) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('rejects a missing protein field', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              calories: mockNutrition.calories,
              sodium: mockNutrition.sodium,
              fat: mockNutrition.fat,
              carbs: mockNutrition.carbs,
              sugar: mockNutrition.sugar,
            }),
        },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('rejects null', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'null' },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('rejects a negative fat value', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify({ ...mockNutrition, fat: -1 }) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('rejects NaN in JSON text as a syntax error', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => '{"calories":NaN,"sodium":0,"sugar":0,"carbs":0,"fat":0,"protein":0}' },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow(SyntaxError);
    });

    it('rejects Infinity', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => '{"calories":1e999,"sodium":0,"sugar":0,"carbs":0,"fat":0,"protein":0}' },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('rejects a JSON array', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify([mockNutrition]) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('rejects a JSON string', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify('not-nutrition') },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(mockRecipe)).rejects.toThrow('Invalid nutrition response');
    });

    it('returns only the six nutrition fields', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify({ ...mockNutrition, note: 'estimate' }) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      const result = await generateNutritionData(mockRecipe);
      expect(result).toEqual(mockNutrition);
      expect(result).not.toHaveProperty('note');
    });
  });

  describe('prepared recipes with a named source', () => {
    const cookUnity = TEST_SOURCES.find((source) => source.id === 'fiie002934009ser')!;
    const bistroMd = TEST_SOURCES.find((source) => source.name === 'BistroMD')!;

    const preparedRecipe: Recipe = {
      ...mockRecipe,
      id: 'prepared-harissa',
      name: 'Harissa Chicken',
      description: 'Spicy harissa chicken with roasted vegetables',
      kind: 'prepared',
      sourceId: cookUnity.id,
      category: 'Poultry',
      cuisine: 'Mediterranean',
      servings: 2,
      ingredients: [],
      steps: [],
    };

    beforeEach(() => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
    });

    const promptFor = async (recipe: NutritionPromptRecipe, source?: Source) => {
      const { generateNutritionData } = useNutritionGenerator();
      const result = await generateNutritionData(recipe, source);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      return { prompt, result };
    };

    it('asks for published nutrition for that source and still parses the six-number JSON', async () => {
      const { prompt, result } = await promptFor(preparedRecipe, cookUnity);
      expect(prompt).toContain(JSON.stringify({ name: preparedRecipe.name }));
      expect(prompt).toContain('CookUnity');
      expect(prompt).toContain('ready-to-eat');
      expect(prompt).toContain('published');
      expect(prompt).toContain('best estimate');
      expect(prompt).toContain('https://www.cookunity.com/');
      expect(prompt).not.toContain('"ingredients"');
      expect(prompt).not.toContain('"steps"');
      expect(result).toEqual(mockNutrition);
    });

    it('includes servings and, when set, description, category, and cuisine', async () => {
      const { prompt } = await promptFor(preparedRecipe, cookUnity);
      expect(prompt).toContain(String(preparedRecipe.servings));
      expect(prompt).toContain('Spicy harissa chicken with roasted vegetables');
      expect(prompt).toContain('Category');
      expect(prompt).toContain('Poultry');
      expect(prompt).toContain('Cuisine');
      expect(prompt).toContain('Mediterranean');
    });

    it('sends only the item name in the recipe JSON', async () => {
      const { prompt } = await promptFor(preparedRecipe, cookUnity);
      const payload = JSON.stringify({ name: preparedRecipe.name });
      expect(prompt).toContain(payload);
      // the following ensures the recipe.name is not injected anywhere else in the prompt
      expect(prompt.replace(payload, '')).not.toContain(preparedRecipe.name);
      expect(prompt).not.toContain('"ingredients"');
      expect(prompt).not.toContain('"steps"');
    });

    it('omits the source URL when the source has none', async () => {
      const { prompt } = await promptFor(preparedRecipe, bistroMd);
      expect(prompt).toContain('BistroMD');
      expect(prompt).not.toContain('http');
    });

    it('omits a blank source URL', async () => {
      const { prompt } = await promptFor(preparedRecipe, { ...cookUnity, url: '   ' });
      expect(prompt).toContain('CookUnity');
      expect(prompt).not.toContain('http');
    });

    it('omits description, category, and cuisine when they are absent', async () => {
      const recipe = withoutOptionalContext(preparedRecipe);
      const { prompt } = await promptFor(recipe, cookUnity);
      expect(prompt).not.toContain('Category');
      expect(prompt).not.toContain('Cuisine');
      expect(prompt).not.toMatch(/description/i);
      expect(prompt).toContain(String(recipe.servings));
      expect(prompt).toContain(JSON.stringify({ name: recipe.name }));
      expect(prompt).not.toContain('"ingredients"');
      expect(prompt).not.toContain('"steps"');
    });

    it('rejects a prepared recipe when no source is provided and does not call the model', async () => {
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(preparedRecipe)).rejects.toThrow('A prepared recipe requires a source');
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });
  });

  describe('prepared recipes from Generic Restaurant', () => {
    const genericRestaurant = {
      ...TEST_SOURCES.find((source) => source.id === 'restaurant')!,
      url: 'https://example.com/ignored-restaurant-url',
    };
    const cookUnity = TEST_SOURCES.find((source) => source.id === 'fiie002934009ser')!;

    const preparedRecipe: Recipe = {
      ...mockRecipe,
      id: 'prepared-harissa',
      name: 'Harissa Chicken',
      description: 'Spicy harissa chicken with roasted vegetables',
      kind: 'prepared',
      sourceId: genericRestaurant.id,
      category: 'Poultry',
      cuisine: 'Mediterranean',
      servings: 2,
      ingredients: [],
      steps: [],
    };

    beforeEach(() => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
    });

    const promptFor = async (recipe: NutritionPromptRecipe, source?: Source) => {
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(recipe, source);
      return mockGenerateContent.mock.calls[0]![0] as string;
    };

    it('asks for a typical restaurant serving and ignores the source name and URL', async () => {
      const prompt = await promptFor(preparedRecipe, genericRestaurant);
      expect(prompt).toContain(JSON.stringify({ name: preparedRecipe.name }));
      expect(prompt).toContain('typical restaurant serving');
      expect(prompt).toContain('unless the dish name');
      expect(prompt).toContain(String(preparedRecipe.servings));
      expect(prompt).toContain('Spicy harissa chicken with roasted vegetables');
      expect(prompt).toContain('Category');
      expect(prompt).toContain('Poultry');
      expect(prompt).toContain('Cuisine');
      expect(prompt).toContain('Mediterranean');
      expect(prompt).not.toContain('Generic Restaurant');
      expect(prompt).not.toContain('published');
      expect(prompt).not.toContain('"ingredients"');
      expect(prompt).not.toContain('"steps"');
      expect(prompt).not.toContain('https://example.com/ignored-restaurant-url');
    });

    it('omits description, category, and cuisine when they are absent', async () => {
      const recipe = withoutOptionalContext(preparedRecipe);
      const prompt = await promptFor(recipe, genericRestaurant);
      expect(prompt).not.toContain('Category');
      expect(prompt).not.toContain('Cuisine');
      expect(prompt).not.toMatch(/description/i);
      expect(prompt).toContain(String(recipe.servings));
      expect(prompt).toContain('typical restaurant serving');
    });

    it('sends a chain-named dish through the same generic prompt', async () => {
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(preparedRecipe, genericRestaurant);
      await generateNutritionData({ ...preparedRecipe, name: 'Burger King Whopper' }, genericRestaurant);
      const harissaPrompt = mockGenerateContent.mock.calls[0]![0] as string;
      const whopperPrompt = mockGenerateContent.mock.calls[1]![0] as string;
      expect(whopperPrompt).toBe(harissaPrompt.replaceAll('Harissa Chicken', 'Burger King Whopper'));
      expect(whopperPrompt).toContain('Burger King Whopper');
      expect(whopperPrompt).toContain('typical restaurant serving');
      expect(whopperPrompt).toContain('unless the dish name');
      expect(whopperPrompt.match(/Burger King/g)).toEqual(['Burger King']);
    });

    it('still asks a named source for published nutrition', async () => {
      const prompt = await promptFor({ ...preparedRecipe, sourceId: cookUnity.id }, cookUnity);
      expect(prompt).toContain('published');
      expect(prompt).toContain('CookUnity');
      expect(prompt).not.toContain('typical restaurant serving');
    });

    it('treats any id other than the generic restaurant id as a named source', async () => {
      const prompt = await promptFor(preparedRecipe, {
        id: 'user-added',
        name: 'Generic Restaurant',
        url: 'https://example.com/not-generic',
      });
      expect(prompt).toContain('published');
      expect(prompt).toContain('Generic Restaurant');
      expect(prompt).toContain('https://example.com/not-generic');
      expect(prompt).not.toContain('typical restaurant serving');
    });
  });
});
