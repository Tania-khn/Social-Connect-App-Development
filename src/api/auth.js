/**
 * Authentication API layer.
 *
 * Wraps Firebase Auth methods with normalized error messages and
 * keeps user profile data in sync with the `users` Firestore collection.
 */
import {auth, firestore, COLLECTIONS} from './firebase';

/**
 * Sign up a new user with email + password.
 * Also creates a corresponding Firestore user document.
 *
 * @param {object} param0
 * @param {string} param0.email
 * @param {string} param0.password
 * @param {string} param0.displayName
 * @returns {Promise<firebase.User>}
 */
export async function signUpUser({email, password, displayName}) {
  const credential = await auth().createUserWithEmailAndPassword(
    email.trim().toLowerCase(),
    password,
  );

  // Update Firebase Auth profile
  await credential.user.updateProfile({
    displayName,
    photoURL: null,
  });

  // Create Firestore user document
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(credential.user.uid)
    .set({
      uid: credential.user.uid,
      email: email.trim().toLowerCase(),
      displayName,
      bio: '',
      photoURL: null,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

  return credential.user;
}

/**
 * Sign in with email + password.
 * @param {string} email
 * @param {string} password
 */
export async function signInUser(email, password) {
  const credential = await auth().signInWithEmailAndPassword(
    email.trim().toLowerCase(),
    password,
  );
  return credential.user;
}

/**
 * Send a password reset email.
 * @param {string} email
 */
export async function sendPasswordResetEmail(email) {
  await auth().sendPasswordResetEmail(email.trim().toLowerCase());
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser() {
  await auth().signOut();
}

/**
 * Change the current user's password.
 *
 * Firebase requires re-authentication before sensitive operations like
 * password change. We re-authenticate with the current credential, then
 * call updatePassword.
 *
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export async function changeUserPassword(currentPassword, newPassword) {
  const user = auth().currentUser;
  if (!user || !user.email) {
    throw new Error('No authenticated user found.');
  }

  // Re-authenticate with current password
  const credential = auth.EmailAuthProvider.credential(
    user.email,
    currentPassword,
  );
  await user.reauthenticateWithCredential(credential);

  // Update to new password
  await user.updatePassword(newPassword);
}

/**
 * Subscribe to Firebase Auth state changes.
 * @param {(user: firebase.User | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToAuthChanges(callback) {
  return auth().onAuthStateChanged(callback);
}

/**
 * Translate Firebase Auth error codes into user-friendly messages.
 * @param {Error} error
 * @returns {string}
 */
export function translateAuthError(error) {
  const map = {
    'auth/email-already-in-use': 'That email is already registered. Try logging in.',
    'auth/invalid-email': 'That email address looks malformed.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled for this project.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/wrong-password': 'Your current password is incorrect.',
    'auth/requires-recent-login': 'Please sign out and sign back in, then try again.',
  };
  return map[error.code] || error.message || 'Something went wrong. Please try again.';
}
