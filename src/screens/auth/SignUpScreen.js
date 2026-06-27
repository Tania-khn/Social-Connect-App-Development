/**
 * SignUpScreen — email/password sign-up with Formik + Yup validation,
 * including password confirmation.
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormTextInput from '@components/FormTextInput';
import GradientButton from '@components/GradientButton';
import {useAuth} from '@contexts/AuthContext';
import {signUpSchema} from '@utils/validation';
import {colors, typography, spacing} from '@theme/index';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const {signUp, friendlyError} = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        await signUp({
          email: values.email,
          password: values.password,
          displayName: values.displayName,
        });
        // Auth state change will navigate the user into MainTabs.
      } catch (err) {
        Alert.alert('Sign up failed', friendlyError || err.message);
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Join the conversation in under a minute.
          </Text>
        </View>

        <View style={styles.form}>
          <FormTextInput
            label="Display name"
            value={formik.values.displayName}
            onChangeText={formik.handleChange('displayName')}
            onBlur={formik.handleBlur('displayName')}
            placeholder="Your name"
            error={formik.errors.displayName}
            touched={formik.touched.displayName}
            autoCapitalize="words"
            autoComplete="name"
            icon={
              <Icon name="account-outline" size={20} color={colors.textMuted} />
            }
          />

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

          <FormTextInput
            label="Password"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            placeholder="At least 6 characters"
            error={formik.errors.password}
            touched={formik.touched.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            icon={<Icon name="lock-outline" size={20} color={colors.textMuted} />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword(s => !s)}
                hitSlop={8}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            }
          />

          <FormTextInput
            label="Confirm password"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            placeholder="Re-enter your password"
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            icon={<Icon name="lock-check-outline" size={20} color={colors.textMuted} />}
          />

          <GradientButton
            label="Create Account"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
            disabled={!formik.isValid}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              hitSlop={8}>
              <Text style={styles.switchLink}> Sign in</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 4,
  },
  form: {
    padding: spacing.xxl,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  switchText: {
    ...typography.bodySmall,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
