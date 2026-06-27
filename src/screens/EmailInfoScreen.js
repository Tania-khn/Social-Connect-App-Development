/**
 * EmailInfoScreen — display the user's email with copy / share actions.
 *
 * Reachable from Settings → Email row.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Clipboard,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '@contexts/AuthContext';
import {colors, typography, spacing, radii} from '@theme/index';

export default function EmailInfoScreen() {
  const {user} = useAuth();
  const email = user?.email || '—';

  const handleCopy = () => {
    Clipboard.setString(email);
    Alert.alert('Copied', 'Email address copied to clipboard.');
  };

  const handleShare = () => {
    Share.share({message: email});
  };

  const handleEmailSupport = () => {
    Linking.openURL(
      `mailto:support@socialconnect.app?from=${encodeURIComponent(email)}`,
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        {/* Email display card */}
        <View style={styles.emailCard}>
          <View style={styles.iconWrap}>
            <Icon name="email-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.label}>Your email address</Text>
          <Text style={styles.emailValue} selectable>
            {email}
          </Text>
          <Text style={styles.hint}>
            This is the email associated with your Social Connect account.
            You use it to sign in and receive account-related emails.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow} onPress={handleCopy}>
            <Icon name="content-copy" size={22} color={colors.primary} />
            <Text style={styles.actionLabel}>Copy email</Text>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionRow, styles.actionRowLast]}
            onPress={handleShare}>
            <Icon name="share-outline" size={22} color={colors.primary} />
            <Text style={styles.actionLabel}>Share email</Text>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Need help? */}
        <TouchableOpacity
          style={styles.helpCard}
          onPress={handleEmailSupport}>
          <Icon name="lifebuoy" size={22} color={colors.primary} />
          <View style={{flex: 1}}>
            <Text style={styles.helpTitle}>Having trouble with your email?</Text>
            <Text style={styles.helpSubtitle}>Contact our support team</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Security note */}
        <View style={styles.note}>
          <Icon name="shield-check-outline" size={16} color={colors.textMuted} />
          <Text style={styles.noteText}>
            Never share your password. We will never ask for it by email.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
  emailCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  emailValue: {
    ...typography.h2,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionRowLast: {
    borderBottomWidth: 0,
  },
  actionLabel: {
    flex: 1,
    ...typography.body,
    fontWeight: '600',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  helpTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  helpSubtitle: {
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
