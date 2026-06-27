/**
 * Comments API layer.
 *
 * Comments are stored as a subcollection under each post so that
 * deleting a post also cascades to its comments (via Firebase Functions
 * — not implemented here, but the structure supports it).
 */
import {firestore, COLLECTIONS} from './firebase';

/**
 * Subscribe to comments for a given post in real time.
 *
 * @param {string} postId
 * @param {(comments: Array<object>) => void} onUpdate
 * @param {(error: Error) => void} onError
 */
export function subscribeToComments(postId, onUpdate, onError) {
  return firestore()
    .collection(COLLECTIONS.POSTS)
    .doc(postId)
    .collection(COLLECTIONS.COMMENTS)
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      snapshot => {
        const comments = snapshot
          ? snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
          : [];
        onUpdate(comments);
      },
      onError,
    );
}

/**
 * Add a comment to a post. Also atomically increments the parent post's
 * `commentCount` field so the feed can render counts without an extra query.
 *
 * @param {object} param0
 * @param {string} param0.postId
 * @param {string} param0.authorId
 * @param {string} param0.authorName
 * @param {string|null} param0.authorPhotoURL
 * @param {string} param0.content
 */
export async function addComment({
  postId,
  authorId,
  authorName,
  authorPhotoURL,
  content,
}) {
  const postRef = firestore().collection(COLLECTIONS.POSTS).doc(postId);
  const commentsRef = postRef.collection(COLLECTIONS.COMMENTS);

  await firestore().runTransaction(async tx => {
    const postSnap = await tx.get(postRef);
    if (!postSnap.exists) {
      throw new Error('Post no longer exists.');
    }
    const currentCount = postSnap.data().commentCount || 0;

    const newCommentRef = commentsRef.doc();
    tx.set(newCommentRef, {
      authorId,
      authorName,
      authorPhotoURL: authorPhotoURL || null,
      content: content.trim(),
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    tx.update(postRef, {
      commentCount: currentCount + 1,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  });
}

/**
 * Delete a single comment. Decrements parent post count.
 * @param {string} postId
 * @param {string} commentId
 */
export async function deleteComment(postId, commentId) {
  const postRef = firestore().collection(COLLECTIONS.POSTS).doc(postId);
  const commentRef = postRef.collection(COLLECTIONS.COMMENTS).doc(commentId);

  await firestore().runTransaction(async tx => {
    const postSnap = await tx.get(postRef);
    if (!postSnap.exists) {
      return;
    }
    const currentCount = postSnap.data().commentCount || 0;
    tx.delete(commentRef);
    tx.update(postRef, {
      commentCount: Math.max(0, currentCount - 1),
    });
  });
}
