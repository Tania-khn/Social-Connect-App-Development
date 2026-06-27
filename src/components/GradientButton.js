/**
 * GradientButton — primary CTA button with the brand gradient.
 * Supports a loading state for async actions.
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {gradients, typography, radii, spacing} from '@theme/index';

export default function GradientButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon = null,
  variant = 'primary',
  style,
}) {
  const isDisabled = disabled || loading;
  const gradientColors =
    variant === 'accent' ? gradients.accent : gradients.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, busy: loading}}>
      <View
        style={[
          styles.wrapper,
          isDisabled && styles.disabled,
          style,
        ]}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.content}>
              {icon}
              <Text style={styles.label}>{label}</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    minHeight: 52,
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...typography.button,
  },
});
