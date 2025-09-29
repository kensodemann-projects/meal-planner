import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth';
import { getCurrentUser, useCurrentUser, useFirebaseAuth } from 'vuefire';

export const useAuthentication = () => {
  const auth = useFirebaseAuth();
  const user = useCurrentUser();

  const isAuthenticated = async (): Promise<boolean> => {
    return !!(await getCurrentUser());
  };

  const login = async (email: string, password: string): Promise<UserCredential | null> => {
    return auth && (await signInWithEmailAndPassword(auth, email, password));
  };

  const logout = async (): Promise<void | null> => {
    return auth && (await signOut(auth));
  };

  const sendPasswordReset = async (email: string): Promise<void | null> => {
    return auth && (await sendPasswordResetEmail(auth, email));
  };

  return { isAuthenticated, login, logout, sendPasswordReset, user };
};
