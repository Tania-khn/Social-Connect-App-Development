/**
 * PrivacyPolicyScreen — full, readable privacy policy.
 *
 * Real-world apps typically host this as a web page; here we render
 * it inline for offline access and easy review.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, typography, spacing, radii} from '@theme/index';

const LAST_UPDATED = 'June 26, 2026';

const SECTIONS = [
  {
    title: '1. Introduction',
    body:
      'Social Connect ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services. Please read this policy carefully. By using Social Connect, you consent to the practices described here.',
  },
  {
    title: '2. Information We Collect',
    body:
      'We collect the following types of information:\n\n• Account information: display name, email address, and password (stored as a one-way hash).\n• Profile information: bio, profile picture, and any other details you choose to add to your profile.\n• User-generated content: posts, comments, likes, and other interactions.\n• Device and usage information: device type, operating system version, IP address, and analytics events (e.g., screen views, taps).\n• Notification tokens: FCM tokens used to deliver push notifications to your device.',
  },
  {
    title: '3. How We Use Your Information',
    body:
      'We use the collected information to:\n\n• Provide, operate, and maintain the Social Connect service.\n• Authenticate your identity and secure your account.\n• Display your profile and content to other users (as you choose).\n• Send you push notifications about likes, comments, mentions, and other activity.\n• Detect, prevent, and address technical issues, fraud, and abuse.\n• Comply with our legal obligations.',
  },
  {
    title: '4. Sharing Your Information',
    body:
      'We do not sell your personal information. We share information only in the following circumstances:\n\n• Public content: posts and comments you publish are visible to other users of Social Connect.\n• Service providers: we use Firebase (Google LLC) for authentication, database, storage, and push notifications. Google processes your data under its own privacy controls.\n• Legal compliance: we may disclose information when required by law or to protect our rights and the safety of others.\n• Business transfers: in the event of a merger, acquisition, or asset sale, user data may be transferred to the acquiring entity.',
  },
  {
    title: '5. Data Retention',
    body:
      'We retain your information for as long as your account is active. If you delete your account, we will remove your profile, posts, comments, and other personal data within 30 days, except where we are required to retain data for legal reasons.',
  },
  {
    title: '6. Your Privacy Rights',
    body:
      'Depending on your location, you may have the right to:\n\n• Access the personal data we hold about you.\n• Request correction of inaccurate data.\n• Request deletion of your data ("right to be forgotten").\n• Withdraw consent to receive push notifications (via Settings → Notifications).\n• Disable certain data collection by uninstalling the app.\n\nTo exercise these rights, contact us at privacy@socialconnect.app.',
  },
  {
    title: '7. Data Security',
    body:
      'We use industry-standard measures to protect your data, including encrypted transmission (TLS), hashed passwords, and Firestore security rules that prevent unauthorized access. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '8. Children\'s Privacy',
    body:
      'Social Connect is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us so we can delete it.',
  },
  {
    title: '9. Changes to This Policy',
    body:
      'We may update this Privacy Policy from time to time. We will notify you of significant changes by displaying a prominent notice in the app or by sending a push notification. The "Last updated" date at the top reflects the most recent revision.',
  },
  {
    title: '10. Contact Us',
    body:
      'If you have any questions about this Privacy Policy, please contact us:\n\n• Email: privacy@socialconnect.app\n• Support: support@socialconnect.app\n• Mailing address: Social Connect, 123 Example Street, Suite 100, San Francisco, CA 94103, USA',
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Header banner */}
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Icon name="shield-check-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.updated}>Last updated: {LAST_UPDATED}</Text>
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            Your privacy matters to us. This policy describes what information
            Social Connect collects, how we use it, and the choices you have.
          </Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        {/* Contact CTA */}
        <TouchableOpacity
          style={styles.contactCta}
          onPress={() => Linking.openURL('mailto:privacy@socialconnect.app')}>
          <Icon name="email-outline" size={20} color={colors.primary} />
          <Text style={styles.contactCtaText}>Email our privacy team</Text>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

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
  updated: {
    ...typography.caption,
    marginTop: 4,
  },
  introCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  introText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  sectionBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  contactCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  contactCtaText: {
    flex: 1,
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
