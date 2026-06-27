/**
 * LoginScreen — email/password sign-in with Formik + Yup validation.
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
import LinearGradient from 'react-native-linear-gradient';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormTextInput from '@components/FormTextInput';
import GradientButton from '@components/GradientButton';
import {useAuth} from '@contexts/AuthContext';
import {loginSchema} from '@utils/validation';
import {colors, typography, spacing, radii} from '@theme/index';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {signIn, friendlyError} = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {email: '', password: ''},
    validationSchema: loginSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        await signIn(values.email, values.password);
      } catch (err) {
        Alert.alert('Sign in failed', friendlyError || err.message);
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
        {/* Hero */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.hero}>
          <View style={styles.logoCircle}>
            <Icon name="account-group" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Social Connect</Text>
          <Text style={styles.heroSubtitle}>
            Share moments. Start conversations.
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSubtitle}>
            Sign in to continue to your feed.
          </Text>

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
            placeholder="••••••••"
            error={formik.errors.password}
            touched={formik.touched.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
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

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <GradientButton
            label="Sign In"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
            disabled={!formik.isValid}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>New here?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              hitSlop={8}>
              <Text style={styles.switchLink}> Create an account</Text>
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
  },
  hero: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge + 16,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    alignItems: 'center',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  form: {
    padding: spacing.xxl,
  },
  formTitle: {
    ...typography.h2,
    marginBottom: 4,
  },
  formSubtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.xl,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
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
