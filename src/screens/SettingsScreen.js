/**
 * SettingsScreen — app settings + sign out + notification permission
 * management.
 *
 * Reachable from: Settings bottom tab, or pushed from Profile screen.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '@contexts/AuthContext';
import {colors, typography, spacing, radii} from '@theme/index';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const {signOut, user} = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (err) {
            Alert.alert('Failed to sign out', err.message);
          }
        },
      },
    ]);
  };

  const sections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'email-outline',
          label: 'Email',
          value: user?.email || '—',
          onPress: () => navigation.navigate('EmailInfo'),
        },
        {
          icon: 'account-edit-outline',
          label: 'Edit profile',
          onPress: () =>
            navigation.navigate('ProfileTab', {
              screen: 'ProfileEdit',
            }),
        },
        {
          icon: 'key-outline',
          label: 'Change password',
          onPress: () => navigation.navigate('ChangePassword'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'bell-outline',
          label: 'Notification settings',
          onPress: () => navigation.navigate('NotificationSettings'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {icon: 'information-outline', label: 'Version', value: '1.0.0'},
        {
          icon: 'file-document-outline',
          label: 'Privacy policy',
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
        {
          icon: 'help-circle-outline',
          label: 'Help & support',
          onPress: () => navigation.navigate('HelpSupport'),
        },
      ],
    },
  ];

  const renderRow = (item, idx) => (
    <TouchableOpacity
      key={idx}
      style={styles.row}
      onPress={item.onPress}
      disabled={!item.onPress}>
      <Icon name={item.icon} size={22} color={colors.primary} />
      <Text style={styles.rowLabel}>{item.label}</Text>
      {item.value ? (
        <View style={styles.rowRight}>
          <Text style={styles.rowValue} numberOfLines={1}>
            {item.value}
          </Text>
          {item.onPress ? (
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          ) : null}
        </View>
      ) : item.onPress ? (
        <Icon name="chevron-right" size={22} color={colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map(renderRow)}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Icon name="logout" size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    flex: 1,
    ...typography.body,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: 180,
  },
  rowValue: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: radii.lg,
    marginTop: spacing.sm,
  },
  signOutText: {
    color: colors.error,
    fontWeight: '700',
    fontSize: 16,
  },
});
