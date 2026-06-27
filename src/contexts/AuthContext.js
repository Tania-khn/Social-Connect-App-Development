/**
 * AuthContext — central auth + current-user-profile state.
 *
 * Subscribes to Firebase Auth state changes AND the current user's
 * Firestore profile document, so any profile edit immediately
 * propagates to every screen that reads `authState.user`.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {auth, firestore, COLLECTIONS} from '@api/firebase';
import {
  subscribeToAuthChanges,
  signInUser,
  signUpUser,
  signOutUser,
  sendPasswordResetEmail,
  translateAuthError,
} from '@api/auth';
import {subscribeToUserProfile} from '@api/users';
import {initNotificationsForUser} from '@api/notifications';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [initializing, setInitializing] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null); // raw firebase user
  const [profile, setProfile] = useState(null); // firestore users/{uid}
  const [error, setError] = useState(null);

  // Subscribe to Firebase Auth state changes — once.
  useEffect(() => {
    const unsub = subscribeToAuthChanges(user => {
      setFirebaseUser(user);
      if (initializing) {
        setInitializing(false);
      }
      if (!user) {
        setProfile(null);
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to Firestore user profile when firebaseUser changes.
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }
    const unsub = subscribeToUserProfile(
      firebaseUser.uid,
      setProfile,
      err => setError(err),
    );
    return unsub;
  }, [firebaseUser]);

  // Initialize FCM notifications once the user is signed in.
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }
    initNotificationsForUser(firebaseUser.uid).catch(() => {
      // Silently ignore — non-critical.
    });
  }, [firebaseUser]);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    try {
      await signInUser(email, password);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const signUp = useCallback(async ({email, password, displayName}) => {
    setError(null);
    try {
      await signUpUser({email, password, displayName});
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async email => {
    setError(null);
    try {
      await sendPasswordResetEmail(email);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await signOutUser();
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      initializing,
      user: firebaseUser,
      profile,
      isAuthenticated: !!firebaseUser,
      error,
      friendlyError: error ? translateAuthError(error) : null,
      signIn,
      signUp,
      signOut,
      resetPassword,
      // Update local profile state immediately after profile edits
      // so the UI doesn't have to wait for the next Firestore emit.
      patchProfile: patch => setProfile(prev => (prev ? {...prev, ...patch} : prev)),
    }),
    [
      initializing,
      firebaseUser,
      profile,
      error,
      signIn,
      signUp,
      signOut,
      resetPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook for consuming the auth context.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

/**
 * Helper to construct the Firestore `users/{uid}` doc reference.
 * Exported so other modules don't have to import firebase + COLLECTIONS directly.
 */
export function userDocRef(uid) {
  return firestore().collection(COLLECTIONS.USERS).doc(uid);
}

// Re-export auth for legacy callers
export {auth};
