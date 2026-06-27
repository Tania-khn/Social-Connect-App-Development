/**
 * CommentsScreen — full-screen comments view (alternative to CommentModal).
 *
 * Subscribes to comments in real time and supports both adding and
 * (own-comment) deletion.
 */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';

import CommentItem from '@components/CommentItem';
import EmptyState from '@components/EmptyState';
import {usePosts} from '@contexts/PostsContext';
import {useAuth} from '@contexts/AuthContext';
import {addComment, deleteComment} from '@api/comments';
import {colors, typography, spacing, radii} from '@theme/index';

export default function CommentsScreen() {
  const route = useRoute();
  const post = route.params?.post;
  const {subscribeToPostComments} = usePosts();
  const {user, profile} = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!post?.id) {
      return;
    }
    const unsub = subscribeToPostComments(
      post.id,
      list => {
        setComments(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [post?.id, subscribeToPostComments]);

  const handleSubmit = useCallback(async () => {
    if (!draft.trim() || !user || !post) {
      return;
    }
    setSubmitting(true);
    try {
      await addComment({
        postId: post.id,
        authorId: user.uid,
        authorName: profile?.displayName || user.displayName || 'Anonymous',
        authorPhotoURL: profile?.photoURL || user.photoURL || null,
        content: draft,
      });
      setDraft('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    } finally {
      setSubmitting(false);
    }
  }, [draft, user, profile, post]);

  const handleDelete = useCallback(
    async commentId => {
      try {
        await deleteComment(post.id, commentId);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    },
    [post?.id],
  );

  const renderItem = ({item}) => (
    <CommentItem
      comment={item}
      onAuthorPress={() => {
        /* could navigate to author profile here */
      }}
      onDelete={
        item.authorId === user?.uid ? () => handleDelete(item.id) : undefined
      }
    />
  );

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            ListEmptyComponent={
              <EmptyState
                icon="comment-off-outline"
                title="No comments yet"
                subtitle="Be the first to start the conversation."
              />
            }
            contentContainerStyle={{flexGrow: 1}}
          />
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a comment…"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || !draft.trim()}
            style={[
              styles.sendBtn,
              (!draft.trim() || submitting) && styles.sendBtnDisabled,
            ]}>
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopColor: colors.divider,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    maxHeight: 100,
    minHeight: 40,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
