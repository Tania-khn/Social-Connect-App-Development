/**
 * CommentModal — bottom-sheet style modal for inline comment viewing/posting.
 *
 * Subscribes to comments in real time via PostsContext.subscribeToPostComments.
 */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentItem from './CommentItem';
import GradientButton from './GradientButton';
import {usePosts} from '@contexts/PostsContext';
import {useAuth} from '@contexts/AuthContext';
import {addComment} from '@api/comments';
import {colors, typography, spacing, radii} from '@theme/index';

export default function CommentModal({visible, post, onClose}) {
  const {subscribeToPostComments} = usePosts();
  const {user, profile} = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible || !post?.id) {
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
  }, [visible, post?.id, subscribeToPostComments]);

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
      console.warn('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  }, [draft, user, profile, post]);

  const renderItem = ({item}) => (
    <CommentItem comment={item} onAuthorPress={() => {}} />
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => (
                <View style={styles.divider} />
              )}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Icon
                    name="comment-off-outline"
                    size={48}
                    color={colors.textMuted}
                  />
                  <Text style={styles.emptyText}>
                    No comments yet. Be the first!
                  </Text>
                </View>
              }
              contentContainerStyle={{paddingVertical: spacing.sm}}
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '85%',
    minHeight: '55%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
  },
  title: {
    ...typography.h3,
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
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
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
