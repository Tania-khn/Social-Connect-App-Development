/**
 * FormTextInput — labeled text input with Formik-friendly error display.
 *
 * Designed to drop into Formik forms: just pass `value`, `onChangeText`,
 * `onBlur`, `error`, and `touched` props from Formik's `handleChange` /
 * `handleBlur` / `errors` / `touched`.
 */
import React, {useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, typography, spacing, radii} from '@theme/index';

export default function FormTextInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  touched,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  returnKeyType = 'next',
  onSubmitEditing,
  icon = null,
  rightIcon = null,
  multiline = false,
  numberOfLines = 1,
}) {
  const inputRef = useRef(null);

  const showError = touched && error;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          showError && styles.inputRowError,
          multiline && styles.inputRowMultiline,
        ]}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <TextInput
          ref={inputRef}
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {rightIcon}
      </View>
      {showError ? (
        <Text style={styles.errorText}>
          <Icon name="alert-circle-outline" size={12} /> {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: 6,
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: 100,
    paddingTop: spacing.sm,
  },
  iconWrap: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    padding: 0,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 80,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
