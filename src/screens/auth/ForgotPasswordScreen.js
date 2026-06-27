/**
 * ForgotPasswordScreen — triggers Firebase password reset email.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormTextInput from '@components/FormTextInput';
import GradientButton from '@components/GradientButton';
import {useAuth} from '@contexts/AuthContext';
import {forgotPasswordSchema} from '@utils/validation';
import {colors, typography, spacing} from '@theme/index';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const {resetPassword, friendlyError} = useAuth();

  const formik = useFormik({
    initialValues: {email: ''},
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        await resetPassword(values.email);
        Alert.alert(
          'Check your inbox',
          `We've sent a password reset link to ${values.email}.`,
          [{text: 'OK', onPress: () => navigation.navigate('Login')}],
        );
      } catch (err) {
        Alert.alert('Failed to send reset email', friendlyError || err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Icon name="email-fast-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <FormTextInput
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            placeholder="you@example.com"
            error={formik.errors.email}
            touched={formik.touched.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            icon={<Icon name="email-outline" size={20} color={colors.textMuted} />}
          />

          <GradientButton
            label="Send Reset Link"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
            disabled={!formik.isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl + 8,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 4,
  },
  form: {
    padding: spacing.xxl,
  },
});
