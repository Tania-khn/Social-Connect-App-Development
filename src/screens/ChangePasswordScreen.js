/**
 * ChangePasswordScreen — real password change flow.
 *
 * Collects current password, new password, and confirmation.
 * Validates with Yup (must differ from current, must match confirmation),
 * then calls Firebase re-authenticate + updatePassword.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormTextInput from '@components/FormTextInput';
import GradientButton from '@components/GradientButton';
import {useAuth} from '@contexts/AuthContext';
import {changeUserPassword} from '@api/auth';
import {changePasswordSchema} from '@utils/validation';
import {colors, typography, spacing, radii} from '@theme/index';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const {friendlyError} = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, {setSubmitting, resetForm}) => {
      try {
        await changeUserPassword(
          values.currentPassword,
          values.newPassword,
        );
        setSuccess(true);
        resetForm();
        Alert.alert(
          'Password updated',
          'Your password has been changed successfully. You can continue using the app.',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
      } catch (err) {
        Alert.alert(
          'Could not change password',
          friendlyError || err.message,
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          {/* Info banner */}
          <View style={styles.infoBanner}>
            <Icon
              name="shield-lock-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Choose a strong password you don&apos;t use elsewhere. Your
              password must be at least 6 characters.
            </Text>
          </View>

          <FormTextInput
            label="Current password"
            value={formik.values.currentPassword}
            onChangeText={formik.handleChange('currentPassword')}
            onBlur={formik.handleBlur('currentPassword')}
            placeholder="Enter your current password"
            error={formik.errors.currentPassword}
            touched={formik.touched.currentPassword}
            secureTextEntry={!showCurrent}
            autoCapitalize="none"
            autoComplete="password"
            icon={<Icon name="lock-outline" size={20} color={colors.textMuted} />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowCurrent(s => !s)}
                hitSlop={8}>
                <Icon
                  name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            }
          />

          <FormTextInput
            label="New password"
            value={formik.values.newPassword}
            onChangeText={formik.handleChange('newPassword')}
            onBlur={formik.handleBlur('newPassword')}
            placeholder="At least 6 characters"
            error={formik.errors.newPassword}
            touched={formik.touched.newPassword}
            secureTextEntry={!showNew}
            autoCapitalize="none"
            autoComplete="new-password"
            icon={<Icon name="lock-plus-outline" size={20} color={colors.textMuted} />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowNew(s => !s)}
                hitSlop={8}>
                <Icon
                  name={showNew ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            }
          />

          <FormTextInput
            label="Confirm new password"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            placeholder="Re-enter your new password"
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            autoComplete="new-password"
            icon={<Icon name="lock-check-outline" size={20} color={colors.textMuted} />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirm(s => !s)}
                hitSlop={8}>
                <Icon
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            }
          />

          {/* Password strength hints */}
          <View style={styles.hints}>
            <Text style={styles.hintsTitle}>Password tips:</Text>
            {[
              'Use at least 8 characters',
              'Mix letters, numbers, and symbols',
              'Avoid common words or your name',
              'Don\'t reuse your old password',
            ].map((tip, i) => (
              <View key={i} style={styles.hintRow}>
                <Icon
                  name="check-circle-outline"
                  size={14}
                  color={colors.textMuted}
                />
                <Text style={styles.hintText}>{tip}</Text>
              </View>
            ))}
          </View>

          <GradientButton
            label="Save New Password"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
            disabled={!formik.isValid}
          />

          {success ? (
            <Text style={styles.successText}>
              Password updated successfully.
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.xxl,
    flexGrow: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoText: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.textSecondary,
  },
  hints: {
    marginBottom: spacing.xl,
  },
  hintsTitle: {
    ...typography.label,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 6,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  successText: {
    color: colors.success,
    textAlign: 'center',
    marginTop: spacing.md,
    fontWeight: '600',
  },
});
