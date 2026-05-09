import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import type { Recipe } from '@/models/recipe';
import { useNutritionGenerator } from '../nutrition-generator';

const mockRecipe: Recipe = {
  id: 'recipe-1',
  name: 'Grilled Chicken',
  description: 'Simple grilled chicken breast',
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
  ingredients: [{ id: 'ing-1', units: 4, unitOfMeasure: 'item', name: 'chicken breasts' }],
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

  describe('generate', () => {
    it('calls the AI model to generate content', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generate } = useNutritionGenerator();
      await generate(mockRecipe);
      expect(mockGenerateContent).toHaveBeenCalledOnce();
    });

    it('includes the recipe name in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generate } = useNutritionGenerator();
      await generate(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain(mockRecipe.name);
    });

    it('includes the number of servings in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generate } = useNutritionGenerator();
      await generate(mockRecipe);
      const prompt = mockGenerateContent.mock.calls[0]![0] as string;
      expect(prompt).toContain(String(mockRecipe.servings));
    });

    it('returns the parsed nutrition when the response is plain JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockNutrition) },
      });
      const { generate } = useNutritionGenerator();
      const result = await generate(mockRecipe);
      expect(result).toEqual(mockNutrition);
    });

    it('extracts and parses JSON from markdown code blocks', async () => {
      const markdownResponse = '```json\n' + JSON.stringify(mockNutrition) + '\n```';
      mockGenerateContent.mockResolvedValue({
        response: { text: () => markdownResponse },
      });
      const { generate } = useNutritionGenerator();
      const result = await generate(mockRecipe);
      expect(result).toEqual(mockNutrition);
    });

    it('handles markdown code blocks with extra whitespace', async () => {
      const markdownResponse = '  ```json  \n' + JSON.stringify(mockNutrition) + '\n  ```  ';
      mockGenerateContent.mockResolvedValue({
        response: { text: () => markdownResponse },
      });
      const { generate } = useNutritionGenerator();
      const result = await generate(mockRecipe);
      expect(result).toEqual(mockNutrition);
    });

    it('throws when the AI backend fails', async () => {
      mockGenerateContent.mockRejectedValue(new Error('AI service unavailable'));
      const { generate } = useNutritionGenerator();
      await expect(generate(mockRecipe)).rejects.toThrow('AI service unavailable');
    });

    it('propagates network errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network error'));
      const { generate } = useNutritionGenerator();
      await expect(generate(mockRecipe)).rejects.toThrow('Network error');
    });
  });
});
