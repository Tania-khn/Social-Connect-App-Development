/**
 * DiscoverPeopleScreen — browse all users + follow/unfollow.
 *
 * Fetches all user documents from Firestore `users` collection.
 * Follow state is stored locally for now — to make it persistent,
 * add a `following: string[]` array to the current user's doc and
 * update via `FieldValue.arrayUnion/arrayRemove`.
 */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from '@components/Avatar';
import {useAuth} from '@contexts/AuthContext';
import {firestore, COLLECTIONS} from '@api/firebase';
import {colors, typography, spacing, radii, shadowStyle} from '@theme/index';

export default function DiscoverPeopleScreen({navigation}) {
  const {user: currentUser} = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState({});

  const fetchUsers = useCallback(async () => {
    try {
      const snap = await firestore()
        .collection(COLLECTIONS.USERS)
        .limit(100)
        .get();
      const list = snap.docs
        .map(d => ({uid: d.id, ...d.data()}))
        .filter(u => u.uid !== currentUser?.uid);
      setUsers(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to fetch users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFollow = useCallback(uid => {
    setFollowing(prev => ({...prev, [uid]: !prev[uid]}));
  }, []);

  const handleOpenUser = useCallback(
    u => {
      navigation.navigate('UserProfile', {
        userId: u.uid,
        displayName: u.displayName,
      });
    },
    [navigation],
  );

  const renderItem = ({item}) => {
    const isFollowing = !!following[item.uid];
    return (
      <View style={styles.userCard}>
        <TouchableOpacity
          style={styles.userLeft}
          onPress={() => handleOpenUser(item)}>
          <Avatar
            uri={item.photoURL}
            name={item.displayName || 'User'}
            size={48}
            ring
          />
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{item.displayName}</Text>
            <Text style={styles.userBio} numberOfLines={1}>
              {item.bio || 'No bio yet'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.followBtn,
            isFollowing && styles.followingBtn,
          ]}
          onPress={() => handleFollow(item.uid)}>
          <Text
            style={[
              styles.followBtnText,
              isFollowing && styles.followingBtnText,
            ]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover People</Text>
        <Text style={styles.subtitle}>
          Find and follow people from your community.
        </Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="account-search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>
              Pull down to refresh — new users may appear here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchUsers();
            }}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadowStyle,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
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
  followBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    minWidth: 88,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  followBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  followingBtnText: {
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
