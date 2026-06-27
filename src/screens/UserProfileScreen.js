/**
 * UserProfileScreen — view another user's public profile + their posts.
 *
 * Reachable from the feed by tapping an author's name/avatar.
 * Subscribes to the user's profile doc + their posts in real time.
 */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute, useNavigation} from '@react-navigation/native';

import Avatar from '@components/Avatar';
import PostCard from '@components/PostCard';
import EmptyState from '@components/EmptyState';
import LoadingSpinner from '@components/LoadingSpinner';
import {useAuth} from '@contexts/AuthContext';
import {getUserProfile} from '@api/users';
import {subscribeToUserPosts} from '@api/posts';
import {colors, typography, spacing, radii, shadowStyle} from '@theme/index';

export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {user: currentUser} = useAuth();
  const {userId, displayName: fallbackName} = route.params || {};

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const p = await getUserProfile(userId);
        if (!cancelled) {
          setProfile(p);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const unsub = subscribeToUserPosts(userId, setPosts, () => {});
    return unsub;
  }, [userId]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <PostCard
        post={item}
        currentUser={currentUser}
        onToggleLike={() => {}}
        onOpenComments={post => navigation.navigate('Comments', {post})}
        onOpenAuthor={null}
      />
    ),
    [currentUser, navigation],
  );

  const header = (
    <View style={styles.headerCard}>
      <Avatar
        uri={profile?.photoURL}
        name={profile?.displayName || fallbackName || 'User'}
        size={96}
        ring
      />
      <Text style={styles.displayName}>
        {profile?.displayName || fallbackName || 'User'}
      </Text>
      {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
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
          <EmptyState
            icon="note-edit-outline"
            title="No posts yet"
            subtitle="This user hasn't posted anything."
          />
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
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadowStyle,
  },
  displayName: {
    ...typography.h2,
    marginTop: spacing.md,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
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
