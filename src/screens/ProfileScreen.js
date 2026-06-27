/**
 * ProfileScreen — current user's profile.
 *
 * Shows profile picture, name, bio, post count, and the user's own posts
 * in a vertical list. Includes a header with Edit and Settings actions.
 */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import Avatar from '@components/Avatar';
import PostCard from '@components/PostCard';
import EmptyState from '@components/EmptyState';
import LoadingSpinner from '@components/LoadingSpinner';
import {useAuth} from '@contexts/AuthContext';
import {subscribeToUserPosts, deletePost} from '@api/posts';
import {colors, typography, spacing, radii, shadowStyle} from '@theme/index';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {user, profile} = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const unsub = subscribeToUserPosts(
      user.uid,
      list => {
        setPosts(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [user?.uid]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleDeletePost = useCallback(async postId => {
    try {
      await deletePost(postId);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <PostCard
        post={item}
        currentUser={user}
        onToggleLike={() => {}} // likes handled on feed context
        onOpenComments={post =>
          navigation.navigate('Comments', {post})
        }
        onOpenAuthor={null}
      />
    ),
    [user, navigation],
  );

  const header = (
    <View style={styles.headerCard}>
      <View style={styles.headerTop}>
        <Avatar
          uri={profile?.photoURL}
          name={profile?.displayName || user?.displayName || 'You'}
          size={96}
          ring
        />
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('ProfileEdit')}>
            <Icon name="pencil-outline" size={20} color={colors.primary} />
            <Text style={styles.iconBtnLabel}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog-outline" size={20} color={colors.primary} />
            <Text style={styles.iconBtnLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.displayName}>
        {profile?.displayName || user?.displayName || 'New User'}
      </Text>
      <Text style={styles.email}>{profile?.email || user?.email}</Text>
      <Text style={styles.bio}>
        {profile?.bio || 'No bio yet. Tap Edit to add one.'}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    </View>
  );

  if (!user) {
    return <LoadingSpinner label="Loading profile…" />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={
          loading ? (
            <LoadingSpinner label="Loading posts…" />
          ) : (
            <EmptyState
              icon="note-edit-outline"
              title="No posts yet"
              subtitle="Share your first post from the Home tab."
            />
          )
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadowStyle,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: radii.md,
    minWidth: 64,
  },
  iconBtnLabel: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  displayName: {
    ...typography.h2,
  },
  email: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
  },
  statLabel: {
    ...typography.caption,
  },
});
