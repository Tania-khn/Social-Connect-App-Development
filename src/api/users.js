/**
 * Users API layer.
 *
 * Handles fetching and updating user profile documents stored
 * in the `users` Firestore collection.
 */
import {firestore, storage, COLLECTIONS} from './firebase';

/**
 * Fetch a user's profile by uid.
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export async function getUserProfile(uid) {
  const snap = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .get();
  return snap.exists ? {uid: snap.id, ...snap.data()} : null;
}

/**
 * Subscribe to a user's profile so UI updates in real time
 * when they (or anyone with permission) edit their profile.
 *
 * @param {string} uid
 * @param {(profile: object|null) => void} onUpdate
 * @param {(error: Error) => void} onError
 */
export function subscribeToUserProfile(uid, onUpdate, onError) {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .onSnapshot(
      snap => {
        onUpdate(snap.exists ? {uid: snap.id, ...snap.data()} : null);
      },
      onError,
    );
}

/**
 * Update a user profile. If a new photo is provided (from
 * react-native-image-picker), upload it to Storage and store the URL.
 *
 * @param {object} param0
 * @param {string} param0.uid
 * @param {string} param0.displayName
 * @param {string} param0.bio
 * @param {object|null} param0.photo - { uri, name } or null
 * @returns {Promise<string|null>} the resulting photoURL
 */
export async function updateUserProfile({uid, displayName, bio, photo}) {
  let photoURL = null;

  if (photo?.uri) {
    const filename = `avatars/${uid}/${Date.now()}-${photo.name || 'avatar.jpg'}`;
    const ref = storage().ref(filename);
    await ref.putFile(photo.uri);
    photoURL = await ref.getDownloadURL();
  }

  const update = {
    displayName,
    bio,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  if (photoURL) {
    update.photoURL = photoURL;
  }

  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .set(update, {merge: true});

  return photoURL;
}

/**
 * Save the FCM token to the user's profile so the server can send
 * push notifications targeted to this device.
 *
 * @param {string} uid
 * @param {string} token
 */
export async function saveUserFcmToken(uid, token) {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .set(
      {
        fcmTokens: firestore.FieldValue.arrayUnion(token),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
}

/**
 * Remove an FCM token when the user signs out on this device.
 * @param {string} uid
 * @param {string} token
 */
export async function removeUserFcmToken(uid, token) {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .set(
      {
        fcmTokens: firestore.FieldValue.arrayRemove(token),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
}

/**
 * Default notification preferences. Used when a user has no
 * preferences doc yet — sensible defaults (everything on except DND).
 */
export const DEFAULT_NOTIFICATION_PREFS = {
  muteAll: false,
  likes: true,
  comments: true,
  newFollowers: true,
  mentions: true,
  directMessages: true,
  emailDigest: false,
  dndStart: '22:00', // Do Not Disturb window (24h)
  dndEnd: '07:00',
};

/**
 * Fetch the current user's notification preferences.
 * Falls back to DEFAULT_NOTIFICATION_PREFS if unset.
 *
 * @param {string} uid
 * @returns {Promise<object>}
 */
export async function getNotificationPrefs(uid) {
  const snap = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection('preferences')
    .doc('notifications')
    .get();
  return snap.exists
    ? {...DEFAULT_NOTIFICATION_PREFS, ...snap.data()}
    : {...DEFAULT_NOTIFICATION_PREFS};
}

/**
 * Subscribe to notification preferences in real time so UI updates
 * instantly if changed from another device.
 *
 * @param {string} uid
 * @param {(prefs: object) => void} onUpdate
 * @param {(error: Error) => void} onError
 */
export function subscribeToNotificationPrefs(uid, onUpdate, onError) {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection('preferences')
    .doc('notifications')
    .onSnapshot(
      snap => {
        onUpdate(
          snap.exists
            ? {...DEFAULT_NOTIFICATION_PREFS, ...snap.data()}
            : {...DEFAULT_NOTIFICATION_PREFS},
        );
      },
      onError,
    );
}

/**
 * Update a single preference key (or a partial object of keys).
 *
 * @param {string} uid
 * @param {object} patch - e.g. {muteAll: true} or {likes: false, comments: false}
 */
export async function updateNotificationPrefs(uid, patch) {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection('preferences')
    .doc('notifications')
    .set(
      {
        ...patch,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
}
