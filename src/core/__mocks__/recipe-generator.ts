import { vi } from 'vitest';

const generate = vi.fn().mockResolvedValue('');

export const useRecipeGenerator: () => any = () => {
  return {
    generate,
  };
};
