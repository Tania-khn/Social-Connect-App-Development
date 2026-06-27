/**
 * NotificationSettingsScreen — granular push notification controls.
 *
 * Each toggle persists to Firestore users/{uid}/preferences/notifications
 * in real time. The Cloud Functions that send notifications should read
 * these preferences before sending (see functions/index.js).
 */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native';

import {useAuth} from '@contexts/AuthContext';
import {
  subscribeToNotificationPrefs,
  updateNotificationPrefs,
  DEFAULT_NOTIFICATION_PREFS,
} from '@api/users';
import {colors, typography, spacing, radii} from '@theme/index';

const TOGGLE_DEFS = [
  {
    key: 'likes',
    icon: 'heart-outline',
    title: 'Likes',
    subtitle: 'When someone likes your post',
  },
  {
    key: 'comments',
    icon: 'comment-outline',
    title: 'Comments',
    subtitle: 'When someone comments on your post',
  },
  {
    key: 'newFollowers',
    icon: 'account-plus-outline',
    title: 'New followers',
    subtitle: 'When someone starts following you',
  },
  {
    key: 'mentions',
    icon: 'at',
    title: 'Mentions',
    subtitle: 'When someone @mentions you in a post or comment',
  },
  {
    key: 'directMessages',
    icon: 'email-outline',
    title: 'Direct messages',
    subtitle: 'When you receive a new message',
  },
  {
    key: 'emailDigest',
    icon: 'email-newsletter-outline',
    title: 'Email digest',
    subtitle: 'Weekly summary of activity (sent to your email)',
  },
];

export default function NotificationSettingsScreen() {
  const {user} = useAuth();
  const [prefs, setPrefs] = useState(DEFAULT_NOTIFICATION_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const unsub = subscribeToNotificationPrefs(
      user.uid,
      next => {
        setPrefs(next);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [user?.uid]);

  const handleToggle = useCallback(
    (key, value) => {
      // Optimistic update
      setPrefs(prev => ({...prev, [key]: value}));
      updateNotificationPrefs(user.uid, {[key]: value}).catch(err => {
        // Revert on error
        // eslint-disable-next-line no-console
        console.warn('Failed to update pref:', err);
        setPrefs(prev => ({...prev, [key]: !value}));
      });
    },
    [user?.uid],
  );

  const handleOpenSystemSettings = () => {
    Linking.openSettings();
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Mute all banner */}
        <View
          style={[
            styles.muteBanner,
            prefs.muteAll && styles.muteBannerActive,
          ]}>
          <View style={styles.muteBannerLeft}>
            <Icon
              name={prefs.muteAll ? 'bell-off-outline' : 'bell-outline'}
              size={28}
              color={prefs.muteAll ? '#FFFFFF' : colors.primary}
            />
            <View style={styles.muteBannerText}>
              <Text
                style={[
                  styles.muteTitle,
                  prefs.muteAll && styles.muteTitleActive,
                ]}>
                Mute all notifications
              </Text>
              <Text
                style={[
                  styles.muteSubtitle,
                  prefs.muteAll && styles.muteSubtitleActive,
                ]}>
                Pause all push notifications temporarily
              </Text>
            </View>
          </View>
          <Switch
            value={prefs.muteAll}
            onValueChange={v => handleToggle('muteAll', v)}
            trackColor={{
              false: colors.divider,
              true: 'rgba(255, 255, 255, 0.4)',
            }}
            thumbColor={prefs.muteAll ? '#FFFFFF' : colors.surface}
          />
        </View>

        {/* Section: Activity */}
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.sectionCard}>
          {TOGGLE_DEFS.map((def, i) => (
            <ToggleRow
              key={def.key}
              def={def}
              value={!!prefs[def.key]}
              disabled={prefs.muteAll}
              onToggle={v => handleToggle(def.key, v)}
              isLast={i === TOGGLE_DEFS.length - 1}
            />
          ))}
        </View>

        {/* Section: System */}
        <Text style={styles.sectionTitle}>System</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.systemRow}
            onPress={handleOpenSystemSettings}>
            <Icon
              name="cog-outline"
              size={22}
              color={colors.primary}
            />
            <View style={{flex: 1}}>
              <Text style={styles.systemTitle}>
                Open system notification settings
              </Text>
              <Text style={styles.systemSubtitle}>
                Manage OS-level permissions for {Platform.OS}
              </Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Note */}
        <View style={styles.note}>
          <Icon name="information-outline" size={16} color={colors.textMuted} />
          <Text style={styles.noteText}>
            Changes take effect immediately. Mute All overrides all other
            preferences.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({def, value, disabled, onToggle, isLast}) {
  return (
    <View
      style={[styles.toggleRow, isLast && styles.toggleRowLast, disabled && styles.toggleRowDisabled]}>
      <Icon
        name={def.icon}
        size={22}
        color={disabled ? colors.textMuted : colors.primary}
      />
      <View style={{flex: 1}}>
        <Text style={styles.toggleTitle}>{def.title}</Text>
        <Text style={styles.toggleSubtitle}>{def.subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: colors.divider,
          true: colors.primary,
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  muteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  muteBannerActive: {
    backgroundColor: colors.primary,
  },
  muteBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  muteBannerText: {
    flex: 1,
  },
  muteTitle: {
    ...typography.label,
    fontWeight: '700',
  },
  muteTitleActive: {
    color: '#FFFFFF',
  },
  muteSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  muteSubtitleActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  sectionTitle: {
    ...typography.label,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggleRowLast: {
    borderBottomWidth: 0,
  },
  toggleRowDisabled: {
    opacity: 0.5,
  },
  toggleTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  toggleSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  systemTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  systemSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  note: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm,
  },
  noteText: {
    ...typography.caption,
    flex: 1,
  },
});
