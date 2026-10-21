import { TEST_SOURCES } from '@/data/__tests__/test-data';
import type { Recipe } from '@/models/recipe';
import { getGenerativeModel } from 'firebase/ai';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { findUnitOfMeasure } from '../find-unit-of-measure';
import { useNutritionGenerator } from '../nutrition-generator';

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
      expect(prompt).toContain(mockRecipe.name);
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
      expect(prompt).toContain('Here are the ingredients');
      expect(prompt).toContain(mockRecipe.ingredients[0]!.name);
    });

    it('includes the preparation steps in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generateNutritionData } = useNutritionGenerator();
      await generateNutritionData(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain('Here are the steps');
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
      const recipe = {
        ...mockRecipe,
        description: null,
        category: undefined,
        cuisine: undefined,
      } as unknown as Recipe;
      await generateNutritionData(recipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).not.toContain('Category');
      expect(prompt).not.toContain('Cuisine');
      expect(prompt).not.toMatch(/description/i);
      expect(prompt).toContain(String(recipe.servings));
      expect(prompt).toContain('Here are the ingredients');
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

    const promptFor = async (recipe: Recipe, source?: (typeof TEST_SOURCES)[number]) => {
      const { generateNutritionData } = useNutritionGenerator();
      const result = await generateNutritionData(recipe, source);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      return { prompt, result };
    };

    it('asks for published nutrition for that source and still parses the six-number JSON', async () => {
      const { prompt, result } = await promptFor(preparedRecipe, cookUnity);
      expect(prompt).toContain('CookUnity');
      expect(prompt).toContain('Harissa Chicken');
      expect(prompt).toContain('ready-to-eat');
      expect(prompt).toContain('published');
      expect(prompt).toContain('best estimate');
      expect(prompt).toContain('https://www.cookunity.com/');
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

    it('does not use the homemade ingredients lead-in', async () => {
      const { prompt } = await promptFor(preparedRecipe, cookUnity);
      expect(prompt).not.toContain('Here are the ingredients');
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
      const recipe = {
        ...preparedRecipe,
        description: null,
        category: undefined,
        cuisine: undefined,
      } as unknown as Recipe;
      const { prompt } = await promptFor(recipe, cookUnity);
      expect(prompt).not.toContain('Category');
      expect(prompt).not.toContain('Cuisine');
      expect(prompt).not.toMatch(/description/i);
      expect(prompt).toContain(String(recipe.servings));
      expect(prompt).not.toContain('Here are the ingredients');
    });

    it('rejects a prepared recipe when no source is provided and does not call the model', async () => {
      const { generateNutritionData } = useNutritionGenerator();
      await expect(generateNutritionData(preparedRecipe)).rejects.toThrow('A prepared recipe requires a source');
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });
  });
});
