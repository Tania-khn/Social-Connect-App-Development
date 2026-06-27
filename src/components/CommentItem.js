/**
 * CommentItem — single comment row used inside CommentModal / CommentsScreen.
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Avatar from './Avatar';
import {colors, typography, spacing, radii} from '@theme/index';
import {timeAgo} from '@utils/time';

export default function CommentItem({comment, onAuthorPress}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => onAuthorPress?.(comment)}
        activeOpacity={0.7}>
        <Avatar
          uri={comment.authorPhotoURL}
          name={comment.authorName}
          size={36}
        />
      </TouchableOpacity>
      <View style={styles.body}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onAuthorPress?.(comment)}>
            <Text style={styles.author}>{comment.authorName}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{timeAgo(comment.createdAt)}</Text>
        </View>
        <Text style={styles.content}>{comment.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: 2,
  },
  author: {
    ...typography.label,
    fontWeight: '700',
  },
  time: {
    ...typography.caption,
  },
  content: {
    ...typography.body,
    color: colors.text,
  },
});
