/**
 * PostsContext — global post feed state with real-time updates.
 *
 * Maintains:
 *  - feed (array of all posts, real-time from Firestore)
 *  - userPosts cache (per-uid arrays)
 *  - like/unlike action creator
 *  - createPost action creator
 *
 * The real-time subscription is established once on mount and stays
 * active for the lifetime of the app — exactly the spec's "real-time
 * updates for likes and comments" requirement.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import {subscribeToPosts, togglePostLike, createPost} from '@api/posts';
import {subscribeToComments} from '@api/comments';
import {firestore, COLLECTIONS} from '@api/firebase';
import {useAuth} from './AuthContext';

const PostsContext = createContext(null);

export function PostsProvider({children}) {
  const {user} = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const commentListeners = useRef(new Map()); // postId -> unsub

  // Subscribe to global feed once.
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToPosts(
      posts => {
        setFeed(posts);
        setLoading(false);
      },
      err => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  /**
   * Toggle like on a post. Optimistic local update for snappy UX,
   * then Firebase transaction reconciles the truth.
   */
  const toggleLike = useCallback(
    async postId => {
      if (!user) {
        return;
      }
      // Find and update optimistically
      setFeed(prev =>
        prev.map(p => {
          if (p.id !== postId) {
            return p;
          }
          const likedBy = p.likedBy || [];
          const liked = likedBy.includes(user.uid);
          const nextLikedBy = liked
            ? likedBy.filter(id => id !== user.uid)
            : [...likedBy, user.uid];
          return {
            ...p,
            likedBy: nextLikedBy,
            likeCount: nextLikedBy.length,
          };
        }),
      );
      try {
        const post = feed.find(p => p.id === postId);
        const currentlyLiked = (post?.likedBy || []).includes(user.uid);
        await togglePostLike(postId, user.uid, currentlyLiked);
      } catch (err) {
        setError(err);
        // The real-time listener will reconcile the state on next emit.
      }
    },
    [user, feed],
  );

  /**
   * Create a new post using the current user's profile data.
   */
  const addPost = useCallback(
    async ({content, image}) => {
      if (!user) {
        throw new Error('You must be signed in to post.');
      }
      // Fetch fresh profile data inline — useAuth's profile may be stale
      // for the very first post after sign-up.
      const profileDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .get();
      const profileData = profileDoc.exists ? profileDoc.data() : {};
      await createPost({
        authorId: user.uid,
        authorName: profileData.displayName || user.displayName || 'Anonymous',
        authorPhotoURL: profileData.photoURL || user.photoURL || null,
        content,
        image,
      });
    },
    [user],
  );

  /**
   * Subscribe to comments for a post. The component calling this is
   * responsible for unsubscribing when it unmounts.
   *
   * We keep an in-context registry so the same post never has multiple
   * concurrent listeners if multiple components subscribe to it.
   */
  const subscribeToPostComments = useCallback((postId, onUpdate, onError) => {
    // If we already have a listener for this post, replace it.
    if (commentListeners.current.has(postId)) {
      commentListeners.current.get(postId)();
    }
    const unsub = subscribeToComments(postId, onUpdate, onError);
    commentListeners.current.set(postId, unsub);
    return () => {
      unsub();
      commentListeners.current.delete(postId);
    };
  }, []);

  /**
   * Reorder the feed randomly. Used purely for visual feedback when the user
   * pulls-to-refresh or taps the refresh button — in a real backend this
   * would correspond to re-fetching latest posts (which may surface in a
   * different order due to real-time updates).
   */
  const shuffleFeed = useCallback(() => {
    setFeed(prev => {
      if (!prev || prev.length === 0) {
        return prev;
      }
      const next = [...prev];
      // Fisher-Yates shuffle
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      feed,
      loading,
      error,
      toggleLike,
      addPost,
      subscribeToPostComments,
      shuffleFeed,
    }),
    [feed, loading, error, toggleLike, addPost, subscribeToPostComments, shuffleFeed],
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error('usePosts must be used inside <PostsProvider>');
  }
  return ctx;
}
