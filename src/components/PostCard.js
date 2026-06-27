/**
 * PostCard — single post row used by the feed FlatList.
 *
 * Renders author info, optional image, content, like / comment actions,
 * and timestamps. Tap on author name to navigate to their profile.
 */
import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from './Avatar';
import LikeButton from './LikeButton';
import {colors, typography, spacing, radii, shadowStyle} from '@theme/index';
import {timeAgo} from '@utils/time';

export default function PostCard({
  post,
  currentUser,
  onToggleLike,
  onOpenComments,
  onOpenAuthor,
}) {
  const liked = useMemo(
    () => (post.likedBy || []).includes(currentUser?.uid),
    [post.likedBy, currentUser?.uid],
  );

  const handleAuthorPress = () => {
    if (!onOpenAuthor) {
      return;
    }
    if (post.authorId === currentUser?.uid) {
      // Don't navigate to yourself from the feed — go to own profile tab.
      return;
    }
    onOpenAuthor(post);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAuthorPress}
          disabled={!onOpenAuthor || post.authorId === currentUser?.uid}>
          <Avatar
            uri={post.authorPhotoURL}
            name={post.authorName}
            size={44}
            ring
          />
        </TouchableOpacity>
        <View style={styles.headerMeta}>
          <TouchableOpacity
            onPress={handleAuthorPress}
            disabled={!onOpenAuthor || post.authorId === currentUser?.uid}>
            <Text style={styles.authorName}>{post.authorName}</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {/* Content */}
      {post.content ? (
        <Text style={styles.content}>{post.content}</Text>
      ) : null}

      {/* Optional image */}
      {post.imageURL ? (
        <View style={styles.imageWrap}>
          <Image
            source={{uri: post.imageURL}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <LikeButton
          liked={liked}
          count={post.likeCount || 0}
          onPress={() => onToggleLike(post.id)}
        />
        <Pressable
          onPress={() => onOpenComments(post)}
          hitSlop={8}
          style={({pressed}) => [
            styles.actionBtn,
            pressed && styles.actionPressed,
          ]}>
          <Icon name="comment-outline" size={22} color={colors.textMuted} />
          <Text style={styles.actionCount}>
            {post.commentCount > 0 ? post.commentCount : ''}
          </Text>
        </Pressable>
        <Pressable
          hitSlop={8}
          style={({pressed}) => [
            styles.actionBtn,
            pressed && styles.actionPressed,
          ]}>
          <Icon name="share-outline" size={22} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadowStyle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  headerMeta: {
    flex: 1,
  },
  authorName: {
    ...typography.label,
    fontWeight: '700',
  },
  timestamp: {
    ...typography.caption,
    marginTop: 2,
  },
  content: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  imageWrap: {
    borderRadius: radii.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    minWidth: 36,
  },
  actionPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  actionCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
