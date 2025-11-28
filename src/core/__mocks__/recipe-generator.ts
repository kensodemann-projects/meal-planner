import { vi } from 'vitest';

const generate = vi.fn().mockResolvedValue('{}');

export const useRecipeGenerator: () => { generate: () => Promise<string> } = () => {
  return {
    generate,
  };
};
