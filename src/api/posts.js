/**
 * Posts API layer.
 *
 * Provides CRUD operations plus real-time subscription helpers
 * built on Firestore onSnapshot listeners.
 */
import {firestore, storage, COLLECTIONS} from './firebase';

/**
 * Subscribe to the global post feed in real time.
 * Orders posts by `createdAt` descending.
 *
 * @param {(posts: Array<object>) => void} onUpdate
 * @param {(error: Error) => void} onError
 * @returns {() => void} unsubscribe function
 */
export function subscribeToPosts(onUpdate, onError) {
  return firestore()
    .collection(COLLECTIONS.POSTS)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(
      snapshot => {
        if (!snapshot) {
          onUpdate([]);
          return;
        }
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        onUpdate(posts);
      },
      onError,
    );
}

/**
 * Subscribe to all posts authored by a specific user.
 *
 * @param {string} userId
 * @param {(posts: Array<object>) => void} onUpdate
 * @param {(error: Error) => void} onError
 */
export function subscribeToUserPosts(userId, onUpdate, onError) {
  return firestore()
    .collection(COLLECTIONS.POSTS)
    .where('authorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const posts = snapshot
          ? snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
          : [];
        onUpdate(posts);
      },
      onError,
    );
}

/**
 * Create a new post. If an image is provided, it is uploaded to Firebase Storage
 * and the resulting URL is attached to the post.
 *
 * @param {object} param0
 * @param {string} param0.authorId
 * @param {string} param0.authorName
 * @param {string|null} param0.authorPhotoURL
 * @param {string} param0.content
 * @param {object|null} param0.image  - { uri, name } from react-native-image-picker
 * @returns {Promise<string>} new post id
 */
export async function createPost({
  authorId,
  authorName,
  authorPhotoURL,
  content,
  image,
}) {
  let imageURL = null;

  if (image?.uri) {
    const filename = `posts/${authorId}/${Date.now()}-${image.name || 'image.jpg'}`;
    const ref = storage().ref(filename);
    await ref.putFile(image.uri);
    imageURL = await ref.getDownloadURL();
  }

  const postRef = await firestore().collection(COLLECTIONS.POSTS).add({
    authorId,
    authorName,
    authorPhotoURL: authorPhotoURL || null,
    content: content.trim(),
    imageURL,
    likeCount: 0,
    likedBy: [],
    commentCount: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return postRef.id;
}

/**
 * Toggle a like on a post for a given user. Uses FieldValue.arrayUnion /
 * arrayRemove so concurrent likes are handled atomically.
 *
 * @param {string} postId
 * @param {string} userId
 * @param {boolean} currentlyLiked
 */
export async function togglePostLike(postId, userId, currentlyLiked) {
  const ref = firestore().collection(COLLECTIONS.POSTS).doc(postId);
  await firestore().runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      return;
    }
    const data = snap.data();
    const likedBy = data.likedBy || [];
    const nextLikedBy = currentlyLiked
      ? likedBy.filter(id => id !== userId)
      : [...likedBy, userId];

    tx.update(ref, {
      likedBy: nextLikedBy,
      likeCount: nextLikedBy.length,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  });
}

/**
 * Delete a post. Only the author should be allowed to call this.
 * @param {string} postId
 */
export async function deletePost(postId) {
  await firestore().collection(COLLECTIONS.POSTS).doc(postId).delete();
}
