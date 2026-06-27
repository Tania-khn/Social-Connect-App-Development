/**
 * HelpSupportScreen — real-world help & support options.
 *
 * Sections:
 *  - Quick actions (Email support, Call us, Visit website, Report a problem)
 *  - FAQ (collapsible cards)
 *  - Social media links
 *  - App info (version, build)
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, typography, spacing, radii} from '@theme/index';

const SUPPORT_EMAIL = 'support@socialconnect.app';
const SUPPORT_PHONE = '+1-800-555-0199';
const WEBSITE_URL = 'https://socialconnect.app';
const REPORT_EMAIL = 'abuse@socialconnect.app';

const QUICK_ACTIONS = [
  {
    icon: 'email-outline',
    label: 'Email support',
    subtitle: SUPPORT_EMAIL,
    onPress: () =>
      Linking.openURL(
        `mailto:${SUPPORT_EMAIL}?subject=Social Connect Support`,
      ),
  },
  {
    icon: 'phone-outline',
    label: 'Call us',
    subtitle: SUPPORT_PHONE,
    onPress: () => Linking.openURL(`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, '')}`),
  },
  {
    icon: 'web',
    label: 'Visit website',
    subtitle: 'socialconnect.app',
    onPress: () => Linking.openURL(WEBSITE_URL),
  },
  {
    icon: 'flag-outline',
    label: 'Report a problem',
    subtitle: 'Spam, abuse, or a bug',
    onPress: () =>
      Linking.openURL(
        `mailto:${REPORT_EMAIL}?subject=Report a problem on Social Connect`,
      ),
  },
];

const FAQ = [
  {
    q: 'How do I reset my password?',
    a: 'Go to Settings → Change Password, or use the "Forgot password" link on the login screen to receive a reset email.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Currently, account deletion is initiated by emailing privacy@socialconnect.app. We will remove your data within 30 days of verification.',
  },
  {
    q: 'Can I mute notifications for specific users?',
    a: 'Yes — open the user\'s profile, tap the three-dot menu, and select "Mute notifications". You can also mute all notifications in Settings → Notifications.',
  },
  {
    q: 'Why can\'t I see my post in the feed?',
    a: 'New posts may take a few seconds to appear due to network latency. Pull down on the feed to refresh. If it still doesn\'t appear, check your internet connection or sign out and back in.',
  },
  {
    q: 'How do I report inappropriate content?',
    a: 'Tap the three-dot menu on any post or comment and select "Report". You can also email abuse@socialconnect.app with a screenshot.',
  },
  {
    q: 'Is my data encrypted?',
    a: 'Yes. All data is transmitted over TLS and stored in Firebase, which uses industry-standard encryption at rest. Passwords are one-way hashed and never stored in plain text.',
  },
];

const SOCIAL_LINKS = [
  {
    icon: 'twitter',
    label: 'Twitter',
    handle: '@socialconnect',
    url: 'https://twitter.com',
    color: '#1DA1F2',
  },
  {
    icon: 'instagram',
    label: 'Instagram',
    handle: '@socialconnect',
    url: 'https://instagram.com',
    color: '#E4405F',
  },
  {
    icon: 'facebook',
    label: 'Facebook',
    handle: 'SocialConnect',
    url: 'https://facebook.com',
    color: '#1877F2',
  },
  {
    icon: 'youtube',
    label: 'YouTube',
    handle: 'SocialConnect',
    url: 'https://youtube.com',
    color: '#FF0000',
  },
];

export default function HelpSupportScreen() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleRateApp = () => {
    Alert.alert(
      'Rate Social Connect',
      'Thank you for using Social Connect! Ratings will open in your device\'s app store.',
      [{text: 'OK'}],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Icon name="lifebuoy" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>
            We&apos;re here to help. Reach out anytime.
          </Text>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Contact us</Text>
        <View style={styles.sectionCard}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.actionRow,
                i === QUICK_ACTIONS.length - 1 && styles.actionRowLast,
              ]}
              onPress={action.onPress}>
              <View style={styles.actionIconWrap}>
                <Icon name={action.icon} size={20} color={colors.primary} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Frequently asked questions</Text>
        <View style={styles.sectionCard}>
          {FAQ.map((item, i) => (
            <View
              key={i}
              style={[
                styles.faqRow,
                i === FAQ.length - 1 && styles.faqRowLast,
              ]}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setOpenFaq(openFaq === i ? null : i)}>
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Icon
                  name={openFaq === i ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {openFaq === i ? (
                <Text style={styles.faqAnswer}>{item.a}</Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Follow us */}
        <Text style={styles.sectionTitle}>Follow us</Text>
        <View style={styles.socialGrid}>
          {SOCIAL_LINKS.map((social, i) => (
            <TouchableOpacity
              key={i}
              style={styles.socialCard}
              onPress={() => Linking.openURL(social.url)}>
              <View
                style={[styles.socialIconWrap, {backgroundColor: social.color}]}>
                <Icon name={social.icon} size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.socialLabel}>{social.label}</Text>
              <Text style={styles.socialHandle}>{social.handle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rate app */}
        <TouchableOpacity style={styles.rateCard} onPress={handleRateApp}>
          <Icon name="star-outline" size={24} color="#F59E0B" />
          <View style={{flex: 1}}>
            <Text style={styles.rateTitle}>Enjoying Social Connect?</Text>
            <Text style={styles.rateSubtitle}>
              Rate us on the App Store / Google Play
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>App information</Text>
          <View style={styles.appInfoRow}>
            <Text style={styles.appInfoLabel}>Version</Text>
            <Text style={styles.appInfoValue}>1.0.0</Text>
          </View>
          <View style={styles.appInfoRow}>
            <Text style={styles.appInfoLabel}>Build</Text>
            <Text style={styles.appInfoValue}>2026.06.26</Text>
          </View>
          <View style={styles.appInfoRow}>
            <Text style={styles.appInfoLabel}>Platform</Text>
            <Text style={styles.appInfoValue}>React Native 0.74</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          © 2026 Social Connect. All rights reserved.
        </Text>
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
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
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
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
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  actionSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  faqRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  faqRowLast: {
    borderBottomWidth: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  faqQuestion: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  faqAnswer: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  socialCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    width: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  socialIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  socialLabel: {
    ...typography.label,
  },
  socialHandle: {
    ...typography.caption,
    marginTop: 2,
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  rateTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  rateSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  appInfo: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  appInfoTitle: {
    ...typography.label,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  appInfoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  appInfoValue: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  footer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
