/**
 * SearchScreen — search posts by content + users by display name.
 *
 * Two modes:
 *  1. Type a query → live-filter posts whose content matches.
 *  2. Switch to "People" tab → live-filter users by display name / bio.
 *
 * Uses Firestore queries with `>=` and `<=` for prefix-style matching.
 */
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PostCard from '@components/PostCard';
import Avatar from '@components/Avatar';
import EmptyState from '@components/EmptyState';
import LoadingSpinner from '@components/LoadingSpinner';
import {usePosts} from '@contexts/PostsContext';
import {useAuth} from '@contexts/AuthContext';
import {firestore, COLLECTIONS} from '@api/firebase';
import {colors, typography, spacing, radii, shadowStyle} from '@theme/index';

const TABS = [
  {key: 'posts', label: 'Posts', icon: 'post-outline'},
  {key: 'people', label: 'People', icon: 'account-search-outline'},
];

export default function SearchScreen({navigation}) {
  const {feed} = usePosts();
  const {user: currentUser} = useAuth();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch users once on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setUsersLoading(true);
      try {
        const snap = await firestore()
          .collection(COLLECTIONS.USERS)
          .limit(100)
          .get();
        if (!cancelled) {
          setUsers(
            snap.docs
              .map(d => ({uid: d.id, ...d.data()}))
              .filter(u => u.uid !== currentUser?.uid),
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid]);

  // Filtered results
  const filteredPosts = useCallback(() => {
    if (!query.trim()) {
      return feed;
    }
    const q = query.trim().toLowerCase();
    return feed.filter(
      p =>
        (p.content || '').toLowerCase().includes(q) ||
        (p.authorName || '').toLowerCase().includes(q),
    );
  }, [feed, query]);

  const filteredUsers = useCallback(() => {
    if (!query.trim()) {
      return users;
    }
    const q = query.trim().toLowerCase();
    return users.filter(
      u =>
        (u.displayName || '').toLowerCase().includes(q) ||
        (u.bio || '').toLowerCase().includes(q),
    );
  }, [users, query]);

  const handleOpenAuthor = useCallback(
    post => {
      Keyboard.dismiss();
      navigation.navigate('UserProfile', {
        userId: post.authorId,
        displayName: post.authorName,
      });
    },
    [navigation],
  );

  const handleOpenUser = useCallback(
    u => {
      Keyboard.dismiss();
      navigation.navigate('UserProfile', {
        userId: u.uid,
        displayName: u.displayName,
      });
    },
    [navigation],
  );

  const renderPost = ({item}) => (
    <PostCard
      post={item}
      currentUser={currentUser}
      onToggleLike={() => {}}
      onOpenComments={() => {}}
      onOpenAuthor={handleOpenAuthor}
    />
  );

  const renderUser = ({item}) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleOpenUser(item)}>
      <Avatar uri={item.photoURL} name={item.displayName} size={44} ring />
      <View style={styles.userMeta}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userBio} numberOfLines={1}>
          {item.bio || 'No bio yet'}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Icon
          name="magnify"
          size={20}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={`Search ${activeTab}…`}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <TouchableOpacity
            onPress={() => setQuery('')}
            hitSlop={8}
            style={styles.clearBtn}>
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}>
            <Icon
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      {activeTab === 'posts' ? (
        <FlatList
          data={filteredPosts()}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="magnify-close"
              title={query ? 'No posts found' : 'Start typing to search'}
              subtitle={
                query
                  ? `No posts match "${query}"`
                  : 'Search for posts by content or author name.'
              }
            />
          }
          keyboardShouldPersistTaps="handled"
        />
      ) : usersLoading ? (
        <LoadingSpinner label="Loading people…" />
      ) : (
        <FlatList
          data={filteredUsers()}
          keyExtractor={item => item.uid}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={
            <EmptyState
              icon="account-search-outline"
              title={query ? 'No people found' : 'No users yet'}
              subtitle={
                query
                  ? `No users match "${query}"`
                  : 'New users will appear here once they sign up.'
              }
            />
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: colors.primary,
  },
  tabLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadowStyle,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    ...typography.label,
    fontWeight: '700',
  },
  userBio: {
    ...typography.caption,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
});
