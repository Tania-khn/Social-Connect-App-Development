/**
 * Firebase initialization for SocialConnect.
 *
 * Uses @react-native-firebase/* (native modules) which read configuration
 * from the native `google-services.json` (Android) and
 * `GoogleService-Info.plist` (iOS) — NOT from a web config object.
 *
 * If you cloned the repo and haven't added the native config files yet,
 * see `firebase.config.example.js` and the README setup steps.
 */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

/**
 * Enable Firestore offline persistence so the app works without network.
 * In RN Firebase v20, this is configured at initialization time.
 * CACHE_SIZE_UNLIMITED lets Firestore manage its own cache size.
 */
try {
  firestore().settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  });
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Firestore settings could not be applied:', err);
}

export {auth, firestore, storage, messaging};

/**
 * Collection references used across the app.
 * Centralizing them prevents typo-related bugs and makes
 * refactoring collection names trivial.
 */
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
};
