/**
 * HomeScreen — main post feed.
 *
 * - Real-time post list from PostsContext
 * - Pull-to-refresh (forces re-subscription via PostsProvider state)
 * - FAB to compose a new post
 * - Tap a post's comment icon to open the CommentModal
 * - Tap an author's name to navigate to their UserProfileScreen
 */
import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

import PostCard from '@components/PostCard';
import CommentModal from '@components/CommentModal';
import LoadingSpinner from '@components/LoadingSpinner';
import EmptyState from '@components/EmptyState';
import {usePosts} from '@contexts/PostsContext';
import {useAuth} from '@contexts/AuthContext';
import {colors, typography, spacing, radii, shadowStyle} from '@theme/index';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {feed, loading, toggleLike, shuffleFeed} = usePosts();
  const {user} = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [commentPost, setCommentPost] = useState(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Visually reorder the feed so the user sees something changed.
    // In production this would correspond to a real refetch / new
    // onSnapshot emit surfacing new or updated posts.
    setTimeout(() => {
      shuffleFeed();
      setRefreshing(false);
    }, 700);
  }, [shuffleFeed]);

  const handleManualRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      shuffleFeed();
      setRefreshing(false);
    }, 800);
  }, [shuffleFeed]);

  const handleOpenComments = useCallback(post => {
    setCommentPost(post);
  }, []);

  const handleOpenAuthor = useCallback(
    post => {
      setCommentPost(null);
      navigation.navigate('UserProfile', {
        userId: post.authorId,
        displayName: post.authorName,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}) => (
      <PostCard
        post={item}
        currentUser={user}
        onToggleLike={toggleLike}
        onOpenComments={handleOpenComments}
        onOpenAuthor={handleOpenAuthor}
      />
    ),
    [user, toggleLike, handleOpenComments, handleOpenAuthor],
  );

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Social Connect</Text>
          <Text style={styles.subGreeting}>Your community, in real time.</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Search')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="magnify" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('DiscoverPeople')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="account-plus-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleManualRefresh}
            disabled={refreshing}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon
              name="refresh"
              size={22}
              color={refreshing ? colors.textMuted : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [navigation, handleManualRefresh, refreshing],
  );

  if (loading && feed.length === 0) {
    return <LoadingSpinner label="Loading feed…" />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={feed}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="post-outline"
            title="No posts yet"
            subtitle="Be the first to share something with your community."
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
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.fabGradient}>
          <Icon name="plus" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      <CommentModal
        visible={!!commentPost}
        post={commentPost}
        onClose={() => setCommentPost(null)}
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  greeting: {
    ...typography.h2,
  },
  subGreeting: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    borderRadius: 32,
    ...shadowStyle,
    elevation: 6,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
