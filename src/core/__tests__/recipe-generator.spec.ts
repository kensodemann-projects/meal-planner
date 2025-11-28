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

import { useRecipeGenerator } from '../recipe-generator';

describe('use recipe generator', () => {
  const mockRecipeJson = {
    name: 'Denver Omelet',
    description: 'A delicious breakfast omelet',
    category: 'Breakfast',
    difficulty: 'Easy',
    calories: 350,
    sodium: 450,
    sugar: 2,
    totalCarbs: 5,
    fat: 25,
    protein: 24,
    ingredients: [
      { units: 3, unitOfMeasure: 'item', name: 'eggs' },
      { units: 0.25, unitOfMeasure: 'c', name: 'diced ham' },
    ],
    steps: ['Beat eggs', 'Cook in pan'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('calls the AI model to generate content', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockRecipeJson) },
      });
      const { generate } = useRecipeGenerator();
      await generate();
      expect(mockGenerateContent).toHaveBeenCalledOnce();
    });

    it('returns the recipe JSON when response has no markdown', async () => {
      const jsonString = JSON.stringify(mockRecipeJson);
      mockGenerateContent.mockResolvedValue({
        response: { text: () => jsonString },
      });
      const { generate } = useRecipeGenerator();
      const result = await generate();
      expect(result).toBe(jsonString);
    });

    it('extracts JSON from markdown code blocks', async () => {
      const jsonString = JSON.stringify(mockRecipeJson);
      const markdownResponse = '```json\n' + jsonString + '\n```';
      mockGenerateContent.mockResolvedValue({
        response: { text: () => markdownResponse },
      });
      const { generate } = useRecipeGenerator();
      const result = await generate();
      expect(result).toBe(jsonString);
    });

    it('handles markdown code blocks with extra whitespace', async () => {
      const jsonString = JSON.stringify(mockRecipeJson);
      const markdownResponse = '  ```json  \n' + jsonString + '\n  ```  ';
      mockGenerateContent.mockResolvedValue({
        response: { text: () => markdownResponse },
      });
      const { generate } = useRecipeGenerator();
      const result = await generate();
      expect(result).toBe(jsonString);
    });

    it('throws error when AI backend fails', async () => {
      const errorMessage = 'AI service unavailable';
      mockGenerateContent.mockRejectedValue(new Error(errorMessage));
      const { generate } = useRecipeGenerator();
      await expect(generate()).rejects.toThrow(errorMessage);
    });

    it('propagates network errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network error'));
      const { generate } = useRecipeGenerator();
      await expect(generate()).rejects.toThrow('Network error');
    });
  });
});
