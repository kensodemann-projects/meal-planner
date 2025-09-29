import { vi } from 'vitest';
import { ref } from 'vue';

const isAuthenticated = vi.fn().mockResolvedValue(false);
const login = vi.fn().mockResolvedValue({});
const logout = vi.fn().mockResolvedValue(undefined);
const sendPasswordReset = vi.fn().mockResolvedValue(undefined);

export const useAuthentication = () => {
  return {
    isAuthenticated,
    login,
    logout,
    sendPasswordReset,
    user: ref({ uid: '73-42-31459', name: 'Testy McDefaultTestUser' }),
  };
};
