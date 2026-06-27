/**
 * Cloud Functions for SocialConnect.
 *
 * Sends push notifications when:
 *  - someone comments on your post
 *  - someone likes your post
 *
 * Deploy: `firebase deploy --only functions`
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Notify the post author when a new comment is created on their post.
 * Skips notifications when the author comments on their own post.
 */
exports.notifyOnComment = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snap, ctx) => {
    const comment = snap.data();
    const postSnap = await admin
      .firestore()
      .doc(`posts/${ctx.params.postId}`)
      .get();
    const post = postSnap.data();
    if (!post || post.authorId === comment.authorId) {
      return null;
    }

    const userSnap = await admin
      .firestore()
      .doc(`users/${post.authorId}`)
      .get();
    const user = userSnap.data();
    const tokens = (user && user.fcmTokens) || [];
    if (tokens.length === 0) {
      return null;
    }

    const message = {
      notification: {
        title: `${comment.authorName} commented on your post`,
        body: comment.content,
      },
      data: {
        type: 'comment',
        postId: ctx.params.postId,
      },
      android: {
        notification: {
          channelId: 'social-connect',
          clickAction: 'OPEN_COMMENTS',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    };

    return admin.messaging().sendEachForMulticast({
      tokens,
      ...message,
    });
  });

/**
 * Notify the post author when someone likes their post.
 * Uses the post document update trigger to detect like additions.
 */
exports.notifyOnLike = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (change, ctx) => {
    const before = change.before.data();
    const after = change.after.data();
    const beforeLikes = (before && before.likedBy) || [];
    const afterLikes = (after && after.likedBy) || [];

    if (afterLikes.length <= beforeLikes.length) {
      return null; // un-like, not a like
    }

    const newLikers = afterLikes.filter(id => !beforeLikes.includes(id));
    if (newLikers.length === 0) {
      return null;
    }

    // Don't notify for self-likes
    const authorId = after.authorId;
    const nonSelfLikers = newLikers.filter(id => id !== authorId);
    if (nonSelfLikers.length === 0) {
      return null;
    }

    // Fetch the first new liker's name
    const likerId = nonSelfLikers[0];
    const likerSnap = await admin
      .firestore()
      .doc(`users/${likerId}`)
      .get();
    const liker = likerSnap.data();
    const likerName = (liker && liker.displayName) || 'Someone';

    const userSnap = await admin
      .firestore()
      .doc(`users/${authorId}`)
      .get();
    const user = userSnap.data();
    const tokens = (user && user.fcmTokens) || [];
    if (tokens.length === 0) {
      return null;
    }

    return admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: `${likerName} liked your post`,
        body: after.content ? truncate(after.content, 80) : '',
      },
      data: {
        type: 'like',
        postId: ctx.params.postId,
      },
      android: {
        notification: {
          channelId: 'social-connect',
          clickAction: 'OPEN_POST',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    });
  });

function truncate(text, max) {
  if (!text) {
    return '';
  }
  if (text.length <= max) {
    return text;
  }
  return text.slice(0, max - 1).trimEnd() + '…';
}
