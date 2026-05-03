import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser, useFirebaseAuth } from 'vuefire';
import { useAuthentication } from '../authentication';

vi.mock('vuefire');
vi.mock('firebase/auth', async () => {
  const actual = (await vi.importActual('firebase/auth')) as any;
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
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

    it('throws if Firebase Auth is undefined', async () => {
      (useFirebaseAuth as Mock).mockReturnValue(undefined);
      const { login } = useAuthentication();
      await expect(login('test@test.com', 'password')).rejects.toThrow('Failed to instantiate Firebase Auth');
    });

    it('propagates the exception on failed login', async () => {
      (signInWithEmailAndPassword as Mock).mockRejectedValue(new Error('auth/invalid-credential'));
      const { login } = useAuthentication();
      await expect(login('test@test.com', 'wrongpassword')).rejects.toThrow('auth/invalid-credential');
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      (useFirebaseAuth as Mock).mockReturnValue(auth);
    });

    it('signs out', async () => {
      const { logout } = useAuthentication();
      await logout();
      expect(signOut).toHaveBeenCalledExactlyOnceWith(auth);
    });

    it('throws if Firebase Auth is undefined', async () => {
      (useFirebaseAuth as Mock).mockReturnValue(undefined);
      const { logout } = useAuthentication();
      await expect(logout()).rejects.toThrow('Failed to instantiate Firebase Auth');
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

  describe('sendPasswordReset', () => {
    beforeEach(() => {
      (useFirebaseAuth as Mock).mockReturnValue(auth);
    });

    it('sends a password reset', async () => {
      const { sendPasswordReset } = useAuthentication();
      await sendPasswordReset('test@testy.com');
      expect(sendPasswordResetEmail).toHaveBeenCalledExactlyOnceWith(auth, 'test@testy.com');
    });

    it('throws if Firebase Auth is undefined', async () => {
      (useFirebaseAuth as Mock).mockReturnValue(undefined);
      const { sendPasswordReset } = useAuthentication();
      await expect(sendPasswordReset('test@testy.com')).rejects.toThrow('Failed to instantiate Firebase Auth');
    });
  });
});
