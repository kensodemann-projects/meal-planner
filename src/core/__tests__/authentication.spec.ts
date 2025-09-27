import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser, useFirebaseAuth } from 'vuefire';
import { useAuthentication } from '../authentication';

vi.mock('vuefire');
vi.mock('firebase/auth', async () => {
  const actual = (await vi.importActual('firebase/auth')) as any;
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

describe('use authentication', () => {
  const auth = { name: 'fake auth object' };

  describe('login', () => {
    beforeEach(() => {
      (useFirebaseAuth as Mock).mockReturnValue(auth);
    });

    it('signs in', async () => {
      const { login } = useAuthentication();
      await login('test@test.com', 'password');
      expect(signInWithEmailAndPassword).toHaveBeenCalledExactlyOnceWith(auth, 'test@test.com', 'password');
    });

    it('resolves UserCredential on successful login', async () => {
      const mockUserCredential = { user: { uid: '123' } } as any;
      (signInWithEmailAndPassword as Mock).mockResolvedValue(mockUserCredential);
      const { login } = useAuthentication();
      const result = await login('test@test.com', 'password');
      expect(result).toEqual(mockUserCredential);
    });

    it('resolves null on failed login', async () => {
      (signInWithEmailAndPassword as Mock).mockResolvedValue(null);
      const { login } = useAuthentication();
      const result = await login('test@test.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      (useFirebaseAuth as Mock).mockReturnValue(auth);
    });

    it('signs out', async () => {
      const { logout } = useAuthentication();
      await logout();
      expect(signOut).toHaveBeenCalledOnce();
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  describe('is authenticated', () => {
    it('resolves false if the current user is null', async () => {
      (getCurrentUser as Mock).mockResolvedValue(null);
      const { isAuthenticated } = useAuthentication();
      expect(await isAuthenticated()).toEqual(false);
    });

    it('resolves true if there is a current user', async () => {
      (getCurrentUser as Mock).mockResolvedValue({ email: 'test@testy.com' });
      const { isAuthenticated } = useAuthentication();
      expect(await isAuthenticated()).toEqual(true);
    });
  });
});
